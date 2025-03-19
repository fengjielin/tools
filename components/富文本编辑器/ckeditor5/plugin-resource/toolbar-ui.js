// toolbar-ui.js
import { Plugin, ButtonView } from 'ckeditor5';
// import imageIcon from '@ckeditor/ckeditor5-core/theme/icons/image.svg';
import { COMMAND_NAME__RESOURCE, TOOLBAR_NAME__RESOURCE, TOOLBAR_LABEL__RESOURCE } from './constant';

import Vue from 'vue';
import { h, VNode } from 'snabbdom';

export default class ResourceToolbarUI extends Plugin {
  init() {
    console.log('ResourceToolbarUI#init() got called');
    this._createToolbarButton();
  }

  _createToolbarButton() {
    const editor = this.editor;
    const command = editor.commands.get(COMMAND_NAME__RESOURCE);

    editor.ui.componentFactory.add(TOOLBAR_NAME__RESOURCE, (locale) => {
      const view = new ButtonView(locale);
      view.set({
        label: TOOLBAR_LABEL__RESOURCE,
        tooltip: true,
        withText: true,
        // icon: imageIcon,
        class: 'toolbar_button_image',
      });

      view.bind('isEnabled').to(command, 'isEnabled');
      view.bind('isOn').to(command, 'value', (value) => !!value);

      // 获取 config 中的传参
      const comp = editor.config.get('resource_dialog.comp');
      const _vm = editor.config.get('resource_dialog._vm');
      const type = editor.config.get('resource_dialog.type');
      let data = {
        comp: comp,
        _vm,
        type,
      };
      this.listenTo(view, 'execute', () => {
        this._openDialog(command.value, data);
      });

      return view;
    });
  }

  _openDialog(value, { comp, _vm, type }) {
		console.log(comp, _vm, type);
    console.log(value);
    this.$ele = document.createElement('div');
    this.$ele.id = 'myModal';

    // 在父dom节点创建dom节点
    document.body.appendChild(this.$ele);
    // new一个vue实例
    this.$root = new Vue({
      el: '#myModal',
      render: (h) => {
        return h(comp, {
          ref: 'myModal',
          props: {
            resourceType: type,
            _vm: _vm,
          },
        });
      },
    });

		this.$root.$refs.myModal.init(this.editor, { title: TOOLBAR_LABEL__RESOURCE });
  }
}
