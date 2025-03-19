import Vue from "vue";
import store from "./store";

import { getDicts } from "@/api/dict/data";

// 字典标签组件
import DictTag from "@/components/DictTag";
import DictData from "@/components/DictData";

// 全局方法挂载
Vue.prototype.getDicts = getDicts;
// 全局组件挂载
Vue.component("DictTag", DictTag);
DictData.install();

new Vue({
  el: "#app",
  router: router,
  store: store,
  render: (h) => h(App),
});
