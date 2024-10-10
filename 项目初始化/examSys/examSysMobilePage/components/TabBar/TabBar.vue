<template>
  <view class="tab-bar">
    <view v-for="(item, index) in list" :key="index" class="tab-bar-item" @click="switchTab(item, index)">
      <!-- <image class="tab_img" 
				:src="selected === item.tabBarTap ? item.selectedIconPath : item.iconPath"></image> -->
      <view class="icon">
        <text :class="[iconClass(item)]" :style="{ color: selected === item.tabBarTap ? selectedColor : color }"></text>
      </view>

      <view class="tab_text" :style="{ color: selected === item.tabBarTap ? selectedColor : color }">
        {{ item.text }}
      </view>
    </view>
  </view>
</template>
<script>
import { mapState } from "vuex";
import { tabBarList } from "./config.js";

export default {
  props: {
    selected: {
      // 当前选中的tab index
      type: [Number, String],
      default: "",
    },
  },
  data() {
    return {
      color: "#333333",
      selectedColor: "#3c96f3",
      list: [],
    };
  },
  computed: {
    ...mapState({
      currentUserRole: (state) => state.user.roles,
    }),
    iconClass() {
      return (item) => {
        return item.iconPath;
      };
    },
  },
  created() {
    this.list = tabBarList;
  },
  methods: {
    switchTab(item, index) {
      console.log("item", item);
      console.log("index", index);
      this.selectedTemp = item.pagePath;
      let url = item.pagePath;
      uni.switchTab({
        url: item.pagePath,
      });
    },
  },
};
</script>

<style lang="scss">
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100rpx;
  background: white;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: env(safe-area-inset-bottom); // 适配iphoneX的底部

  .tab-bar-item {
    flex: 1;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    .tab_img {
      width: 37rpx;
      height: 41rpx;
    }

    .tab_text {
      font-size: 20rpx;
      margin-top: 9rpx;
    }
  }
}
</style>
