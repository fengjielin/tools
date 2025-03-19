<template>
  <view class="page-wrapper">
    <scroll-view class="listview" style="flex: 1" enableBackToTop="true" scroll-y @scrolltoupper="onrefresh()" @scrolltolower="loadMore()">
      <view style="padding: 0 8px 120rpx">
        <template v-for="(item, index) in dataList">
          <view class="datalist-wrapper tag-status-wrapper list-cell-arrow" @click="goDetail(item)" :key="index" v-if="true">
            <view class="info-wrapper">
              <view class="title ellipsis">
                {{ item.name }}
              </view>
              <view class="num-tip">共 {{ item.totalNum }} 题 | 已练习 {{ item.doneNUm }} 题</view>
            </view>
          </view>
        </template>
      </view>
    </scroll-view>
    <empty-status v-if="isNoData"></empty-status>
  </view>
</template>

<script>
  export default {
    name: 'Exercises',
    components: {},
    data() {
      return {
        dataList: [],
        queryParams: {
          pageNum: 1,
          pageSize: 10,
        },
        isNoData: true,
        loading: false,
      };
    },

    onReady() {
      this.loadData();
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
      getList() {
        return new Promise((resolve, reject) => {
          this.loading = true;
          // getList(this.queryParams).then((res) => {
          //   this.loading = false;
          //   resolve(res);
          // });

          let res = {
            rows: [
              {
                id: 1,
                name: '语文',
                totalNum: 300,
                doneNUm: 50,
              },
              {
                id: 2,
                name: '数学',
                totalNum: 300,
                doneNUm: 50,
              },
              {
                id: 3,
                name: '英语',
                totalNum: 300,
                doneNUm: 50,
              },
            ],
            total: 3,
          };
          resolve(res);
        });
      },

      // scroll-view start
      goDetail(detail) {
        console.log('detail');
        console.log(detail);
        let query = {
          trainingId: detail.trainingId,
          trainingType: detail.trainingType,
        };
        uni.navigateTo({
          url: './detail?query=' + encodeURIComponent(JSON.stringify(query)),
        });
      },

      async loadData(refresh) {
        if (this.loading) {
          return;
        }
        this.loading = true;
        this.isNoData = false;

        let res = [];

        res = await this.getList();

        this.total = res.total || 0;
        const data = res.rows;

        this.isNoData = data.length <= 0;
        const data_list = data.map((item) => {
          return item;
        });
        this.loading = false;

        if (refresh) {
          this.dataList = data_list;
        } else {
          this.dataList = this.dataList.concat(data_list);
        }

        console.log('----------------');
        console.log('refresh', refresh);
        console.log('dataList', this.dataList, data_list);
        console.log('----------------');
      },

      loadMore(e) {
        console.log('loadMore 加载更多');
        let totalPage = Math.ceil(this.total / this.queryParams.pageSize);
        if (this.queryParams.pageNum == totalPage) return;
        this.queryParams.pageNum = this.queryParams.pageNum + 1;
        this.loadData();
      },
      onrefresh(e) {
        console.log('onrefresh 刷新数据');
        this.queryParams.pageNum = 1;
        this.refreshData();
      },
      refreshData() {
        if (this.loading) {
          return;
        }
        this.pulling = true;
        this.refreshing = true;
        this.refreshText = '正在刷新...';
        this.loadData(true);
      },
      clear() {
        this.dataList.length = 0;
      },
      // scroll-view end
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

  .page-wrapper {
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

  .send-time {
    padding: 8px 0px 8px;
    text-align: center;
    font-size: 12px;
    color: #ccc;
  }

  .datalist-wrapper {
    width: 100%;
    cursor: pointer;
    background-color: #fff;
    margin-bottom: 24rpx;
    padding: 28rpx 32rpx 16rpx;
    border-radius: 8rpx;

    &:first-child {
      margin-top: 16rpx;
    }

    .title {
      margin-bottom: 16rpx;
      position: relative;
      display: flex;
      padding-left: 28rpx;
      font-size: 28rpx;
      color: #333333;
      font-weight: 600;
    }

    .title::before {
      content: '';
      display: inline-block;
      position: absolute;
      top: 50%;
      left: 4rpx;
      transform: translateY(-50%);
      width: 12rpx;
      height: 12rpx;
      border-radius: 50%;
      background-color: #409eff;
    }

    .num-tip {
      font-size: 24rpx;
      color: #a2a2a2;
    }
  }

  .ellipsis {
    max-height: 100rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    overflow-wrap: break-word;
    display: -webkit-box !important;
    /*！autoprefixer: off */
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    /*！autoprefixer: on */
  }

  .tag-status-wrapper {
    position: relative;
    overflow: hidden;

    .tag-status {
      width: 100rpx;
      padding: 8rpx 0;
      text-align: center;
      color: #fff;
      font-size: 24rpx;
      background-color: orange;
      position: absolute;
      top: 0;
      right: 0;
    }
  }
</style>
