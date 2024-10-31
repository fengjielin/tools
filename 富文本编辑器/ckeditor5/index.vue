<template>
  <div class="container">
    <div class="main-container">
      <div class="editor-container editor-container_classic-editor editor-container_include-style editor-container_include-block-toolbar" ref="editorContainerElement">
        <div class="editor-container__editor">
          <div ref="editorElement">
            <ckeditor v-if="isLayoutReady" v-model="config.initialData" :editor="editor" :config="config" @ready="onEditorReady" @input="onEditorInput" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    ClassicEditor,
    AccessibilityHelp,
    Alignment,
    Autoformat,
    AutoImage,
    AutoLink,
    Autosave,
    BalloonToolbar,
    Base64UploadAdapter,
    BlockQuote,
    BlockToolbar,
    Bold,
    Code,
    Essentials,
    FindAndReplace,
    FontBackgroundColor,
    FontColor,
    FontFamily,
    FontSize,
    GeneralHtmlSupport,
    Heading,
    Highlight,
    HorizontalLine,
    ImageBlock,
    ImageCaption,
    ImageInline,
    ImageInsert,
    ImageInsertViaUrl,
    ImageResize,
    ImageStyle,
    ImageTextAlternative,
    ImageToolbar,
    ImageUpload,
    Indent,
    IndentBlock,
    Italic,
    Link,
    LinkImage,
    List,
    ListProperties,
    MediaEmbed,
    PageBreak,
    Paragraph,
    PasteFromOffice,
    RemoveFormat,
    SelectAll,
    SimpleUploadAdapter,
    SpecialCharacters,
    SpecialCharactersArrows,
    SpecialCharactersCurrency,
    SpecialCharactersEssentials,
    SpecialCharactersLatin,
    SpecialCharactersMathematical,
    SpecialCharactersText,
    Strikethrough,
    Style,
    Subscript,
    Superscript,
    Table,
    TableCaption,
    TableCellProperties,
    TableColumnResize,
    TableProperties,
    TableToolbar,
    TextTransformation,
    TodoList,
    Underline,
    Undo,
  } from 'ckeditor5';
  import 'ckeditor5/ckeditor5.css';
  import translations from 'ckeditor5/translations/zh-cn.js';

  import CKEditor from '@ckeditor/ckeditor5-vue2';

  import Timestamp from './Timestamp';

  import Exercise from './plugin-exercise/main';
  import Resource from './plugin-resource/main';

  import MyModal from '@/views/pc/lessonNotes/components/lessonNotesMaking/MyModal.vue';

  export default {
    name: 'ckeditor5-comp',
    components: {
      ckeditor: CKEditor.component,
    },
    props: {
      // 是否自动初始化，是否在父组件中利用refs手动初始化，默认为自动初始化
      autoInit: {
        type: [Boolean],
        default: true,
      },
      initialData: {
        type: [String, Number],
        default: '',
      },
      isTeachingPlan: {
        type: [Boolean],
        default: false,
      },
    },
    data() {
      return {
        isLayoutReady: false,
        editor: ClassicEditor,
        config: null, // CKEditor needs the DOM tree before calculating the configuration.
        parent_vm: null,
      };
    },
    created() {},
    mounted() {
      if (this.autoInit) {
        this.init();
      }
    },
    watch: {
      initialData: {
        handler(newData) {
          if (this.config) {
            this.config.initialData = newData;
          }
        },
        deep: true,
      },
    },
    computed: {},
    methods: {
      init() {
        this.parent_vm = this.$parent;
        let courseId = this.parent_vm.courseId;
        let standarId = this.parent_vm.standarId ? this.parent_vm.standarId : '';
        let teachPlanId = this.parent_vm.teachPlanId;
        let courseTypeId = this.parent_vm.courseTypeId;
        let courseName = this.parent_vm.courseName;
        let courseWareId = this.parent_vm.courseWareId;
        let praticeId = Date.now();
        let exercisePath = this.parent_vm.config.exercisePath;

        this.config = {
          toolbar: {
            items: [
              this.isTeachingPlan ? Resource.pluginName : '',
              this.isTeachingPlan ? Exercise.pluginName : '',
              // 'undo',
              // 'redo',
              '|',
              'findAndReplace',
              '|',
              'heading',
              'style',
              '|',
              'fontSize',
              'fontFamily',
              'fontColor',
              'fontBackgroundColor',
              '|',
              'bold',
              'italic',
              'underline',
              'strikethrough',
              'subscript',
              'superscript',
              'code',
              'removeFormat',
              '|',
              'specialCharacters',
              'horizontalLine',
              'pageBreak',
              'link',
              'insertImage',
              'insertImageViaUrl',
              'mediaEmbed',
              'insertTable',
              'highlight',
              'blockQuote',
              '|',
              'alignment',
              '|',
              'bulletedList',
              'numberedList',
              'todoList',
              'outdent',
              'indent',
            ],
            shouldNotGroupWhenFull: false,
          },
          plugins: [
            AccessibilityHelp,
            Alignment,
            Autoformat,
            AutoImage,
            AutoLink,
            Autosave,
            BalloonToolbar,
            Base64UploadAdapter,
            BlockQuote,
            BlockToolbar,
            Bold,
            Code,
            Essentials,
            FindAndReplace,
            FontBackgroundColor,
            FontColor,
            FontFamily,
            FontSize,
            GeneralHtmlSupport,
            Heading,
            Highlight,
            HorizontalLine,
            ImageBlock,
            ImageCaption,
            ImageInline,
            ImageInsert,
            ImageInsertViaUrl,
            ImageResize,
            ImageStyle,
            ImageTextAlternative,
            ImageToolbar,
            ImageUpload,
            Indent,
            IndentBlock,
            Italic,
            Link,
            LinkImage,
            List,
            ListProperties,
            MediaEmbed,
            PageBreak,
            Paragraph,
            PasteFromOffice,
            RemoveFormat,
            SelectAll,
            SimpleUploadAdapter,
            SpecialCharacters,
            SpecialCharactersArrows,
            SpecialCharactersCurrency,
            SpecialCharactersEssentials,
            SpecialCharactersLatin,
            SpecialCharactersMathematical,
            SpecialCharactersText,
            Strikethrough,
            Style,
            Subscript,
            Superscript,
            Table,
            TableCaption,
            TableCellProperties,
            TableColumnResize,
            TableProperties,
            TableToolbar,
            TextTransformation,
            TodoList,
            Underline,
            Undo,
            Timestamp,
            Exercise,
            Resource,
          ],
          balloonToolbar: ['bold', 'italic', '|', 'link', 'insertImage', '|', 'bulletedList', 'numberedList'],
          blockToolbar: ['fontSize', 'fontColor', 'fontBackgroundColor', '|', 'bold', 'italic', '|', 'link', 'insertImage', 'insertTable', '|', 'bulletedList', 'numberedList', 'outdent', 'indent'],
          fontFamily: {
            supportAllValues: true,
          },
          fontSize: {
            options: [10, 12, 14, 'default', 18, 20, 22],
            supportAllValues: true,
          },
          heading: {
            options: [
              {
                model: 'paragraph',
                title: 'Paragraph',
                class: 'ck-heading_paragraph',
              },
              {
                model: 'heading1',
                view: 'h1',
                title: 'Heading 1',
                class: 'ck-heading_heading1',
              },
              {
                model: 'heading2',
                view: 'h2',
                title: 'Heading 2',
                class: 'ck-heading_heading2',
              },
              {
                model: 'heading3',
                view: 'h3',
                title: 'Heading 3',
                class: 'ck-heading_heading3',
              },
              {
                model: 'heading4',
                view: 'h4',
                title: 'Heading 4',
                class: 'ck-heading_heading4',
              },
              {
                model: 'heading5',
                view: 'h5',
                title: 'Heading 5',
                class: 'ck-heading_heading5',
              },
              {
                model: 'heading6',
                view: 'h6',
                title: 'Heading 6',
                class: 'ck-heading_heading6',
              },
            ],
          },
          htmlSupport: {
            allow: [
              {
                name: /^.*$/,
                styles: true,
                attributes: true,
                classes: true,
              },
            ],
          },
          image: {
            toolbar: ['toggleImageCaption', 'imageTextAlternative', '|', 'imageStyle:inline', 'imageStyle:wrapText', 'imageStyle:breakText', '|', 'resizeImage'],
          },
          initialData: '',
          // '<h2>Congratulations on setting up CKEditor 5! 🎉</h2>\n<p>\n    You\'ve successfully created a CKEditor 5 project. This powerful text editor will enhance your application, enabling rich text editing\n    capabilities that are customizable and easy to use.\n</p>\n<h3>What\'s next?</h3>\n<ol>\n    <li>\n        <strong>Integrate into your app</strong>: time to bring the editing into your application. Take the code you created and add to your\n        application.\n    </li>\n    <li>\n        <strong>Explore features:</strong> Experiment with different plugins and toolbar options to discover what works best for your needs.\n    </li>\n    <li>\n        <strong>Customize your editor:</strong> Tailor the editor\'s configuration to match your application\'s style and requirements. Or even\n        write your plugin!\n    </li>\n</ol>\n<p>\n    Keep experimenting, and don\'t hesitate to push the boundaries of what you can achieve with CKEditor 5. Your feedback is invaluable to us\n    as we strive to improve and evolve. Happy editing!\n</p>\n<h3>Helpful resources</h3>\n<ul>\n    <li>📝 <a href="https://orders.ckeditor.com/trial/premium-features">Trial sign up</a>,</li>\n    <li>📕 <a href="https://ckeditor.com/docs/ckeditor5/latest/installation/index.html">Documentation</a>,</li>\n    <li>⭐️ <a href="https://github.com/ckeditor/ckeditor5">GitHub</a> (star us if you can!),</li>\n    <li>🏠 <a href="https://ckeditor.com">CKEditor Homepage</a>,</li>\n    <li>🧑‍💻 <a href="https://ckeditor.com/ckeditor-5/demo/">CKEditor 5 Demos</a>,</li>\n</ul>\n<h3>Need help?</h3>\n<p>\n    See this text, but the editor is not starting up? Check the browser\'s console for clues and guidance. It may be related to an incorrect\n    license key if you use premium features or another feature-related requirement. If you cannot make it work, file a GitHub issue, and we\n    will help as soon as possible!\n</p>\n',
          language: 'zh-cn',
          link: {
            addTargetToExternalLinks: true,
            defaultProtocol: 'https://',
            decorators: {
              toggleDownloadable: {
                mode: 'manual',
                label: 'Downloadable',
                attributes: {
                  download: 'file',
                },
              },
            },
          },
          list: {
            properties: {
              styles: true,
              startIndex: true,
              reversed: true,
            },
          },
          menuBar: {
            isVisible: true,
          },
          placeholder: '请输入或粘贴内容',
          style: {
            definitions: [
              {
                name: 'Article category',
                element: 'h3',
                classes: ['category'],
              },
              {
                name: 'Title',
                element: 'h2',
                classes: ['document-title'],
              },
              {
                name: 'Subtitle',
                element: 'h3',
                classes: ['document-subtitle'],
              },
              {
                name: 'Info box',
                element: 'p',
                classes: ['info-box'],
              },
              {
                name: 'Side quote',
                element: 'blockquote',
                classes: ['side-quote'],
              },
              {
                name: 'Marker',
                element: 'span',
                classes: ['marker'],
              },
              {
                name: 'Spoiler',
                element: 'span',
                classes: ['spoiler'],
              },
              {
                name: 'Code (dark)',
                element: 'pre',
                classes: ['fancy-code', 'fancy-code-dark'],
              },
              {
                name: 'Code (bright)',
                element: 'pre',
                classes: ['fancy-code', 'fancy-code-bright'],
              },
            ],
          },
          table: {
            contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties'],
          },
          translations: [translations],
          exercise: {
            src: `${exercisePath.value}?praticeId=${praticeId}&courseId=${courseId}&courseName=${courseName}&teachPlanId=${teachPlanId}&courseWareId=${courseWareId}&courseTypeId=${courseTypeId}&standarId=${standarId}`,
            _vm: {
              saveResourceV2: this.parent_vm.saveResourceV2,
            },
          },
          resource_dialog: {
            comp: MyModal,
            _vm: {
              saveResourceV2: this.parent_vm.saveResourceV2,
              teachPlanId: this.parent_vm.teachPlanId,
              resourcesT02IsRelation: this.parent_vm.resourcesT02IsRelation,
            },
            type: 'T02',
          },
        };
        this.config.initialData = this.initialData;
        this.isLayoutReady = true;
      },
      onEditorInput(value) {
        this.$emit('on-change-editor', value);
      },
      onEditorReady(editor) {
        console.log('editor#onEditorReady() got called', editor);
        this.$emit('initEditorInstance', editor); // 将创建的富文本编辑器的实例传递给父组件
      },
    },
  };
</script>

<style scoped lang="less">
  /deep/ .ck-powered-by-balloon {
    display: none !important;
  }

  /deep/ .ck-editor__main {
    height: calc(100% - 40px);
    overflow-y: auto;

    .ck-content {
      height: 585px;
    }
  }
</style>
