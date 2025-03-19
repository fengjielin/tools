<!-- 使用 <doc-viewer v-model="show" @cancel="cancel"></doc-viewer> -->
<template>
  <Modal
    v-model="showModal"
    :title="title"
    :closable="true"
    :mask-closable="false"
    footer-hide
    :width="width"
    :fullscreen="false"
    @on-cancel="closeModal"
    :styles="{ top: '20px' }"
  >
    <div style="position: relative" v-if="showModal">
      <Spin size="large" fix v-if="spinShow"></Spin>
      <iframe
        class="preview_iframe"
        frameborder="0"
        marginheight="0"
        scrolling="auto"
        :src="path"
        v-if="!isVideo && !isImg"
      >
      </iframe>
      <div class="img-wrapper" v-else-if="isImg">
        <img :src="path" alt="" />
      </div>
      <div class="video_content" v-else>
        <div class="video_player" :id="'player' + id"></div>
      </div>
    </div>
  </Modal>
</template>
<script>
export default {
  name: "",
  components: {},
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    id: {
      type: Number,
      default: null,
    },
    title: {
      type: String,
      default: "查看",
    },
    isVideo: {
      type: Boolean,
      default: false,
    },
    videoUrl: {
      type: String,
      default: "",
    },
    videoCover: {
      type: String,
      default: "",
    },
  },
  model: {
    prop: "value",
    event: "on-change",
  },
  data() {
    return {
      spinShow: false,
      showModal: this.value,
      width: "1056",
      path: "",
      player: "",
      isImg: false,
    };
  },
  created() {},
  mounted() {},
  watch: {
    value(val) {
      this.showModal = val;
      if (val) {
        this.setModalIsShow();
      }
    },
  },
  computed: {},
  methods: {
    setModalIsShow() {
      this.showModal = true;
      this.spinShow = true;
      this.isImg = false;
      if (this.id && !this.isVideo) {
        this.preview(this.id);
      } else {
        this.$nextTick(() => {
          this.loadPlayer();
        });
      }
    },
    closeModal() {
      this.showModal = false;
      if (this.player) this.player.pause(); // 关闭弹窗时，将视频暂停
      this.$emit("cancel", false);
    },
    // 文档资源
    preview(id) {
      let params = {
        id: id,
      };
      this.spinShow = true;
      this.axios
        .post(this.interfaceUrl + "/courseResource/preview", this.qs(params))
        .then((res) => {
          if (res.data.state) {
            // if (res.data.type == "img") {
            //   this.path = this.interfaceUrl + res.data.path;
            //   this.isImg = true;
            // } else {
            //   this.path = this.openOfficeUrl + res.data.path;
            // }
            let url = this.interfaceUrl+res.data.path;
            this.path= this.openOfficeUrl+encodeURIComponent(Base64.encode(url));
          } else {
            this.$Message.error(`${res.data.msg}`);
          }
          this.spinShow = false;
        })
        .catch((e) => {
          this.spinShow = false;
          console.error(e);
          this.$Message.error(e.message);
        });
    },
    // 视频资源 加载播放器
    loadPlayer() {
      let $h = window.innerHeight - 120;
      let $w = window.innerWidth - 360;
      if (this.player) {
        this.player.dispose();
      }
      this.player = new Aliplayer(
        {
          id: "player" + this.id,
          source: this.videoUrl,
          // width: 500 + "px",
          height: this.width / 1.5 + "px",
          cover: this.videoCover ? this.videoCover : "",
          /* 设置封面时需要将 autoplay 和 preload 设置为 false */
          autoplay: false,
          preload: false,
          language: "zh-cn",
          playsinline: true,
          isLive: false,
        },
        function (player) {}
      );
      this.spinShow = false;
    },
  },
};
</script>

<style scoped>
.video_content {
  width: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}
.preview_iframe {
  width: 100%;
  height: 800px;
  margin: auto;
  background: #fff;
}
.img-wrapper {
  width: 100%;
  height: 800px;
}
.img-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>

<style>
.video_content .prism-player .prism-big-play-btn {
  width: 90px;
  height: 90px;
  left: 50% !important;
  top: 50% !important;
  transform: translate(-50%, -50%) !important;
}
.video_content .prism-player .prism-big-play-btn .outter {
  width: 90px;
  height: 90px;
}
</style>
