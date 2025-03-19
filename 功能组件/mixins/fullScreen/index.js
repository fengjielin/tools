export const mixinsFullScreen = {
  data() {
    return {
      isScreen: null,
      domKey: '',
      // fullScreenDom: document,
    };
  },
  created() {
    //钩子函数
    console.log('这是混入的组件_监听全屏事件');
  },
  mounted() {
    this.init();
    window.addEventListener('resize', this.changeIsFullScreen, false);
  },
  beforeDestroy() {
    this.removeFullScreenListener();
    window.removeEventListener('resize', this.changeIsFullScreen, false);
    window.removeEventListener('keydown', this.addKeydown);
  },
  computed: {
    fullScreenDom() {
      if (this.domKey) {
        let div = document.getElementById(this.domKey);
        if (div) {
          return div;
        }
      }
      return document;
    },
  },
  methods: {
    changeIsFullScreen() {
      console.log('缩放了');
      if (!this.isScreen && this.lockScreen) {
        this.launchFullscreen();
      }
    },
    /* 初始化监听 */
    init() {
      this.getFullScreenChange();
      this.addFullScreenListener(this.getFullScreenChange);
      window.addEventListener('keydown', this.addKeydown);
    },

    /* 是否全屏 */
    isFullScreen() {
      return !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
    },
    addKeydown(event) {
      this.handleKeyDown(event);
      if (['F11', 'Escape'].includes(event.code)) {
        console.log(event);
        this.getWinHeight();
        event.preventDefault();
      }
    },
    /* 全屏监听事件 */
    addFullScreenListener(callback) {
      const eventArrs = ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'];
      eventArrs.forEach((item) => document.addEventListener(item, callback));
      return () => eventArrs.forEach((item) => document.removeEventListener(item, callback));
    },
    /* 移除监听事件 */
    removeFullScreenListener() {
      document.removeEventListener('keydown', this.handleKeyDown);
    },
    /* 获取全屏状态 */
    getFullScreenChange() {
      if (this.isFullScreen()) {
        this.isScreen = true;
        console.log('已进入全屏');
      } else {
        this.isScreen = false;
        console.log('已退出全屏');
      }
    },
    /* 全屏状态下的监听 */
    handleKeyDown(event) {
      if (['Escape'].includes(event.code) && this.isFullScreen() && !this.banExit) {
        exitFullscreen();
      }
    },
    /* 判断全屏高度条件 */
    getWinHeight() {
      const winHeight = screen.height;
      const domHeight = document.documentElement.clientHeight;
      const resHeight = winHeight - domHeight;
      if (resHeight < 100) {
        // this.exitFullscreen();
      } else {
        this.launchFullscreen();
      }
    },

    //开启浏览器全屏
    launchFullscreen() {
      const element = this.fullScreenDom.documentElement || this.fullScreenDom;
      console.log({ element: element, requestFullscreen: element.requestFullscreen });
      if (element?.requestFullscreen) {
        element?.requestFullscreen();
      } else if (element?.mozRequestFullScreen) {
        element?.mozRequestFullScreen();
      } else if (element?.webkitRequestFullscreen) {
        element?.webkitRequestFullscreen();
      } else if (element?.msRequestFullscreen) {
        element?.msRequestFullscreen();
      }
    },
    // 关闭浏览器全屏
    exitFullscreen() {
      const element = this.fullScreenDom;
      if (element?.exitFullscreen) {
        element?.exitFullscreen();
      } else if (element?.mozCancelFullScreen) {
        element?.mozCancelFullScreen();
      } else if (element?.webkitExitFullscreen) {
        element?.webkitExitFullscreen();
      }
    },
  },
};
