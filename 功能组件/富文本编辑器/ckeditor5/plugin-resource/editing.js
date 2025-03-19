import { Plugin, Widget, toWidget } from 'ckeditor5';

import { createResourceViewElement, createResourceModel } from './util';
import ResourceCommand from './command';
import { SCHEMA_NAME__RESOURCE, COMMAND_NAME__RESOURCE, CUSTOM_PROPERTY__RESOURCE, RESOURCE_CLASS, RESOURCE_CONFIG } from './constant';

export default class ResourceEditing extends Plugin {
  static get requires() {
    return [Widget];
  }

  static get pluginName() {
    return 'ResourceEditing';
  }

  constructor(editor) {
    super(editor);

    // 配置 RESOURCE_CONFIG 的缺省值
    editor.config.define(RESOURCE_CONFIG, {});

    // 通过 get 方法
    this.imageConfig = editor.config.get(RESOURCE_CONFIG);
  }

  init() {
    console.log('ResourceEditing#init() got called');
    const editor = this.editor;

    this._defineSchema();
    this._defineConverters();

    editor.commands.add(COMMAND_NAME__RESOURCE, new ResourceCommand(editor));
  }

  _defineSchema() {
    const schema = this.editor.model.schema;

    // SCHEMA_NAME__RESOURCE --> "image"
    schema.register(SCHEMA_NAME__RESOURCE, {
      isObject: true,
      isBlock: true,
      allowWhere: '$block',
      allowAttributes: ['id', 'src', 'title', 'data-w-e-type', 'data-link', 'data-filename', 'data-attachname', 'data-doctype'],
    });
  }

  _defineConverters() {
    const conversion = this.editor.conversion;
    conversion.for('editingDowncast').elementToElement({
      model: SCHEMA_NAME__RESOURCE,
      view: (element, { writer }) => {
        const widgetElement = createResourceViewElement(element, writer, this.imageConfig, 'edit');
        writer.setCustomProperty(CUSTOM_PROPERTY__RESOURCE, true, widgetElement);
        return toWidget(widgetElement, writer);
      },
    });

    conversion.for('dataDowncast').elementToElement({
      model: SCHEMA_NAME__RESOURCE,
      view: (element, { writer }) => createResourceViewElement(element, writer, this.imageConfig),
    });

    conversion.for('upcast').elementToElement({
      view: {
        name: 'section',
        classes: RESOURCE_CLASS,
      },
      model: createResourceModel,
    });
  }
}
