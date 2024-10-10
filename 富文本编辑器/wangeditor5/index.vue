<template>
  <div class="my-weditor">
    <div class="toolbar-wrapper">
      <Toolbar id="editor-toolbar" :editor="editor" :defaultConfig="toolbarConfig" :mode="mode" />
    </div>
    <div id="content" class="custom-editor">
      <Editor v-model="html" :defaultConfig="editorConfig" :mode="mode" @onCreated="onCreated" @onChange="onChange" style="height: 100%" />
      <!-- <div id="editor-container"> </div> -->
    </div>
  </div>
</template>

<script>
  /**
   * 2024-05-23 create
   * <wangeditor :editorHtml="content" @on-change-editor="onChangeEditor($event)" ></wangeditor>
   * onChangeEditor(data) { this.content = data;},
   * 
   */
  import { Editor, Toolbar } from '@wangeditor/editor-for-vue';

  export default {
    name: 'MyWeditor', // 5.0的wangeditor
    components: { Editor, Toolbar },
    props: {
      editorHtml: {
        type: String,
        default: '',
      },
      weditorId: {
        type: String,
        default: 'editor',
      },
      minHeight: {
        type: Number,
        default: 100,
      },
      menusConfig: {
        type: Array,
        default: () => [
          'head', //标题
          'bold', //粗体
          'fontSize', //字号
          'fontName', //字体
          'italic', //斜体
          'underline', //下刘线
          'strikeThrough', //删除线
          'indent', // 缩进
          'lineHeight', // 行高
          'foreColor', //文字颤色
          'backColor', //背景颜色
          'link', //插入链接
          'list', //列表
          'todo', // 代办事项
          'justify', //对齐方式
          'quote', //引用
          'emoticon', //表情
          'image', //插入图片
          'table', //表格
          'video', //插入视频
          'code', //插入代码
          'splitLine', //分割线
          'undo', //撤销
          'redo', //重复
        ],
      },
      zIndex: {
        type: Number,
        default: 100,
      },
      uploadImgUrl: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        editor: '',
        html: '',
        toolbarConfig: {},
        editorConfig: {
          placeholder: '请输入内容...',
          MENU_CONF: {
            uploadImage: {
              server: this.interfaceUrl + '/courseResource/picUploadV2',
              timeout: 5 * 1000, // 5s
              fieldName: 'file',
              metaWithUrl: true, // join params to url
              maxFileSize: 10 * 1024 * 1024, // 10M
              base64LimitSize: 5 * 1024, // insert base64 format, if file's size less than 5kb
              onBeforeUpload(file) {
                console.log('onBeforeUpload', file);
                return file; // will upload this file
              },
              onProgress(progress) {
                console.log('onProgress', progress);
              },
              onSuccess(file, res) {
                console.log('onSuccess', file, res);
              },
              onFailed(file, res) {
                console.log('onFailed', file, res);
              },
              onError(file, err, res) {
                alert(err.message);
                console.error('onError', file, err, res);
              },
            },
            uploadVideo: {
              server: this.interfaceUrl + '/courseResource/videoUpload',
              // server: '/api/upload-img-failed', // test failed
              // server: '/api/xxx', // test 404

              timeout: 5 * 1000, // 5s

              fieldName: 'file',
              metaWithUrl: true, // join params to url

              maxFileSize: 1000 * 1024 * 1024, // 1000M

              onBeforeUpload(file) {
                console.log('onBeforeUpload', file);

                return file; // will upload this file
                // return false // prevent upload
              },
              onProgress(progress) {
                console.log('onProgress', progress);
              },
              onSuccess(file, res) {
                console.log('onSuccess', file, res);
              },
              onFailed(file, res) {
                alert(res.message);
                console.log('onFailed', file, res);
              },
              onError(file, err, res) {
                alert(err.message);
                console.error('onError', file, err, res);
              },
            },
          },
        },
        mode: 'default', // or 'simple'
      };
    },
    created() {
      this.init();
    },
    mounted() {},
    beforeDestroy() {
      if (this.editor) {
        this.editor.destroy();
        this.editor = null;
      }
    },
    watch: {
      editorHtml: {
        handler(val, oldval) {
          this.editor.setHtml(val);
        },
      },
    },
    computed: {},
    methods: {
      init() {
        const toolbar = {
          // toolbarKeys:[
          // ],
          insertKeys: {
            index: 0, // 插入的位置，基于当前的 toolbarKeys
            keys: [],
          },
          // 'group-image',
          excludeKeys: ['codeBlock', 'code', 'fullScreen', 'emotion', 'group-video'],
          modalAppendToBody: false,
        };
        // const editorConfig = {
        //   placeholder: 'Type here...',
        // };
        this.toolbarConfig = toolbar;
        // this.editorConfig = editorConfig;
      },
      onCreated(editor) {
        this.editor = Object.seal(editor); // 一定要用 Object.seal() ，否则会报错
        console.log(this.editor.getConfig().toolbarKeys);
        this.editor.setHtml(this.editorHtml);
        this.$emit('initEditorInstance', editor); // 将创建的富文本编辑器的实例传递给父组件
      },
      onChange(editor) {
        this.$emit('on-change-editor', editor.getHtml());
      },
    },
  };
</script>

<style scoped>
  html,
  body {
    background-color: #fff;
    height: 100%;
    overflow: hidden;
    color: #333;
  }
  .toolbar-wrapper {
    border: 1px solid #e8e8e8;
    position: relative;
  }
  .custom-menu {
    position: absolute;
    display: flex;
    list-style: none;
    top: 50%;
    left: 16px;
    transform: translateY(-50%);
  }
  .custom-menu li {
    margin-left: 8px;
  }
  .custom-editor {
    overflow: auto;
    border: 1px solid #e8e8e8;
    border-top: none;
  }
  #editor-toolbar {
    /* width: 1350px; */
    background-color: #fcfcfc;
    margin: 0 auto;
    /* margin-left: 135px;
  border-left: 1px solid #e8e8e8; */
  }
  #content {
    height: 450px;
    background-color: rgb(245, 245, 245);
    overflow-y: auto;
    position: relative;
  }
  #editor-container {
    width: 1024px;
    min-height: 500px;
    margin: 12px auto 24px auto;
    background-color: #fff;
    padding: 16px 32px;
    border: 1px solid #e8e8e8;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.12);
  }
  #editor-text-area {
    min-height: 558px;
    margin-top: 20px;
  }
</style>

<style>
  .w-e-text-container [data-slate-editor] img.noAnswerPic {
    display: none !important;
  }
  .my-weditor .w-e-text-container {
    /* min-height: 360px; */
  }
  .my-weditor .w-e-select-list {
    margin-top: 40px;
  }
  .my-weditor .w-e-modal {
    padding: 20px 15px 0;
  }
</style>
