import Vue from "vue";
import Vuex from "vuex";
import dict from "./dict";
import getters from "./getters";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    dict,
  },
  getters,
});
