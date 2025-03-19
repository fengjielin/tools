<template>
  <view class="mine-container" :style="{ height: `${windowHeight}px` }">
    <!--顶部个人信息栏-->
    <view class="header-section">
      <view class="top-oper">
        <el-dadge :value="msgReadCount">
          <view class="iconfont icon-xiaoxi icon" @click="handleToNotice"></view>
        </el-dadge>
        <view class="iconfont icon-saoyisao icon" @click="scanCode"> </view>
      </view>
      <view class="flex padding justify-between" style="padding: 0px 16px 16px">
        <view class="flex align-center">
          <view v-if="!avatar" class="cu-avatar xl round bg-white">
            <view class="iconfont icon-people text-gray icon"></view>
          </view>
          <image v-if="avatar" @click="handleToAvatar" :src="avatar" class="cu-avatar xl round" mode="widthFix">
          </image>
          <view v-if="!name" @click="handleToLogin" class="login-tip"> 点击登录 </view>
          <view v-if="name" @click="handleToInfo" class="user-info">
            <view class="u_title"> 用户名：{{ name }} </view>
          </view>
        </view>
        <view @click="handleToInfo" class="flex align-center" style="flex-shrink: 0">
          <text>个人信息</text>
          <view class="iconfont icon-right" style="font-size: 32rpx"></view>
        </view>
      </view>
    </view>

    <view class="content-section">
      <view class="mine-actions grid col-2 text-center">
        <view class="action-item" @click="handleToMyCredit">
          <view class="iconfont icon-star text-pink icon"></view>
          <text class="text text-pink">答题数:{{ 0 }}</text>
        </view>
        <view class="action-item" @click="handleToResourceStudy">
          <view class="iconfont icon-service text-blue icon"></view>
          <text class="text text-blue">正确率:{{ 0 }}</text>
        </view>
        <view class="action-item" @click="handleToHomework">
          <view class="iconfont icon-zuoye text-mauve icon"></view>
          <text class="text text-mauve">合格考试次数:{{ 0 }}</text>
        </view>
        <view class="action-item" @click="handleToHomework">
          <view class="iconfont icon-rijiben text-green icon"></view>
          <text class="text text-green">待考试次数:{{ 0 }}</text>
        </view>
      </view>
      <view class="menu-list">
        <view class="list-cell list-cell-arrow" @click="handleToEditInfo">
          <view class="menu-item-box">
            <view class="iconfont icon-user menu-icon"></view>
            <view>编辑信息</view>
          </view>
        </view>
        <view class="list-cell list-cell-arrow" @click="handleToSetting">
          <view class="menu-item-box">
            <view class="iconfont icon-setting menu-icon"></view>
            <view>应用设置</view>
          </view>
        </view>
      </view>
    </view>

    <TabBar selected="mine" />
  </view>
</template>

<script>
let Qrcode = require("../../utils/reqrcode.js");

import TabBar from "@/components/TabBar/TabBar.vue";

export default {
  components: { TabBar },
  data() {
    return {
      form: "",
      trainData: "",
      name: this.$store.state.user.name,
      roles: this.$store.state.user.roles,
      version: getApp().globalData.config.appInfo.version,

      msgReadCount: 0,
    };
  },
  onLoad() {
    uni.hideTabBar({
      animation: false,
    });

    // this.getNotReadCount();
  },

  onShow() {},
  computed: {
    avatar() {
      return this.$store.state.user.avatar;
    },
    windowHeight() {
      return uni.getSystemInfoSync().windowHeight - 50;
    },
  },
  methods: {
    formatNumber(number) {
      return Number(number.toFixed(1));
    },

    // 扫码
    scanCode() {
      // #ifdef APP-PLUS || MP-WEIXIN
      this.scanCodeAPP();
      // #endif

      // #ifdef H5
      this.scanCodeH5();
      // #endif
    },
    // APP直接调用 uni.scanCode 接口
    scanCodeAPP() {
      let that = this;
      uni.scanCode({
        scanType: ["qrCode"],
        success: (res) => {
          let r = res.result;
          // console.log(r)
          // 假设二维码中的信息格式为 "code?deadline=timestamp"
          // 从res.result中解析出deadline
          var index = r.lastIndexOf("=");
          let deadlineTimestamp = r.substring(index + 1, r.length);

          index = r.indexOf("?");
          let id = r.substring(0, index);
          // console.log(deadlineTimestamp)
          // console.log(id)
          if (deadlineTimestamp) {
            // 将时间戳转换为Date对象
            let deadline = new Date(parseInt(deadlineTimestamp));
            // 获取当前时间
            let now = new Date();
            // 校验当前时间是否小于deadline
            if (now < deadline) {
              // 当前时间小于deadline，执行签到
              // that.signIn(id);
            } else {
              // 当前时间大于或等于deadline，提示二维码已失效
              uni.showToast({
                title: "该二维码已失效",
                icon: "none",
              });
            }
          } else {
            // 如果没有找到deadline参数，也可以提示用户
            uni.showToast({
              title: "二维码信息不完整",
              icon: "none",
            });
          }
        },
        fail: (err) => {
          // 扫描失败的处理逻辑
          uni.showToast({
            title: "扫描二维码失败",
            icon: "none",
          });
        },
      });
    },
    // H5通过拉起相机拍照来识别二维码
    scanCodeH5() {
      let that = this;
      uni.chooseImage({
        count: 1,
        success: (imgRes) => {
          Qrcode.qrcode.decode(this.getObjectURL(imgRes.tempFiles[0]));
          Qrcode.qrcode.callback = (codeRes) => {
            if (codeRes.indexOf("error") >= 0) {
              // 二维码识别失败
              let qrCodeRes = "不合法二维码：" + codeRes;
              that.$modal.msgError(qrCodeRes);
            } else {
              // 二维码识别成功
              let r = this.decodeStr(codeRes);
              console.log(r, "qrcode");
              // that.signIn(r);
            }
          };
        },
      });
    },
    // 获取文件地址函数
    getObjectURL(file) {
      var url = null;
      if (window.createObjectURL !== undefined) {
        // basic
        url = window.createObjectURL(file);
      } else if (window.URL !== undefined) {
        // mozilla(firefox)
        url = window.URL.createObjectURL(file);
      } else if (window.webkitURL !== undefined) {
        // webkit or chrome
        url = window.webkitURL.createObjectURL(file);
      }
      return url;
    },
    // 解码，输出：中文
    decodeStr(str) {
      var out, i, len, c;
      var char2, char3;
      out = "";
      len = str.length;
      i = 0;
      while (i < len) {
        c = str.charCodeAt(i++);
        switch (c >> 4) {
          case 0:
          case 1:
          case 2:
          case 3:
          case 4:
          case 5:
          case 6:
          case 7:
            // 0xxxxxxx
            out += str.charAt(i - 1);
            break;
          case 12:
          case 13:
            // 110x xxxx 10xx xxxx
            char2 = str.charCodeAt(i++);
            out += String.fromCharCode(((c & 0x1f) << 6) | (char2 & 0x3f));
            break;
          case 14:
            // 1110 xxxx 10xx xxxx 10xx xxxx
            char2 = str.charCodeAt(i++);
            char3 = str.charCodeAt(i++);
            out += String.fromCharCode(((c & 0x0f) << 12) | ((char2 & 0x3f) << 6) | ((char3 & 0x3f) << 0));
            break;
        }
      }
      return out;
    },

    // 消息的未读数量
    getNotReadCount() {
      getNotReadCount().then((response) => {
        this.msgReadCount = response;
      });
    },
    handleToNotice() {
      this.$tab.navigateTo("/pages/mine/notice/index");
    },
    handleToInfo() {
      this.$tab.navigateTo("/pages/mine/info/index");
    },
    handleToEditInfo() {
      this.$tab.navigateTo("/pages/mine/info/edit");
    },
    handleToSetting() {
      this.$tab.navigateTo("/pages/mine/setting/index");
    },
    handleToLogin() {
      this.$tab.reLaunch("/pages/login");
    },
    handleToAvatar() {
      this.$tab.navigateTo("/pages/mine/avatar/index");
    },
    handleLogout() {
      this.$modal.confirm("确定注销并退出系统吗？").then(() => {
        this.$store.dispatch("LogOut").then(() => {
          this.$tab.reLaunch("/pages/index");
        });
      });
    },

    handleAbout() {
      this.$tab.navigateTo("/pages/mine/about/index");
    },
    handleJiaoLiuQun() {
      this.$tab.navigateTo("/pages/space/resourceStudy/index");
      // this.$modal.showToast('QQ群：133713780')
    },
    handleBuilding() {
      this.$modal.showToast("模块建设中~");
    },
  },
};
</script>

<style lang="scss">
page {
  background-color: #f5f6f7;
}

.mine-container {
  width: 100%;
  height: 100%;

  .top-oper {
    display: flex;
    justify-content: flex-end;

    .icon {
      font-size: 44rpx;
      margin-left: 12px;
    }
  }

  .header-section {
    padding: 15px 15px 45px 15px;
    background-color: #3c96f3;
    color: white;

    .login-tip {
      font-size: 18px;
      margin-left: 10px;
    }

    .cu-avatar {
      border: 2px solid #eaeaea;

      .icon {
        font-size: 40px;
      }
    }

    .user-info {
      margin-left: 15px;

      .u_title {
        font-size: 32rpx;
        line-height: 30px;
      }
    }
  }

  .content-section {
    position: relative;
    top: -50px;
    padding-bottom: 60px;

    .mine-actions {
      margin: 15px 15px;
      padding: 20px 0px 0px;
      border-radius: 8px;
      background-color: white;

      .action-item {
        margin-bottom: 10px;
        .icon {
          font-size: 46rpx;
        }

        .text {
          display: block;
          font-size: 26rpx;
          margin: 8px 0px;
        }
      }
    }
  }
}
</style>
