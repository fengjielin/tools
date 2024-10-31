// command.js
import { Command } from 'ckeditor5';

import { insertExercise } from './util';

export default class LinkCommand extends Command {
  refresh() {
    const model = this.editor.model;
    const selectedContent = model.getSelectedContent(model.document.selection);
    this.isEnabled = selectedContent.isEmpty;
  }

  execute(data) {
    console.log(1, data);
    const model = this.editor.model;
    insertExercise(model, data);
  }
}
