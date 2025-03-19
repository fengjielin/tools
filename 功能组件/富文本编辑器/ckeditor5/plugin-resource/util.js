import { findOptimalInsertionPosition, isWidget } from 'ckeditor5';

import { RESOURCE_CLASS, SCHEMA_NAME__RESOURCE, CUSTOM_PROPERTY__RESOURCE } from './constant';

export function insertResource(model, attributes = {}) {
  // if (!attributes || !attributes.src) {
  //   return;
  // }

	// 循环插入iframe
	// attributes.forEach(data => {
	// 	// 这里需要根据你的实际API来插入iframe
	// 	// 例如，使用editor.model.change()来修改模型并插入iframe的视图表示
	// 	model.change((writer) => {
	// 		const iframeElement = writer.createElement(SCHEMA_NAME__RESOURCE, data);
	// 		// 使用 findOptimalInsertionPosition 方法来获取最佳位置
	// 		// 如果某个选择位于段落的中间，则将返回该段落之前的位置，不拆分当前段落
	// 		// 如果选择位于段落的末尾，则将返回该段落之后的位置
	// 		// const insertAtSelection = findOptimalInsertionPosition(model.document.selection, model);
	// 		model.insertContent(iframeElement);
	// 	});
	// });


	attributes.forEach(data => {

		// 创建一个自定义元素（这里假设 SCHEMA_NAME__RESOURCE 已经在模式中定义）
		model.change(writer => {
			const iframeElement = writer.createElement('resource', data); // 注意：这里使用 'resource' 作为元素名，您应该使用您自己的名称
			// 获取当前选择并确定插入位置
			const selection = model.document.selection;
			const position = selection.isCollapsed ? selection.getFirstPosition() : selection.getAnchor();
			// 插入元素到选择位置或文档末尾（如果没有选择）
			writer.insert(iframeElement, position);
		});
	});


}

// 根据 Model 创建图片 View
export function createResourceViewElement(element, writer, imageConfig, type) {
  // 获取用户配置的 className
  const { className } = imageConfig || {};

  // 使用 createContainerElement 创建容器元素
  const section = writer.createContainerElement('section', {
    class: `${RESOURCE_CLASS} ${className || ''}`,
    style: ``,
    'data-w-e-type': element.getAttribute('data-w-e-type'),
    'data-link': element.getAttribute('data-link'),
    'data-filename': element.getAttribute('data-filename'),
    'data-doctype': element.getAttribute('data-doctype'),
    'data-attachname': element.getAttribute('data-attachname'),
  });

	// 渲染删除按钮, 仅在编辑时,不保存到数据库
  if (type == 'edit') {
    const wrap = writer.createContainerElement('div', {
      class: 'wrap',
      style: `display: flex; justify-content: left;border: 1px solid #dcdee2; padding: 8px; font-size: 16px;`,
    });

    const buttonElement = writer.createContainerElement(
      'button',
      {
        class: `btn btn-error`,
        style: ``,
        'data-name': 'delete-button',
      },
      `删除${element.getAttribute('data-doctype') == 'T02' ? '视频': '文档'}`,
    );
    // console.log(buttonElement);

    writer.insert(writer.createPositionAt(wrap, 0), buttonElement);
    writer.insert(writer.createPositionAt(section, 0), wrap);
  }

  // 使用 createEmptyElement 创建 img 标签，并设置属性
  const iframeElement = writer.createContainerElement('iframe', {
    frameborder: '0',
    scrolling: 'no',
    allowfullscreen: 'true',
    border: '0',
    marginwidth: '0',
    marginheight: '0',
    allowtransparency: 'yes',
    style: 'width: 100%; height: 550px; border: none',
  });
  ['id', 'src', 'title', 'data-doctype'].map((k) => {
    writer.setAttribute(k, element.getAttribute(k), iframeElement);
  });
  writer.insert(writer.createPositionAt(section, 1), iframeElement);

  if (type != 'edit') {
    let dataDocType = element.getAttribute('data-doctype');
    const fullScreenWrap = writer.createContainerElement('span', {
      class: 'full-screen',
      style: `display: ${dataDocType == 'T02' ? 'none' : 'flex'}; justify-content: right;border: 1px solid #dcdee2; padding: 4px 8px; font-size: 16px;`,
      'data-doctype': element.getAttribute('data-doctype'),
    });
    const fullScreenElement = writer.createContainerElement('span', {
      class: 'fa fa-expand',
      style: `display: ${dataDocType == 'T02' ? 'none' : 'block'}; cursor: pointer`,
      'aria-hidden': 'true',
      'data-link': element.getAttribute('data-link'),
      'data-filename': element.getAttribute('data-filename'),
      'data-doctype': element.getAttribute('data-doctype'),
      'data-attachname': element.getAttribute('data-attachname'),
    });
    writer.insert(writer.createPositionAt(fullScreenWrap, 0), fullScreenElement);
    writer.insert(writer.createPositionAt(section, 2), fullScreenWrap);
  }

  return section;
}

// 根据 View 创建图片 Model
export function createResourceModel(view, { writer }) {
  const params = {};
  ['data-w-e-type', 'data-link', 'data-filename', 'data-attachname'].map((k) => {
    params[k] = view.getAttribute(k);
  });
	console.log(params);
  const imageInner = view.getChild(0);
  ['id', 'src', 'title', 'data-doctype'].map((k) => {
    params[k] = imageInner.getAttribute(k);
  });

  return writer.createElement(SCHEMA_NAME__RESOURCE, params);
}

export function getSelectedResourceWidget(selection) {
  const viewElement = selection.getSelectedElement();

  if (viewElement && isResourceWidget(viewElement)) {
    return viewElement;
  }

  return null;
}

export function isResourceWidget(viewElement) {
  return !!viewElement && viewElement.getCustomProperty(CUSTOM_PROPERTY__RESOURCE) && isWidget(viewElement);
}
