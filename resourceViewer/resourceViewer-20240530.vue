<template>
  <el-dialog :title="title" :visible.sync="visible" :width="width + 'px'" top="5vh" append-to-body @close="close">
    <div style="position: relative" v-if="visible">
      <iframe class="preview_iframe" frameborder="0" marginheight="0" scrolling="auto" :src="path" v-if="!isVideo && !isImg"></iframe>
      <div class="img-wrapper" v-else-if="isImg">
        <img :src="path" alt="" />
      </div>
      <div class="video_content" v-else>
        <div class="video_player" :id="'player' + fileData.id"></div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
  export default {
    name: '',
    components: {},
    props: {
      width: {
        type: [String, Number],
        default: '600',
      },

      fileData: {
        type: [Object],
        default: () => {
          return {};
        },
      },
    },
    data() {
      return {
        loading: false,
        visible: false,

        path: '',
        player: '',
        isImg: false,
        isVideo: false,
        videoUrl: '',
        videoCover: '',
        title: '',
      };
    },
    created() {},
    mounted() {},
    watch: {},
    computed: {},
    methods: {
      // 显示弹框
      show() {
        this.visible = true;
        this.isImg = false;
        this.title = this.fileData.attachName;
        let suffix = extension(this.fileData.attachName);
        if (suffix == '.mp4') {
          this.isVideo = true;
          this.videoUrl = this.interfaceUrl + this.fileData.attachUrl;
          this.videoCover = this.interfaceUrl + this.fileData.resourceLogo;
          this.$nextTick(() => {
            this.loadPlayer();
          });
        } else {
          let url = this.interfaceUrl + this.fileData.attachUrl;
          // this.path = this.openOfficeUrl + encodeURIComponent(this.Base64.encode(url));
          this.path = url;
        }

        //获取后缀名
        function extension(filename) {
          if (!filename) return;
          let suffix = '';
          let name = filename.toLowerCase();
          let i = name.lastIndexOf('.');
          if (i > -1) {
            suffix = name.substring(i);
          }
          return suffix;
        }
      },

      close() {
        this.visible = false;
        this.$emit('close');
        if (this.player) this.player.pause(); // 关闭弹窗时，将视频暂停
      },
      // 文档资源
      preview(id) {
        let params = {
          id: id,
        };
        this.loading = true;
        this.axios
          .post(this.interfaceUrl + '/courseResource/preview', this.qs(params))
          .then((res) => {
            if (res.data.state) {
              let url = this.interfaceUrl + res.data.path;
              this.path = this.openOfficeUrl + encodeURIComponent(Base64.encode(url));
            } else {
              this.$Message.error(`${res.data.msg}`);
            }
            this.loading = false;
          })
          .catch((e) => {
            this.loading = false;
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
            id: 'player' + this.fileData.id,
            source: this.videoUrl,
            // width: 500 + "px",
            height: this.width / 1.5 + 'px',
            cover: this.videoCover ? this.videoCover : '',
            /* 设置封面时需要将 autoplay 和 preload 设置为 false */
            autoplay: false,
            preload: false,
            language: 'zh-cn',
            playsinline: true,
            isLive: false,
          },
          function (player) {},
        );
        this.loading = false;
      },
    },
  };
</script>

<style scoped>
  .video_content {
    width: 100%;
    min-height: 50vh;
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
