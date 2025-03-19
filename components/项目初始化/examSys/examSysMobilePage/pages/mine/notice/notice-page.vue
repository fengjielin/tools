<template>
  <view class="page-news">
    <scroll-view class="listview" style="flex: 1" enableBackToTop="true" scroll-y @scrolltolower="loadMore()">
      <view style="padding: 0 8px 8px">
        <template v-for="item in dataList">
          <view class="send-time time">
            {{ item.sendTime }}
          </view>
          <view class="notification" @click="goDetail(item)" :key="item.trainingMsgId">
            <view class="notice-info-wrapper">
              <view class="notice-title">
                <view class="msg-type"> {{ judgeMsgType(item.msgType, item.component) }} </view>
              </view>
              <view class="notice-content">
                <view class="ellipsis"> {{ item.contents }} </view>
              </view>
              <view class="time" v-if="item.readTime"> 阅读时间：{{ item.readTime }} </view>
            </view>
          </view>
        </template>
      </view>
    </scroll-view>
    <empty-status v-if="!dataList || dataList.length == 0">暂无数据</empty-status>
  </view>
</template>

<script>
// import { setIsRead } from "@/api/training/training.js";
import { getNotReadCount, listInfo } from "@/api/system/message";
export default {
  name: "Page",
  components: {},
  props: {
    value: {
      type: [Number, String],
      default: 0,
    },
    isRead: {
      type: [Number, String],
      default: "",
    },
  },
  data() {
    return {
      dataList: [],
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
        {
          name: "培训问卷",
          code: "Q",
        },
      ],
      msgParams: {
        delFlag: 0,
        isRead: 0,
      },
    };
  },
  computed: {
    judgeMsgType() {
      return (msgType, component) => {
        let typeObj = null;
        this.msgTypeList.forEach((item) => {
          if (msgType.includes(item.code) && component != "/train/myTraining") {
            typeObj = item;
          } else if ((msgType == "T07" || msgType == "T09") && component == "/train/myTraining") {
            typeObj = { name: "作业提交", code: "T07" };
          } else if (msgType == "T03" && component == "/train/myTraining") {
            typeObj = { name: "反馈意见", code: "T03" };
          }
        });
        if (typeObj) {
          return typeObj.name;
        }
        return "";
      };
    },
  },
  methods: {
    getNotReadCount() {
      getNotReadCount().then((response) => {
        this.msgReadCount = response;
        this.$emit("input", this.msgReadCount);
      });
    },
    loadData(refresh) {
      console.log("loadData");
      if (this.loading) {
        return;
      }
      this.loading = true;
      this.isNoData = false;
      this.msgParams.isRead = this.isRead;
      listInfo(this.msgParams).then((response) => {
        this.loading = false;
        this.msgCount = response.total;
        this.msgList = response.rows;
        const data = response.rows;
        this.isNoData = data.length <= 0;
        const data_list = data.map((item) => {
          return item;
        });
        this.dataList = data_list;
        // if (refresh) {
        // } else {
        // 	this.dataList = this.dataList.concat(data_list);
        // }
      });
      if (this.isRead == 0) {
        this.getNotReadCount();
      }
    },
    loadMore(e) {
      // this.loadData();
    },
    clear() {
      this.dataList.length = 0;
    },
    goDetail(detail) {
      if (detail.isRead == 0) {
        this.setIsRead(detail);
      }
      if (detail.msgType == "E01") {
        this.$tab.reLaunch("/pages/expert/lectureTable/index");
        return;
      }
      if (detail.msgType == "Q01") {
        let query = {
          questionnaireId: detail.businessId,
        };
        uni.navigateTo({
          url: "./questionnaireWrapper?query=" + encodeURIComponent(JSON.stringify(query)),
        });
        return;
      }
      if ((detail.msgType == "T07" || detail.msgType == "T09") && detail.component == "/train/myTraining") {
        let query = {
          trainingId: detail.businessId,
        };
        uni.navigateTo({
          url: "/pages/mine/homework/list?query=" + encodeURIComponent(JSON.stringify(query)),
        });
        return;
      }
      if (detail.msgType == "T03" && detail.component == "/train/myTraining") {
        this.$modal.msg("请在PC端查看");
        return;
      }
      let query = {
        businessId: detail.businessId,
        msgType: detail.msgType,
      };
      uni.navigateTo({
        url: "./detail?query=" + encodeURIComponent(JSON.stringify(query)),
      });
    },
    refreshData() {
      if (this.loading) {
        return;
      }
      this.pulling = true;
      this.refreshing = true;
      this.refreshText = "正在刷新...";
      this.loadData(true);
    },
    onrefresh(e) {
      this.refreshData();
      // #ifdef APP-NVUE
      this.$refs.list.resetLoadmore();
      // #endif
    },
    setIsRead(item) {
      setIsRead(item).then((res) => {});
    },
  },
};
</script>

<style lang="scss">
.page-news {
  flex: 1;
  flex-direction: column;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}

.listview {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  /* #ifndef APP-NVUE */
  display: flex;
  flex-direction: column;
  /* #endif */
  /* #ifndef MP-ALIPAY */
  flex-direction: column;
  /* #endif */
}

.notification:first-child {
  margin-top: 8px;
}

.send-time {
  padding: 8px 0px 8px;
  text-align: center;
  font-size: 24rpx;
  color: #ccc;
}

.notification {
  width: 100%;
  cursor: pointer;
  background-color: #fff;
  margin-bottom: 6px;
  padding: 14px 16px 8px;
  border-radius: 4px;

  .notice-title {
    margin-bottom: 8px;
    position: relative;
    display: flex;
    padding-left: 24rpx;
  }

  .msg-type {
    flex-shrink: 0;
    color: #000;
    font-size: 32rpx;
  }

  .notice-title::before {
    content: "";
    display: inline-block;
    position: absolute;
    top: 50%;
    left: 4rpx;
    transform: translateY(-50%);
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #409eff;
  }

  .time {
    font-size: 24rpx;
    color: #ccc;
  }

  .notice-info-wrapper {
    min-height: 100px;
  }

  .notice-content {
    padding-bottom: 8px;
    line-height: 1.5;
  }

  .datails {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    border-top: 1px solid #dcdee2;
    padding: 4px 8px 2px;
    margin-top: 12px;
  }
}

.ellipsis {
  // max-height: 50px;
  overflow: hidden;
  text-overflow: ellipsis;
  overflow-wrap: break-word;
  display: -webkit-box;
  /*！autoprefixer: off */
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  /*！autoprefixer: on */
}
</style>
