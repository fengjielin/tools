<template>
  <view class="normal-login-container forgot-password">
    <!-- <view class="logo-content align-center justify-center flex">
			<image style="width: 100rpx;height: 100rpx;" :src="globalConfig.appInfo.logo" mode="widthFix">
			</image>
			<text class="title">教师培训管理平台</text>
		</view> -->
    <view class="login-form-content">
      <uni-section title="信息验证" type="line" v-if="step < 2">
        <!-- 第一步 输入账号 查询 账号是否存在 -->
        <view class="" v-if="step == 0">
          <view class="input-item flex align-center">
            <view class="iconfont icon-user icon"></view>
            <input
              v-model="form.username"
              class="input"
              type="text"
              placeholder="请输入账号"
              maxlength="30"
              id="username"
            />
          </view>
        </view>

        <!-- 第二步 输入 姓名和手机 校验用户信息是否正确 -->
        <view class="" v-if="step == 1">
          <view class="input-item flex align-center">
            <view class="iconfont icon-user icon"></view>
            <input v-model="form.name" class="input" type="text" placeholder="请输入姓名" maxlength="30" id="name" />
          </view>
          <view class="input-item flex align-center">
            <view class="iconfont icon-shouji icon"></view>
            <input
              v-model="form.phone"
              class="input"
              type="text"
              placeholder="请输入手机号码"
              maxlength="11"
              id="phone"
            />
          </view>
        </view>
      </uni-section>

      <uni-section title="修改密码" type="line" v-if="step == 2">
        <!-- 第三步 新密码重置 -->
        <view class="" v-if="step == 2">
          <view class="input-item flex align-center">
            <view class="iconfont icon-password icon"></view>
            <input
              v-model="form.password"
              type="password"
              class="input"
              placeholder="请输入密码"
              maxlength="20"
              id="password"
            />
          </view>
          <view class="input-item flex align-center">
            <view class="iconfont icon-password icon"></view>
            <input
              v-model="form.passwordRepeat"
              type="password"
              class="input"
              placeholder="确认密码"
              maxlength="20"
              id="password"
            />
          </view>
        </view>
      </uni-section>

      <view class="action-btn">
        <button @click="nextStep" class="login-btn cu-btn block bg-blue lg round">
          <template v-if="step < 2">下一步</template>
          <template v-if="step == 2">重置密码</template>
        </button>
      </view>
    </view>
  </view>
</template>

<script>
import { listPublicUser, resetPwdPublic } from "@/api/system/user";
// import { selectStudentByParams } from "@/api/base/student.js";
import config from "@/config";

export default {
  data() {
    return {
      codeUrl: "",
      captchaEnabled: true,
      globalConfig: getApp().globalData.config,
      form: {
        username: "",
        password: "",
        name: "",
        phone: "",
        code: "",
        uuid: "",
      },

      usernameIsFocus: true,
      passwordIsFocus: false,

      step: 0,
    };
  },
  created() {
    const baseUrl = config.baseUrl;
    console.log("baseUrl: ", baseUrl);
  },
  methods: {
    usernameFocus() {
      console.log("usernameFocus");
      this.usernameIsFocus = true;
      this.passwordIsFocus = false;
    },
    passwordFocus() {
      console.log("passwordFocus");
      this.usernameIsFocus = false;
      this.passwordIsFocus = true;
    },

    nextStep() {
      if (this.step == 0) {
        if (this.form.username === "") {
          this.$modal.msgError("请输入您的账号");
        }
        let params = {
          userName: this.form.username,
        };
        this.getListUser(params).then((res) => {
          if (!res.data) {
            this.$modal.alert("账号信息错误，请重新输入");
          } else {
            this.step++;
          }
        });
      } else if (this.step == 1) {
        if (this.form.name === "") {
          this.$modal.alert("请输入您的姓名");
        } else if (this.form.phone === "") {
          this.$modal.alert("请输入手机号码");
        }
        let params = {
          name: this.form.name,
          phone: this.form.phone,
          userName: this.form.username,
        };
        this.getselectStudentByParams(params).then((res) => {
          if (!res.data) {
            this.$modal.alert("学员信息错误，请重新输入");
          } else {
            this.userId = res.data.userId;
            this.step++;
          }
        });
      } else if (this.step == 2) {
        if (this.form.password === "") {
          this.$modal.alert("请输入您的密码");
        } else if (this.form.passwordRepeat === "") {
          this.$modal.alert("请再次输入密码");
        } else if (this.form.password !== this.form.passwordRepeat) {
          this.$modal.alert("两次输入的密码不一致");
        } else if (this.form.password.length < 6 || this.form.password.length > 20) {
          this.$modal.alert("密码长度在 6 到 20 个字符");
        } else {
          this.$modal.loading("重置中，请耐心等待...");
          resetPwdPublic(this.userId, this.form.password).then((res) => {
            this.$modal.closeLoading();
            if (res.code == 200) {
              this.$modal.confirm("重置成功，新密码是：" + this.form.password).then(() => {
                this.$tab.reLaunch("/pages/login");
              });
            }
          });
        }
      }
    },

    // 检查账号，根据账号查询是否在系统内已经注册
    getListUser(params) {
      return new Promise((resolve, reject) => {
        this.$modal.loading("查询中，请耐心等待...");
        listPublicUser(params).then((res) => {
          this.$modal.closeLoading();
          resolve(res);
        });
      });
    },

    // 检查学员，根据姓名、手机号查询学员信息是否在系统内
    getselectStudentByParams(params) {
      return new Promise((resolve, reject) => {
        this.$modal.loading("查询中，请耐心等待...");
        selectStudentByParams(params).then((res) => {
          this.$modal.closeLoading();
          resolve(res);
        });
      });
    },
  },
};
</script>

<style lang="scss">
page {
  background-color: #ffffff;
}

.link-type {
  color: #337ab7;
  cursor: pointer;
}

.normal-login-container {
  width: 100%;

  .logo-content {
    width: 100%;
    font-size: 21px;
    text-align: center;
    padding-top: 15%;

    image {
      border-radius: 4px;
    }

    .title {
      margin-left: 10px;
    }
  }

  .login-form-content {
    text-align: center;
    margin: 20px auto;
    margin-top: 15%;
    width: 80%;

    .input-item {
      margin: 20px auto;
      background-color: #f5f6f7;
      height: 45px;
      border-radius: 20px;

      .icon {
        font-size: 38rpx;
        margin-left: 10px;
        color: #999;
      }

      .input {
        width: 100%;
        font-size: 14px;
        line-height: 20px;
        text-align: left;
        padding-left: 15px;
      }
    }

    .login-btn {
      margin-top: 40px;
      height: 45px;
    }

    .xieyi {
      color: #333;
      margin-top: 20px;
    }

    .login-code {
      height: 38px;
      float: right;

      .login-code-img {
        height: 38px;
        position: absolute;
        margin-left: 10px;
        width: 200rpx;
      }
    }
  }
}

.forgot-password .distraction {
  text-align: left;
}
</style>
