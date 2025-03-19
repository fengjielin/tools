<template>
  <view class="pwd-retrieve-container">
    <uni-forms ref="form" :value="user" labelWidth="120px" label-position="top">
      <uni-section title="基础信息" type="line">
        <uni-forms-item name="name" label="姓名">
          <uni-easyinput type="text" v-model="user.name" placeholder="请输入姓名" />
        </uni-forms-item>
        <uni-forms-item name="sex" label="性别">
          <uni-data-select v-model="user.sex" :localdata="sexes"></uni-data-select>
        </uni-forms-item>
        <uni-forms-item name="nation" label="请输入民族">
          <uni-data-select v-model="user.nation" :localdata="nations"></uni-data-select>
        </uni-forms-item>
      </uni-section>

      <uni-section title="详细信息" type="line">
        <uni-forms-item name="education" label="学历/学位">
          <uni-data-select v-model="user.education" :localdata="educationTypes"></uni-data-select>
        </uni-forms-item>
        <uni-forms-item name="workUnit" label="工作单位">
          <uni-easyinput type="text" v-model="user.workUnit" placeholder="请输入工作单位" />
        </uni-forms-item>
        <uni-forms-item name="professionalTitle" label="职称">
          <uni-easyinput type="text" v-model="user.professionalTitle" placeholder="请输入职称" />
        </uni-forms-item>
        <uni-forms-item name="post" label="职务">
          <uni-easyinput type="text" v-model="user.post" placeholder="请输入职务" />
        </uni-forms-item>
        <uni-forms-item name="jobLevel" label="技术资格等级">
          <uni-easyinput type="text" v-model="user.jobLevel" placeholder="请输入技术资格等级" />
        </uni-forms-item>

        <uni-forms-item name="teacherType" label="教师类型">
          <uni-data-select v-model="user.teacherType" :localdata="teacherTypes"></uni-data-select>
        </uni-forms-item>
        <uni-forms-item name="teachMajor" label="任教专业">
          <uni-data-select v-model="user.teachMajor" :localdata="majors"></uni-data-select>
        </uni-forms-item>
        <uni-forms-item name="workYears" label="教龄">
          <uni-number-box
            style="width: 30%; float: left"
            :min="1"
            :max="50"
            v-model="user.workYears"
            placeholder="请输入教龄"
          />
          <view style="float: left; display: flex; align-items: center; height: 42rpx">年</view>
        </uni-forms-item>
      </uni-section>
      <uni-section title="联系方式" type="line">
        <uni-forms-item name="phone" label="手机号码">
          <uni-easyinput type="text" v-model="user.phone" placeholder="请输入手机号码" />
        </uni-forms-item>
        <uni-forms-item name="email" label="邮箱">
          <uni-easyinput type="text" v-model="user.email" placeholder="请邮箱" />
        </uni-forms-item>
      </uni-section>

      <uni-section title="账号密码" type="line">
        <uni-forms-item name="username" label="账号">
          <uni-easyinput type="text" v-model="user.username" placeholder="请输入账号" />
        </uni-forms-item>
        <uni-forms-item name="password" label="新密码">
          <uni-easyinput type="password" v-model="user.password" placeholder="请输入新密码" />
        </uni-forms-item>
        <uni-forms-item name="confirmPassword" label="确认密码">
          <uni-easyinput type="password" v-model="user.confirmPassword" placeholder="请确认新密码" />
        </uni-forms-item>
        <uni-forms-item label="验证码">
          <view class="input-item flex align-center" style="width: 60%; margin: 0px" v-if="captchaEnabled">
            <view class="iconfont icon-code icon"></view>
            <input v-model="user.code" type="number" class="input" placeholder="请输入验证码" maxlength="4" />
            <view class="login-code">
              <image :src="codeUrl" @click="getCode" class="login-code-img"></image>
            </view>
          </view>
        </uni-forms-item>
      </uni-section>
      <button type="primary" @click="submit">提交</button>
    </uni-forms>
  </view>
</template>

<script>
import { getDicts } from "@/api/system/dict/data";
import { register } from "@/api/register/register";
import { getCodeImg } from "@/api/login";
import url from "url";
export default {
  created() {
    this.getCode();
  },
  data() {
    return {
      trainingId: "",
      codeUrl: "",
      captchaEnabled: true,
      teacherTypes: [
        {
          value: "0",
          text: "中职教师",
        },
        {
          value: "1",
          text: "高职教师",
        },
      ],
      nations: [],
      sexes: [],
      educationTypes: [],
      majors: [],
      user: {
        username: "",
        password: "",
        confirmPassword: "",
        code: "",
        trainingId: "",
        uuid: "",
      },
      rules: {
        username: {
          rules: [
            {
              required: true,
              errorMessage: "账号不能为空",
            },
          ],
        },
        password: {
          rules: [
            {
              required: true,
              errorMessage: "密码不能为空",
            },
            {
              minLength: 6,
              maxLength: 20,
              errorMessage: "长度在 6 到 20 个字符",
            },
          ],
        },
        confirmPassword: {
          rules: [
            {
              required: true,
              errorMessage: "确认密码不能为空",
            },
            {
              validateFunction: (rule, value, data) => data.password === value,
              errorMessage: "两次输入的密码不一致",
            },
          ],
        },
        name: {
          rules: [
            {
              required: true,
              errorMessage: "请输入您的姓名",
            },
            {
              minLength: 1,
              maxLength: 10,
              errorMessage: "姓名长度必须介于1 和 10 之间",
            },
          ],
        },
        // sex: {
        // 	rules: [{
        // 		required: true,
        // 		errorMessage: '请选择性别'
        // 	}, {}]
        // },
        // nation: {
        // 	rules: [{
        // 		required: true,
        // 		errorMessage: '请选择民族'
        // 	}, {}]
        // },
        // education: {
        // 	rules: [{
        // 		required: true,
        // 		errorMessage: '请选择学历/学位'
        // 	}]
        // },
        // workUnit: {
        // 	rules: [{
        // 		required: true,
        // 		errorMessage: '请输入工作单位'
        // 	}]
        // },
        // professionalTitle: {
        // 	rules: [{
        // 		required: true,
        // 		errorMessage: '请输入职称'
        // 	}]
        // },
        // post: {
        // 	rules: [{
        // 		required: true,
        // 		errorMessage: '请输入职务'
        // 	}]
        // },
        // jobLevel: {
        // 	rules: [{
        // 		required: true,
        // 		errorMessage: '请输入技术资格及等级'
        // 	}]
        // },
        // teacherType: {
        // 	rules: [{
        // 		required: true,
        // 		errorMessage: '请选择教师类型'
        // 	}]
        // },
        // teachMajor: {
        // 	rules: [{
        // 		required: true,
        // 		errorMessage: '请选择任教专业'
        // 	}]
        // },
        // workYears: {
        // 	rules: [{
        // 		required: true,
        // 		errorMessage: '请输入教龄'
        // 	}]
        // },
        phone: {
          rules: [
            {
              required: true,
              errorMessage: "请输入您的手机号码",
            },
            {
              pattern: /^(?:(?:\+|00)86)?1\d{10}$/,
              errorMessage: "请输入正确格式的手机号码",
            },
          ],
        },
        // email: {
        // 	rules: [{
        // 			required: true,
        // 			errorMessage: '请输入您的邮箱',
        // 		},
        // 		{
        // 			pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        // 			errorMessage: '请输入正确格式的邮箱',
        // 		},
        // 	]
        // },
      },
    };
  },
  onLoad(option) {
    if (option && option.trainingId) {
      this.trainingId = option.trainingId;
    }
    getDicts("sys_nation_type").then((response) => {
      this.nations = response.data.map((item) => {
        return {
          value: item.dictValue,
          text: item.dictLabel,
        };
      });
      console.log(this.nations);
    });
    getDicts("sys_user_sex").then((response) => {
      this.sexes = response.data.map((item) => {
        return {
          value: item.dictValue,
          text: item.dictLabel,
        };
      });
      console.log(this.nations);
    });
    getDicts("sys_education_type").then((response) => {
      this.educationTypes = response.data.map((item) => {
        return {
          value: item.dictValue,
          text: item.dictLabel,
        };
      });
      console.log(this.nations);
    });
    getDicts("base_major").then((response) => {
      this.majors = response.data.map((item) => {
        return {
          value: item.dictValue,
          text: item.dictLabel,
        };
      });
      console.log(this.nations);
    });
  },
  onReady() {
    this.$refs.form.setRules(this.rules);
  },
  methods: {
    // 获取图形验证码
    getCode() {
      getCodeImg().then((res) => {
        this.captchaEnabled = res.captchaEnabled === undefined ? true : res.captchaEnabled;
        if (this.captchaEnabled) {
          this.codeUrl = "data:image/gif;base64," + res.img;
          this.user.uuid = res.uuid;
        }
      });
    },
    submit() {
      this.$refs.form.validate().then((res) => {
        if (this.user.code === "" && this.captchaEnabled) {
          this.$modal.msgError("请输入验证码");
          return;
        }
        this.user.trainingId = this.trainingId;
        register(this.user)
          .then((res) => {
            const username = this.user.username;
            this.$modal.confirm("恭喜你，您的账号 " + username + " 注册成功！").then(() => {
              this.$tab.reLaunch("/pages/login");
            });
          })
          .catch(() => {
            if (this.captchaEnabled) {
              this.getCode();
            }
          });
        console.log("2222222222222");
      });
    },
  },
};
</script>

<style lang="scss">
page {
  background-color: #ffffff;
}

.pwd-retrieve-container {
  padding-top: 36rpx;
  padding: 15px;
  width: 100%;
}

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

.login-code {
  height: 38px;
  float: right;
}

.login-code-img {
  height: 38px;
  position: absolute;
  margin-left: 10px;
  width: 200rpx;
}
</style>
