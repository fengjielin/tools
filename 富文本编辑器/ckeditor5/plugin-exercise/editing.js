import { Plugin, Widget, toWidget } from 'ckeditor5';

import { createExerciseViewElement, createExerciseModel } from './util';
import ExerciseCommand from './command';
import { SCHEMA_NAME__EXERCISE, COMMAND_NAME__EXERCISE, CUSTOM_PROPERTY__EXERCISE, EXERCISE_CLASS, EXERCISE_CONFIG } from './constant';

export default class ExerciseEditing extends Plugin {
  static get requires() {
    return [Widget];
  }

  static get pluginName() {
    return 'ExerciseEditing';
  }

  constructor(editor) {
    super(editor);

    // 配置 EXERCISE_CONFIG 的缺省值
    editor.config.define(EXERCISE_CONFIG, {});

    // 通过 get 方法
    this.imageConfig = editor.config.get(EXERCISE_CONFIG);
  }

  init() {
    console.log('ExerciseEditing#init() got called');
    const editor = this.editor;

    this._defineSchema();
    this._defineConverters();

    editor.commands.add(COMMAND_NAME__EXERCISE, new ExerciseCommand(editor));

    // 监听编辑器区域内的点击事件
    this._enableClickEvent();
  }

  _defineSchema() {
    const schema = this.editor.model.schema;

    // SCHEMA_NAME__EXERCISE --> "image"
    schema.register(SCHEMA_NAME__EXERCISE, {
      isObject: true,
      isBlock: true,
      allowWhere: '$block',
      allowAttributes: ['src', 'title', 'data-w-e-type', 'data-link', 'data-fileName', 'data-type'],
    });
  }

  _defineConverters() {
    const conversion = this.editor.conversion;
    conversion.for('editingDowncast').elementToElement({
      model: SCHEMA_NAME__EXERCISE,
      view: (element, { writer }) => {
        const widgetElement = createExerciseViewElement(element, writer, this.imageConfig, 'edit');
        writer.setCustomProperty(CUSTOM_PROPERTY__EXERCISE, true, widgetElement);
        return toWidget(widgetElement, writer);
      },
    });

    conversion.for('dataDowncast').elementToElement({
      model: SCHEMA_NAME__EXERCISE,
      view: (element, { writer }) => createExerciseViewElement(element, writer, this.imageConfig),
    });

    conversion.for('upcast').elementToElement({
      view: {
        name: 'section',
        classes: EXERCISE_CLASS,
      },
      model: createExerciseModel,
    });
  }

  _enableClickEvent() {
    const editor = this.editor;
    const view = editor.editing.view;
    const viewDocument = view.document;
    this.listenTo(
      viewDocument,
      'click',
      (evt, data) => {
        // console.log(evt, data, data.domTarget);
        let dom = data.domTarget;
        if (dom) {
          // 点击删除按钮时触发
          if (dom.dataset.name == 'delete-button') {
            const model = this.editor.model;
            const iframeElement = model.document.selection.getSelectedElement();
            model.change((writer) => {
              writer.remove(iframeElement);
            });
          }
        }
      },
      { context: '$capture' },
    );
  }
}
