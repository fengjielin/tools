<template>
  <view class="exercises-container tabs">
    <view class="swiper-tab">
      <view class="swiper-tab-list" :class="tabIndex == item.code ? 'on' : ''" v-for="item in tabList" :key="item.code" :data-current="item.code" @click="ontabtap(item.code)">
        <text>{{ item.name }}</text>
      </view>
    </view>

    <swiper
      class="swiper-tab-box"
      ref="swiper1"
      :current="tabIndex"
      :duration="300"
      @change="onswiperchange"
      @transition="onswiperscroll"
      @animationfinish="animationfinish"
      @onAnimationEnd="animationfinish"
    >
      <swiper-item class="swiper-item" v-for="(page, index) in tabList" :key="index">
        <tabs-page v-model="msgReadCount" class="page-item" :tabIndex="tabIndex" :trainingType="trainingType" :ref="'page' + index"></tabs-page>
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
  export default {
    name: 'Exercises',
    components: {},
    data() {
      return {
        roles: this.$store.state.user.roles,
        tabList: [
          { name: '已报名', code: 0 },
          { name: '进行中', code: 1 },
          { name: '已结束', code: 2 },
          { name: '全部', code: 3 },
        ],
        tabIndex: 0,
        isTap: false,

        msgReadCount: 0,

        pageList: [],

        pickerIndex: 0,
        pickerText: '',
        trainingType: '',

        dict: {},
      };
    },
    created() {},
    mounted() {},

    onReady() {
      this._lastTabIndex = 0;
      this._touchTabIndex = 0;

      // this.initPageList();
    },
    onLoad() {
      uni.hideTabBar({
        animation: false,
      });
    },
    onShow() {},
    watch: {},
    computed: {},
    methods: {
      getDictsList(dictCode) {
        this.getDicts(dictCode).then((res) => {
          if (res.code == 200) {
            this.$set(this.dict, dictCode, res.data);
          }
        });
      },
      initPicker() {
        this.pickerIndex = 0;
        this.pickerText = '全部';
        this.trainingType = '';
      },
      handlePickerChange(e) {
        this.pickerIndex = e.detail.value;
        this.pickerText = this.pickerRange[e.detail.value].dictLabel;
        this.trainingType = this.pickerRange[e.detail.value].dictValue;
        this.$nextTick(() => {
          this.refreshTabData(this.tabIndex);
        });
      },

      // 切换tabs
      ontabtap(code) {
        console.log('ontabtap:', code);
        this.isTap = true;
        this._touchTabIndex = code;
        this.switchTab(code);
      },

      // swiper start
      initPageList() {
        this.pageList = [];
        for (var i = 0; i < this.tabList.length; i++) {
          let item = this.$refs['page' + i];
          console.log(item);
          if (Array.isArray(item)) {
            this.pageList.push(item[0]);
          } else {
            this.pageList.push(item);
          }
        }
      },

      // current 改变时会触发 change 事件，event.detail = {current: current, source: source}
      onswiperchange(e) {
        // console.log('onswiperchange:', e)
        let index = e.target.current || e.detail.current;
        // this.switchTab(index);
      },
      // swiper-item 的位置发生改变时会触发 transition 事件，event.detail = {dx: dx, dy: dy}，支付宝小程序暂不支持dx, dy
      onswiperscroll(e) {
        // console.log('onswiperscroll:', e)
        if (this.isTap) {
          return;
        }
      },
      // @animationfinish 动画结束时会触发 animationfinish 事件，event.detail = {current: current, source: source}
      // @onAnimationEnd animationend 原生事件在 CSS 动画完成后触发
      animationfinish(e) {
        // console.log('animationfinish', e)
        let index = e.detail.current;
        if (this._touchTabIndex === index) {
          this.isTap = false;
        }
        this._lastTabIndex = index;
        this.switchTab(index);
      },

      switchTab(index, init) {
        // console.log('switchTab:', index)
        if (!init && this.tabIndex === index) {
          return;
        }
        this.tabIndex = index;

        this.$nextTick(() => {
          // if (this.pageList[index].dataList.length === 0) {
          // 	this.loadTabData(index);
          // }
          this.refreshTabData(index);
        });
      },

      loadTabData(index) {
        this.pageList[index]?.loadData();
      },
      clearTabData(index) {
        this.pageList[index]?.clear();
      },
      refreshTabData(index) {
        this.pageList[index]?.refreshData();
      },
      // swiper end
    },
  };
</script>

<style lang="scss">
  page {
    background-color: #f9f9f9;
    width: 100%;
    min-height: 100%;
    display: flex;
  }

  .tabs {
    display: flex;
    flex: 1;
    flex-direction: column;
    overflow: hidden;

    /* #ifdef MP-ALIPAY || MP-BAIDU */
    height: 100vh;
    /* #endif */

    .swiper-tab-box {
      flex: 1;
    }
  }

  .exercises-container {
    width: 100%;
  }

  .ellipsis {
    max-height: 50px;
    overflow: hidden;
    text-overflow: ellipsis;
    overflow-wrap: break-word;
    display: -webkit-box;
    /*！autoprefixer: off */
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    /*！autoprefixer: on */
  }

  .swiper-tab {
    width: 100%;
    height: 96rpx;
    line-height: 96rpx;
    margin-bottom: 4px;
    box-sizing: border-box;
    background-color: #ffffff;
    display: flex;
    justify-content: space-around;

    .swiper-tab-list {
      font-size: 32rpx;
      font-weight: 500;
      color: #333333;
    }

    .on {
      border-bottom: 2px solid #409eff;
    }
  }

  .swiper-item {
    flex: 1;
    flex-direction: column;
  }

  .page-item {
    flex: 1;
    flex-direction: row;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
  }

  .el-badge {
    /deep/.el-badge__content {
      margin-top: 12px;
    }
  }
</style>
