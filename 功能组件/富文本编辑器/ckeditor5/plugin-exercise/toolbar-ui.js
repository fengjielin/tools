// toolbar-ui.js
import { Plugin, ButtonView } from 'ckeditor5';
// import imageIcon from '@ckeditor/ckeditor5-core/theme/icons/image.svg';
import { COMMAND_NAME__EXERCISE, TOOLBAR_NAME__EXERCISE, TOOLBAR_LABEL__EXERCISE } from './constant';

// import ExerciseForm from './form/image-form';

export default class ExerciseToolbarUI extends Plugin {
  init() {
    console.log('ExerciseToolbarUI#init() got called');
    this._createToolbarButton();
  }

  _createToolbarButton() {
    const editor = this.editor;
    const command = editor.commands.get(COMMAND_NAME__EXERCISE);

    editor.ui.componentFactory.add(TOOLBAR_NAME__EXERCISE, (locale) => {
      const view = new ButtonView(locale);
      view.set({
        label: TOOLBAR_LABEL__EXERCISE,
        tooltip: true,
        withText: true,
        // icon: imageIcon,
        class: 'toolbar_button_image',
      });

      view.bind('isEnabled').to(command, 'isEnabled');
      view.bind('isOn').to(command, 'value', (value) => !!value);

      // 获取 config 中的传参
      const src = editor.config.get('exercise.src');
      const _vm = editor.config.get('exercise._vm');

      let data = {
        src: src,
        title: '',
        // 下面这些是从之前wangeditor中自定义插件里面需要携带的
        'data-w-e-type': 'exerciseiframe',
        'data-link': src,
        'data-fileName': '',
        'data-type': 'exerciseiframe',
      };
      this.listenTo(view, 'execute', () => {
        console.log(123);
        sessionStorage.setItem('addExercise', 'true');
        editor.execute(COMMAND_NAME__EXERCISE, data);

				// 插入练习模块后，执行保存方法
        _vm.saveResourceV2(editor.getData());
      });

      // this.listenTo(view, 'execute', () => {
      //   this._openDialog(command.value);
      // });

      return view;
    });
  }

  _openDialog(value) {
    console.log(value);
    // const mock = {
    //   src: "//t7.baidu.com/it/u=2621658848,3952322712&fm=193&f=GIF",
    //   title: "测试图片",
    // };
    // this.editor.execute(COMMAND_NAME__EXERCISE, mock);
    // return;
    // new ExerciseForm({
    //   value,
    //   onSubmit: (data) => {
    //     this.editor.execute(COMMAND_NAME__EXERCISE, data);
    //   },
    // });
  }
}
