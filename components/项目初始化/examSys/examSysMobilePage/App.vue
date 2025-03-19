<script>
import config from "./config";
import store from "@/store";
import { getToken } from "@/utils/auth";

export default {
  onLaunch: function (e) {
    uni.hideTabBar({
      animation: false,
    });
    this.initApp(e);
  },
  methods: {
    // 初始化应用
    initApp(e) {
      // 初始化应用配置
      this.initConfig();
      // 检查用户登录状态

      //#ifdef H5
      this.checkLogin();
      //#endif
    },
    initConfig() {
      this.globalData.config = config;
    },
    checkLogin() {
      if (!getToken()) {
        this.$tab.reLaunch("/pages/login");
      } else {
        this.$store.dispatch("GetInfo");
      }
    },
  },
};
</script>

<style lang="scss">
@import "@/static/scss/index.scss";
</style>
