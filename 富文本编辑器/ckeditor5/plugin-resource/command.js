// command.js
import { Command } from 'ckeditor5';

import { insertResource } from './util';

export default class LinkCommand extends Command {
  refresh() {
    const model = this.editor.model;
    const selectedContent = model.getSelectedContent(model.document.selection);
    this.isEnabled = selectedContent.isEmpty;
  }

  execute(data) {
    console.log(1, data);
		try {
			const model = this.editor.model;
			insertResource(model, data);
		} catch (e) {
			alert(e)
		}
  }
}
