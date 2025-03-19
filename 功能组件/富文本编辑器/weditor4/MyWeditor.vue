<template>
  <!-- <div :id="weditorId" class="weditor"></div> -->
  <div class="weditor">
    <div ref="toobar" class="editor-bar"></div>
    <div
      ref="editor"
      class="editor-content"
      :style="{ 'min-height': minHeight + 'px' }"
      :id="weditorId"
    ></div>
  </div>
</template>

<script>
import E from "wangeditor";

export default {
  name: "",
  components: {},
  props: {
    text: {
      type: String,
      default: "",
    },
    weditorId: {
      type: String,
      default: "weditor",
    },
    minHeight: {
      type: Number,
      default: 100,
    },
    menusConfig: {
      type: Array,
      default: () => [
        "head", //标题
        "bold", //粗体
        "fontSize", //字号
        "fontName", //字体
        "italic", //斜体
        "underline", //下刘线
        "strikeThrough", //删除线
        "indent", // 缩进
        "lineHeight", // 行高
        "foreColor", //文字颤色
        "backColor", //背景颜色
        "link", //插入链接
        "list", //列表
        "todo", // 代办事项
        "justify", //对齐方式
        "quote", //引用
        "emoticon", //表情
        "image", //插入图片
        "table", //表格
        "video", //插入视频
        "code", //插入代码
        "splitLine", //分割线
        "undo", //撤销
        "redo", //重复
      ],
    },
    zIndex: {
      type: Number,
      default: 100,
    },
    uploadImgUrl: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      weditor: "",
      isInit: true, // 是否初始化，解决因为监听重复获取焦点导致多个富文本框焦点切换的问题
    };
  },
  created() {},
  mounted() {
    this.createWeditor(this.weditorId);
    this.weditor.txt.html(this.text);
    let dom = document.querySelector(`#${this.weditorId} .w-e-text`);
    dom.style.minHeight = this.minHeight + "px";
    dom.addEventListener("blur", () => {
      let text = this.weditor.txt.html();
      this.$emit("on-blur", text);
    });
  },
  beforeDestroy() {
    if (this.weditor) {
      this.weditor.destroy();
      this.weditor = null;
    }
  },
  watch: {
    text: {
      handler(val, oldval) {
        if (this.isInit) {
          this.isInit = false;
        }
      },
    },
  },
  computed: {},
  methods: {
    weditorBlur() {
      console.log("失去焦点");
    },
    createWeditor() {
      // this.weditor = new E(`#${id}`); // 为了自适应的高度，将富文本编辑框和tool框分离开来
      this.weditor = new E(this.$refs.toobar, this.$refs.editor);
      // 配置编辑器高度
      this.weditor.config.height = this.minHeight; // 富文本编辑框和tool框分离后这个设置就失效了
      this.weditor.config.zIndex = this.zIndex;
      // 配置编辑器菜单栏，设置不需要的菜单
      this.weditor.config.excludeMenus = ["emoticon", "video"];
      // 禁止展示全屏功能按钮
      this.weditor.config.showFullScreen = false;
      this.weditor.config.menus = this.menusConfig;

      // 配置服务器端地址
      this.weditor.config.uploadImgServer = this.uploadImgUrl;
      // this.interfaceUrl + "/questionSetting/picUpload";
      // 将图片大小限制为 3M
      this.weditor.config.uploadImgMaxSize = 3 * 1024 * 1024;
      // 自定义上传参数
      this.weditor.config.uploadFileName = "file";
      this.weditor.config.uploadImgHooks = {
        // 如果服务器端返回的不是 {errno:0, data: [...]} 这种格式，可使用该配置
        // （但是，服务器端返回的必须是一个 JSON 格式字符串！！！否则会报错）
        customInsert: function (insertImg, result, editor) {
          editor;
          // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
          // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果
          // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
          var url = result.url;
          console.log(url);
          insertImg(url[0]);
          // result 必须是一个 JSON 格式字符串！！！否则报错
        },
      };
      // this.weditor.config.uploadImgShowBase64 = true; // 使用 base64 保存图片

      this.weditor.create();
    },
  },
};
</script>

<style scoped>
.weditor {
  flex: 1;
}
.editor-bar {
  border: 1px solid #c9d8db;
  border-bottom: 1px solid #c9d8db;
}
.editor-content {
  border: 1px solid #c9d8db;
  border-top: none;
  min-height: 100px;
}
</style>
<style>
.editor-content .w-e-text {
  /* min-height: 100px; */
}
</style>