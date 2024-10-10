$(document).ready(function () {
  var Main = {
    created() {},
    filters: {},
    data() {
      return {
        openMenuIndex: -1,
        menuList: [
          {
            label: "科技竞赛",
            value: "M01",
            children: [
              {
                label: "夏令营",
                value: "xialingying",
                path: "https://kpg.gzjkw.net/innovateActivityPage/#/forward/activityIndex",
              },
              {
                label: "科技体育",
                value: "kejitiyu",
                path: "https://kpg.gzjkw.net/innovateActivityPage/#/forward/sportsActivities/activityIndex",
              },
              {
                label: "创新创业大赛",
                value: "chuangxindasai",
                path: "https://kpg.gzjkw.net/innovateActivityPage/#/forward/innovationActivities/activityIndex",
              },
            ],
          },
          {
            label: "xxx类",
            value: "M02",
            children: [
              {
                label: "项目申报与活动报名",
                value: "xiangmushenbao",
                path: "https://kpg.gzjkw.net/kpsb/login.zul?service=http://kpg.gzjkw.net/kpsb/security_check",
              },
              { label: "电子证书系统", value: "dianzizhengshu", path: "https://kpg.gzjkw.net/zs/" },
            ],
          },
          {
            label: "xxx类",
            value: "M03",
            children: [
              { label: "绿色学校", value: "lvsexuexiao", path: "https://kpg.gzjkw.net/lsxxPage/#/login?redirect=%2F" },
              { label: "垃圾分类", value: "lajifenlei", path: "https://kpg.gzjkw.net/wastePage/#/login?redirect=%2F" },
            ],
          },
        ],
      };
    },
    methods: {
      handleClickMenu(index) {
        if (this.openMenuIndex != index) {
          this.openMenuIndex = index;
        } else {
          this.openMenuIndex = -1;
        }
      },
      handleClickMenuChildren(cItem) {
        console.log(cItem);
        window.open(cItem.path);
      },
    },
    mounted() {},
  };
  var Component = Vue.extend(Main);
  new Component().$mount("#container");
});
