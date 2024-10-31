import { Plugin } from 'ckeditor5';
import ToolbarUI from './toolbar-ui';
import Editing from './editing';

import { TOOLBAR_NAME__EXERCISE } from './constant';
import './index.less';

export default class Exercise extends Plugin {
  static get requires() {
    return [Editing, ToolbarUI];
  }
  static get pluginName() {
    return TOOLBAR_NAME__EXERCISE;
  }
}
