const training = {
  namespaced: true,
  state: {
    refreshTraining: Date.now(), // 刷新培训信息列表， 在系部培训保存了研修计划后，重新请求培训列表
    exportSuccessList: [], // 实践手册成功已导出的列表
    curExportItem: '', // 记录当前导出项
    exportFailed: false, // 导出时发生错误
  },

  mutations: {
    SET_REFRESHTRAINING: (state, value) => {
      state.refreshTraining = value;
    },
    SET_CUREXPORTITEM: (state, value) => {
      state.curExportItem = value;
    },
    SET_EXPORTSUCCESSLIST: (state, value) => {
      state.exportSuccessList = value;
    },
    SET_EXPORTFAILED: (state, value) => {
      state.exportFailed = value;
    },
  },

  actions: {
    changeRefreshTraining({ commit }, data) {
      commit('SET_REFRESHTRAINING', data)
    },
    changeCurExportItem({ commit }, data) {
      commit('SET_CUREXPORTITEM', data)
    },
    changeExportSuccessList({ commit }, data) {
      commit('SET_EXPORTSUCCESSLIST', data)
    },
    changeExportFailed({ commit }, data) {
      commit('SET_EXPORTFAILED', data)
    },
  },
};

export default training;
