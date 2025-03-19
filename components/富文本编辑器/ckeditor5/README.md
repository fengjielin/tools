CKEditor 5 摸爬滚打（一）—— 从零构建定制化工程项目
https://www.cnblogs.com/wisewrong/p/14325817.html

CKEditor5 支持 WPS 贴贴文字图片，默认贴贴进入空白空格
https://blog.csdn.net/zz00008888/article/details/125741382


```javascript
<ckeditor5
  :ref="'ckeditor5Ref_' + item.id"
  :data-id="item.id"
  :initialData="item.resourceContent"
  :isTeachingPlan="true"
  :autoInit="false"
  @on-change-editor="onChangeEditor"
  @initEditorInstance="initEditorInstance($event, item)"
  v-for="item in courseColumns"
  :key="'ckeditor5Ref_' + item.id"
></ckeditor5>
```