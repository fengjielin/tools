<template>
  <view class="content">
    <!-- 培训报名通知和审核结果通知 -->
    <template v-if="judgeMsgType(msgType, ['T', 'ST', 'E']) && trainingInfo">
      <view class="j-wrapper">
        <view class="title">{{ trainingInfo.name }}</view>
        <view class="j-item"> <text class="label">学分类型（一级）：</text>{{ trainingInfo.firstLevel }} </view>
        <view class="j-item"> <text class="label">学分类型（二级）：</text>{{ trainingInfo.secoudLevel }} </view>
        <view class="j-item" v-if="!trainingInfo.isLearningDuration || trainingInfo.isLearningDuration == 0">
          <text class="label">培训学时：</text>{{ trainingInfo.learningDuration }}学时
        </view>
        <view class="j-item" v-if="trainingInfo.isLearningDuration == 2">
          <text class="label">培训天数：</text>{{ trainingInfo.practiceDays }}天
        </view>
        <view class="j-item"> <text class="label">培训学分：</text>{{ trainingInfo.creditHour }} </view>
        <view class="j-item">
          <text class="label">培训类别：</text>
          <dict-tag :options="dict.training_training_type" :value="trainingInfo.trainingType" />
        </view>
        <view class="j-item">
          <text class="label">培训时间：</text>{{ trainingInfo.beginDate }}至{{ trainingInfo.endDate }}
        </view>
        <view class="j-item"> <text class="label">报名截止时间：</text>{{ trainingInfo.signUpEndDate }} </view>
        <view class="j-item">
          <text class="label">报名状态：</text>
          <text v-if="trainingSignUp" style="color: forestgreen">已报名</text>
          <text v-else style="color: darkgrey">未报名</text>
        </view>
        <view class="j-item" v-if="trainingSignUp">
          <text class="label">报名时间：</text>{{ trainingSignUp.signTime }}
        </view>
        <view class="j-item" v-if="trainingSignUp">
          <text class="label">报名审核状态：</text>
          {{
            trainingSignUp.isSubmit == "0" && trainingSignUp.isVerify == "0"
              ? "审核中"
              : trainingSignUp.isSubmit == "1" && trainingSignUp.isVerify == "2"
              ? "未通过审核"
              : "已通过"
          }}
        </view>
        <view class="footer" v-if="!trainingSignUp">
          <view v-if="isSignUpEndDate" style="font-size: 36rpx; color: crimson"> 报名已截止 </view>
          <view v-else style="font-size: 36rpx; color: #2db7f5">
            <template
              v-if="
                trainingInfo.trainingType != 'T08' &&
                !(
                  this.trainingInfo.trainingType == 'T03' &&
                  (this.trainingInfo.secoudLevel.indexOf('区') != -1 ||
                    this.trainingInfo.secoudLevel.indexOf('校') != -1)
                )
              "
            >
              <button
                type="primary"
                @click="submitForm(1)"
                v-if="trainingSignUp && trainingSignUp.isSubmit == '1' && trainingSignUp.isVerify == '2'"
              >
                重新报名
              </button>
              <button type="primary" @click="submitForm(0)" v-if="!trainingSignUp">确认报名</button>
            </template>

            <template v-else> 报名进行中，请前往PC端进行报名操作 </template>
          </view>
        </view>
      </view>
      <template v-if="trainingInfo.trainingType == 'T07' || trainingInfo.trainingType == 'T09'">
        <view class="training-attendance">
          <table>
            <tr style="margin-bottom: 6px">
              <td class="header-wrapper">
                <view class="header clearfix">
                  <text class="title">考勤要求</text>
                </view>
              </td>
            </tr>
            <tr>
              <td class="box" style="padding: 0px 12px 6px 24px">
                <text> {{ trainingInfo.attendance }} </text>
              </td>
            </tr>
          </table>
        </view>
        <view class="training-arrange">
          <table>
            <tr>
              <td class="header-wrapper">
                <view class="header clearfix">
                  <text class="title">培训安排表</text>
                </view>
              </td>
            </tr>
            <tr>
              <td class="box">
                <view v-for="(item, index) in trainingArrange" :key="index">
                  <view class="header clearfix">
                    <text class="title">培训模块：{{ item.templateName }}</text>
                  </view>
                  <view class="" v-for="(childrenItem, childrenIndex) in item.children" :key="childrenIndex">
                    <view class="j-wrapper">
                      <view class="j-item arrange-theme">
                        <text class="label">培训主题：</text>{{ childrenItem.theme }}
                      </view>
                      <view class="j-item arrange-theme">
                        <text class="label">培训方式：</text>
                        <dict-tag :options="dict.training_form" :value="childrenItem.form" />
                      </view>
                      <view class="j-item arrange-theme" v-if="childrenItem.form != 'T05'">
                        <text class="label">培训专家：</text>{{ childrenItem.expertName || "/" }}
                      </view>
                      <view class="j-item arrange-theme">
                        <text class="label">培训学时：</text>{{ childrenItem.period }}
                      </view>
                      <view class="j-item arrange-theme">
                        <text class="label">培训时间：</text>
                        {{ parseTrainingTimeFormat(childrenItem) }}
                      </view>
                      <view class="j-item arrange-theme">
                        <text class="label">培训作业：</text>{{ childrenItem.homework || "" }}
                      </view>
                    </view>
                  </view>
                </view>
              </td>
            </tr>
          </table>
        </view>
      </template>
    </template>
    <!-- 请假审核通知 -->
    <template v-if="judgeMsgType(msgType, ['L']) && leaveInfo">
      <view class="j-wrapper">
        <view class="title">{{ leaveInfo.trainName }}</view>
        <!-- <view class="j-item">
					<text class="label">培训名称：</text>{{leaveInfo.trainName}}
				</view> -->
        <view class="j-item"> <text class="label">请假事由：</text>{{ leaveInfo.reason }} </view>
        <view class="j-item">
          <text class="label">请假方式：</text>
          <dict-tag :options="dict.leave_type" :value="leaveInfo.leaveType" />
        </view>
        <view class="j-item">
          <text class="label">具体时长：</text>
          {{ leaveInfo.leaveType == 0 ? 1 : leaveInfo.leaveType == 3 ? leaveInfo.leaveDays : 0.5 }} 天
        </view>
        <view class="" v-if="leaveInfo.leaveType == 3">
          <view class="j-item">
            <text class="label">请假开始时间：</text>{{ parseTime(leaveInfo.leaveBeginTime, "{y}-{m}-{d} {h}:{i}") }}
          </view>
          <view class="j-item">
            <text class="label">请假结束时间：</text>{{ parseTime(leaveInfo.leaveEndTime, "{y}-{m}-{d} {h}:{i}") }}
          </view>
        </view>
        <view class="" v-else>
          <view class="j-item">
            <text class="label">请假时间：</text>{{ parseTime(leaveInfo.leaveBeginTime, "{y}-{m}-{d} {h}:{i}") }}
          </view>
        </view>
        <view class="j-item">
          <text class="label">审核状态：</text>
          <dict-tag :options="dict.is_verify" :value="leaveInfo.isVerify" />
        </view>
        <template v-if="leaveInfo.isVerify == '2' || leaveInfo.isVerify == '4'">
          <view class="j-item">
            <text class="label">反馈人：</text>
            <text>{{ leaveInfo.returnUserName || "" }}</text>
          </view>
          <view class="j-item"> <text class="label">反馈意见：</text> {{ leaveInfo.backAdvice }} </view>
        </template>
      </view>
    </template>
    <!-- 工作周志审批通知 -->
    <template v-if="judgeMsgType(msgType, ['W']) && reportsInfo">
      <view class="j-wrapper weekly-work-wrapper">
        <view class="title">{{ reportsInfo.trainingName }}</view>
        <view class="j-item">
          <text class="label">实践日期：</text>
          <text> {{ reportsInfo.weeklyDate }} </text>
        </view>
        <view class="j-item">
          <text class="label">实践地点 ：</text>
          <text> {{ reportsInfo.practiceSpots }} </text>
        </view>
        <view class="j-item">
          <text class="label">实践地点岗位 ：</text>
          <text> {{ reportsInfo.practicePost }} </text>
        </view>
        <view class="j-item">
          <text class="label">带教导师：</text>
          <text>{{ reportsInfo.teacherName }}</text>
        </view>
      </view>
      <view class="j-wrapper weekly-work-wrapper" style="padding-bottom: 16px">
        <el-divider style="font-size: 16px">实践内容</el-divider>
        <view class="ql-editor" v-html="reportsInfo.practiceContent"></view>
        <el-divider style="font-size: 16px">实践成果</el-divider>
        <view class="ql-editor" v-html="reportsInfo.practicePerformance"></view>
        <el-divider style="font-size: 16px">实践体会及建议</el-divider>
        <view class="ql-editor" v-html="reportsInfo.practiceTaste"></view>
        <el-divider style="font-size: 16px">带教导师评价及建议</el-divider>
        <view class="ql-editor" v-html="reportsInfo.teacherSuggestion"></view>
      </view>
    </template>
  </view>
</template>

<script>
// import { getTraining, signupTraining, checkIsSign, editSignupTraining } from "@/api/training/training.js";
// import { getLeave } from "@/api/training/leave";
// import { listTrainDetail } from "@/api/training/trainingScheme";
// import { listHomework } from "@/api/training/homework";
// import { getReports } from "@/api/training/weeklyReports";

import ElDivider from "@/components/ElDivider/index.vue";

export default {
  name: "Detail",
  components: { ElDivider },
  data() {
    return {
      businessId: "",
      msgType: "",
      msgTypeList: [
        {
          name: "报名通知",
          code: "T",
        },
        {
          name: "报名审核",
          code: "ST",
        },
        {
          name: "请假审批",
          code: "L",
        },
        {
          name: "周志审批",
          code: "W",
        },
        {
          name: "培训安排",
          code: "E",
        },
      ],
      trainingInfo: "",
      trainingSignUp: "",
      trainingArrange: "",

      leaveInfo: "",
      reportsInfo: "",

      dict: {},
    };
  },
  onReady() {},
  onLoad(event) {
    this.getDictsList("is_verify");
    this.getDictsList("leave_type");
    this.getDictsList("training_form");
    this.getDictsList("training_training_type");

    this.load(event.query);
  },
  computed: {
    judgeMsgType() {
      return (msgType, codeList) => {
        let typeFlag = false;
        codeList.forEach((item) => {
          if (msgType.includes(item)) {
            typeFlag = true;
          }
        });
        return typeFlag;
      };
    },
    isSignUpEndDate() {
      let signUpEndDate = this.trainingInfo.signUpEndDate
        ? new Date(this.trainingInfo.signUpEndDate.replace(/-/g, "/")).getTime()
        : "";
      let now = Date.now();
      if (now > signUpEndDate) {
        return true;
      }
      return false;
    },

    // 如果开始时间和结束时间都在同一天，这仅显示开始日期+时间
    parseTrainingTimeFormat() {
      return (item) => {
        if (item.trainingBeginDate && item.trainingEndDate) {
          let bengin = item.trainingBeginDate.split(" ");
          let end = item.trainingEndDate.split(" ");
          if (bengin[0] == end[0]) {
            return `${bengin[0]} ${bengin[1]}-${end[1]}`;
          }
          return `${item.trainingBeginDate} ~ ${item.trainingEndDate}`;
        }
        return "";
      };
    },
  },
  methods: {
    getDictsList(dictCode) {
      this.getDicts(dictCode).then((res) => {
        if (res.code == 200) {
          this.$set(this.dict, dictCode, res.data);
        }
      });
    },
    load(e) {
      var p = decodeURIComponent(e);
      try {
        this.detailInfo = JSON.parse(p);
      } catch (error) {
        this.detailInfo = JSON.parse(p);
      }

      this.businessId = this.detailInfo?.businessId;
      this.msgType = this.detailInfo?.msgType;
      console.log(this.msgType);
      if (this.judgeMsgType(this.msgType, ["T", "ST", "E"])) {
        this.getTrainingInfo();
      } else if (this.judgeMsgType(this.msgType, ["L"])) {
        this.getLeave();
      } else if (this.judgeMsgType(this.msgType, ["W"])) {
        this.getReports();
      }
    },

    submitForm(type) {
      if (type == 0) {
        //提交报名
        uni.showModal({
          title: "提示",
          content: "是否确认报名" + this.trainingInfo.name,
          success: (res) => {
            if (res.confirm) {
              // 执行确认后的操作
              // 系部 和 区校级企业实践需要填写资料
              if (
                this.trainingInfo.trainingType != "T08" &&
                !(
                  this.trainingInfo.trainingType == "T03" &&
                  (this.trainingInfo.secoudLevel.indexOf("区") != -1 ||
                    this.trainingInfo.secoudLevel.indexOf("校") != -1)
                )
              ) {
                signupTraining({ trainingId: this.businessId, signType: 0 }).then((res) => {
                  uni.showToast({
                    title: "报名成功，请等待审核",
                    icon: "success",
                    duration: 2000,
                  });
                  setTimeout(() => {
                    this.getTrainingInfo();
                  }, 500);
                });
              }
            } else {
              // 执行取消后的操作
            }
          },
        });
      } else {
        //重新报名,编辑报名状态
        uni.showModal({
          title: "提示",
          content: "是否再次报名" + this.trainingInfo.name,
          success: (res) => {
            if (res.confirm) {
              // 执行确认后的操作
              // 系部 和 区校级企业实践需要填写资料
              if (
                this.trainingInfo.trainingType != "T08" &&
                !(
                  this.trainingInfo.trainingType == "T03" &&
                  (this.trainingInfo.secoudLevel.indexOf("区") != -1 ||
                    this.trainingInfo.secoudLevel.indexOf("校") != -1)
                )
              ) {
                editSignupTraining(this.trainingSignUp).then((res) => {
                  uni.showToast({
                    title: "已重新报名，请等待审核",
                    icon: "success",
                    duration: 2000,
                  });
                  setTimeout(() => {
                    this.getTrainingInfo();
                  }, 500);
                });
              }
            } else {
              // 执行取消后的操作
            }
          },
        });
      }
    },

    // 培训
    getTrainingInfo() {
      this.loading = true;
      getTraining(this.businessId).then((res) => {
        this.loading = false;
        this.trainingInfo = res.data;

        let trainingType = this.trainingInfo.trainingType || "";
        // 校级全员培训
        if (trainingType == "T07" || trainingType == "T09") {
          this.getTrainingScheme(this.businessId);
        }
        checkIsSign(this.businessId).then((res) => {
          this.trainingSignUp = res.data;
          if (this.trainingSignUp != null || this.trainingSignUp != undefined) {
            this.enterpriseId = this.trainingSignUp.enterpriseId;
            // this.handleChange(this.enterpriseId)
          }
        });
      });
    },

    // 请假
    getLeave() {
      this.loading = true;
      getLeave(this.businessId).then((response) => {
        this.loading = false;
        this.leaveInfo = response.data;
      });
    },

    // 获取培训方案 包括培训安排表
    getTrainingScheme(trainingId) {
      let params = {
        pageNum: 1,
        pageSize: 999999,
        trainingId: trainingId,
      };
      this.loading = true;
      listTrainDetail(params).then((res) => {
        this.loading = false;

        let trainingArrange = JSON.parse(JSON.stringify(res.rows));
        this.getListHomework(trainingId)
          .then((resHomework) => {
            return new Promise((resolve, reject) => {
              let rows = resHomework.rows;
              rows.forEach((item) => {
                if (item.themeId) {
                  let obj = ""; // 往培训安排的数据内插入作业数据
                  obj = trainingArrange.find((h) => h.trainDetailId == item.trainDetailId);
                  if (obj) {
                    this.$set(obj, "homework", item.content);
                    this.$set(obj, "checked", true);
                  }
                } else {
                  this.trainingHomework = item.content; // 不绑定到培训主题上的培训作业
                  this.showTrainingHomework = 1; // 是否存在 不绑定到培训主题上的培训作业
                }
              });
              resolve();
            });
          })
          .then(() => {
            let templateList = [];
            let templateIdObj = {}; // 去重用
            // 重构一个数组，不重复的培训模版的数据
            trainingArrange.forEach((item) => {
              item.notTemplate = item.themeId ? false : true; // 没有themeId表示这条数据不是从培训模版中来的
              item.themeId = item.themeId || Date.now();
              if (item.trainingBeginDate && item.trainingEndDate) {
                item.trainDate = [item.trainingBeginDate, item.trainingEndDate];
              } else {
                item.trainDate = [];
              }
              if (!templateIdObj[item.templateId]) {
                let data = {
                  templateId: item.templateId,
                  templateName: item.templateName,
                  children: [],
                };
                templateList.push(data);
                templateIdObj[item.templateId] = true;
              }
            });
            // 将相同培训模版的主题加入到对应的children内
            trainingArrange.forEach((item) => {
              let template = templateList.find((temp) => temp.templateId == item.templateId);
              if (template) {
                template.children.push(item);
              }
            });
            this.trainingArrange = templateList;
          });
      });
    },

    // 获取作业
    getListHomework(trainingId) {
      return new Promise((resolve, reject) => {
        this.loading = true;
        let params = {
          pageNum: 1,
          pageSize: 99999,
          trainingId: trainingId,
        };
        listHomework(params).then((res) => {
          this.loading = false;
          let rows = res.rows;
          resolve(res);
        });
      });
    },

    // 获得 工作周志
    getReports() {
      this.loading = true;
      getReports(this.businessId).then((res) => {
        this.reportsInfo = res.data;
        this.loading = false;
      });
    },
  },
};
</script>

<style lang="scss">
page {
  min-height: 100%;
}

.content {
  padding: 12px;
}

.j-wrapper {
  padding: 12px;
  background-color: #fff;
  border-radius: 4px;
  color: #000;

  .title {
    color: #333;
    font-size: 48rpx;
    text-align: center;
    margin: 10px auto 18px;
  }

  .j-item {
    display: flex;
    padding: 6px 0;
  }

  .label {
    flex-shrink: 0;
    color: #000;
  }
}

.footer {
  display: flex;
  justify-content: center;
  margin-top: 8px;

  // .btn {
  // 	opacity: 0.5;
  // 	cursor: no-drop;
  // }

  // button {
  // 	width: 9em;
  // 	height: 3em;
  // 	border-radius: 30em;
  // 	font-size: 15px;
  // 	font-family: inherit;
  // 	border: none;
  // 	position: relative;
  // 	overflow: hidden;
  // 	color: #265b90;
  // 	font-weight: 600;
  // 	z-index: 1;
  // 	box-shadow: 6px 6px 12px #c5c5c5,
  // 		-6px -6px 12px #ffffff;
  // }

  // button::before {
  // 	content: '';
  // 	width: 0;
  // 	height: 3em;
  // 	border-radius: 30em;
  // 	position: absolute;
  // 	top: 0;
  // 	left: 0;
  // 	background-image: linear-gradient(to right, #0fd850 0%, #f9f047 100%);
  // 	transition: .5s ease;
  // 	display: block;
  // 	z-index: -1;
  // }

  // button:hover::before {
  // 	width: 9em;
  // }

  // #btu button:hover::before {
  // 	width: 14em;
  // }
}

table {
  width: 100%;
  border-collapse: collapse;
}

table thead {
  background-color: #fff;
}

td,
th {
  // border: 1px solid #dcdee2;
  // height: 38px;
}

.header-wrapper {
  padding: 0 12px;
  position: relative;
}

.header-wrapper .header::before {
  content: "";
  display: inline-block;
  width: 2px;
  height: 40%;
  position: absolute;
  top: 50%;
  left: 4px;
  transform: translateY(-50%);
  background-color: #1a73e8;
}

.header {
  border-bottom: 1px solid #dcdee2;
  padding: 6px 12px;
  position: relative;

  .title {
    font-size: 32rpx;
    color: #000;
    font-weight: 500;
  }
}

.training-attendance {
  background-color: #fff;
  border-radius: 4px;
  margin-top: 12px;
}

.training-arrange {
  background-color: #fff;
  border-radius: 4px;
  margin-top: 12px;

  .header {
  }

  .box {
    margin-bottom: 20px;
    border: none;
    box-shadow: none;
    background: #fff;
  }

  .arrange-theme {
    padding: 2px 0;
  }
}

// 工作周志
.weekly-work-wrapper {
  margin-bottom: 12px;

  .j-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 38px;
    border-bottom: 1px solid #ebeef5;
  }
}
</style>
