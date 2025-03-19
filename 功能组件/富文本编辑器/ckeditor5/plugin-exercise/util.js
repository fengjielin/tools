import { findOptimalInsertionPosition, isWidget } from 'ckeditor5';

import { EXERCISE_CLASS, SCHEMA_NAME__EXERCISE, CUSTOM_PROPERTY__EXERCISE } from './constant';

export function insertExercise(model, attributes = {}) {
  // if (!attributes || !attributes.src) {
  //   return;
  // }

  model.change((writer) => {
    const iframeElement = writer.createElement(SCHEMA_NAME__EXERCISE, attributes);
    // 使用 findOptimalInsertionPosition 方法来获取最佳位置
    // 如果某个选择位于段落的中间，则将返回该段落之前的位置，不拆分当前段落
    // 如果选择位于段落的末尾，则将返回该段落之后的位置
    // const insertAtSelection = findOptimalInsertionPosition(model.document.selection, model);
    model.insertContent(iframeElement);
  });
}

// 根据 Model 创建图片 View
export function createExerciseViewElement(element, writer, imageConfig, type) {
  // 获取用户配置的 className
  const { className } = imageConfig || {};

  // 使用 createContainerElement 创建容器元素
  const section = writer.createContainerElement('section', {
    class: `${EXERCISE_CLASS} ${className || ''}`,
    style: ``,
    'data-w-e-type': element.getAttribute('data-w-e-type'),
    'data-link': element.getAttribute('data-link'),
    'data-fileName': element.getAttribute('data-fileName'),
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
      '删除章节练习',
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
    style: 'width: 100%; max-height: 550px; border: none',
  });
  ['src', 'title', 'data-type'].map((k) => {
    writer.setAttribute(k, element.getAttribute(k), iframeElement);
  });
  // 将 img 作为子节点插入到 section
  writer.insert(writer.createPositionAt(section, 1), iframeElement);
  return section;
}

// 根据 View 创建图片 Model
export function createExerciseModel(view, { writer }) {
  const params = {};
  ['data-w-e-type', 'data-link', 'data-fileName'].map((k) => {
    params[k] = view.getAttribute(k);
  });
  const imageInner = view.getChild(0);
  ['src', 'title', 'data-type'].map((k) => {
    params[k] = imageInner.getAttribute(k);
  });

  return writer.createElement(SCHEMA_NAME__EXERCISE, params);
}

export function getSelectedExerciseWidget(selection) {
  const viewElement = selection.getSelectedElement();

  if (viewElement && isExerciseWidget(viewElement)) {
    return viewElement;
  }

  return null;
}

export function isExerciseWidget(viewElement) {
  return !!viewElement && viewElement.getCustomProperty(CUSTOM_PROPERTY__EXERCISE) && isWidget(viewElement);
}
