<template>
  <div>
    <Card style="width: 100%">
      <!-- <template #title>
          <Icon type="ios-film-outline"></Icon>
        </template> -->
      <div class="screen-wrapper">
        <div class="data-item">
          <div style="flex-shrink: 0">检查人员：</div>
          <div class="ellipsis_multi_row">{{ form.inspectionPersonnel }}</div>
        </div>
        <div class="data-item">
          <div style="flex-shrink: 0">检查时间：</div>
          <div class="ellipsis_multi_row">{{ form.inspectionTime }}</div>
        </div>
        <div class="data-item">
          <div style="flex-shrink: 0">检查区域：</div>
          <div class="ellipsis_multi_row">{{ form.checkArea }}</div>
        </div>
        <div class="data-item">
          <div style="flex-shrink: 0">总体情况：</div>
          <div class="ellipsis_multi_row">{{ form.overallSituation }}</div>
        </div>
      </div>
    </Card>
    <h3 style="margin: 16px 0 10px">检查情况</h3>
    <Table :columns="columns" :data="dataList" :loading="loading" border v-if="refresh">
      <template slot-scope="{ row }" slot="fileList">
        <div class="upload-list-wrapper">
          <div class="upload_list">
            <div class="upload_list-cover" v-for="(item, index) in row.listenPatrolRecordAttachList" :key="index">
              <div class="ellipsis" style="max-width: 420px" @click="checkFile(item)" :title="item.attachName">
                <i class="el-icon-document" style="font-size: 14px"></i>
                <span v-if="item" target="_blank" :href="interfaceUrl + item.attachUrl" class="attach_name">
                  {{ item ? item.attachName : '' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </Table>
  </div>
</template>

<script>
  export default {
    name: 'patrolRecordDetails',
    components: {},
    props: {
      listenPatrolHeaderId: {
        type: [String, Number],
        default: '',
      },
    },
    data() {
      return {
        loading: false,
        totalNum: 0,
        queryParams: {
          pageNum: 1,
          pageSize: 99999,
        },

        form: {
          id: '',
        },
        userInfo: '',

        dataList: [],
        columns: [
          {
            title: '序号',
            key: '',
            align: 'center',
            width: '65',
            render: (h, params) => {
              let str = params.index + (this.queryParams.pageNum - 1) * this.queryParams.pageSize + 1;
              return h('span', str);
            },
          },
          {
            title: '上课地点',
            key: 'classroomLocation',
          },
          {
            title: '上课班级',
            key: 'className',
          },
          {
            title: '任课教师',
            key: 'teacherName',
            width: '200',
          },
          {
            title: '课堂纪律',
            key: 'classroomDiscipline',
            align: 'center',
          },
          {
            title: '是否运用信息化手段',
            key: 'isInfoStr',
            width: '120',
          },
          {
            title: '授课情况（讲授/巡回指导/示范等 ）',
            key: 'content',
            tooltip: true,
          },
          {
            title: '其他情况（安全隐患、卫生等）',
            key: 'otherSituations',
            tooltip: true,
          },
          {
            title: '附件',
            key: '',
            slot: 'fileList',
          },
        ],

        disciplineList: [], // 课堂纪律，参数字典内获取
        // 是否运用信息化手段
        infoMeans: [
          { value: '0', name: '是' },
          { value: '1', name: '否' },
        ],

        refresh: true,
      };
    },
    created() {
      let state = JSON.parse(sessionStorage.state);
      this.userInfo = state.userinfo;

      this.getDiscipline().then(() => {
        this.getPatrolHeader().then(() => {
          this.getList();
        });
      });
    },
    mounted() {},
    watch: {},
    computed: {},
    methods: {
      checkFile(item) {
        window.open(this.interfaceUrl + item.attachUrl, '_blank');
      },
      refreshComp() {
        this.refresh = false;
        this.$nextTick(() => {
          this.refresh = true;
        });
      },
      getPatrolHeader() {
        return new Promise((resolve) => {
          this.loading = true;
          this.axios
            .get(this.interfaceUrl + '/listen/patrolHeader/' + this.listenPatrolHeaderId)
            .then((res) => {
              if (res.data.code == 200) {
                if (res.data.data) {
                  this.form = res.data.data;
                  if (this.form.inspectionTime) {
                    this.form.inspectionTime = this.form.inspectionTime.split(',').join(' ');
                  }
                  resolve();
                }
              } else {
                this.$Message.error(`${res.data.msg}`);
              }
              this.loading = false;
            })
            .catch((e) => {
              this.loading = false;
              console.error(e);
              this.$Message.error(e.message);
            });
        });
      },
      getList() {
        this.queryParams.listenPatrolHeaderId = this.listenPatrolHeaderId;
        this.loading = true;
        this.axios
          .get(this.interfaceUrl + '/listen/patrolRecord/list', {
            params: this.queryParams,
          })
          .then((res) => {
            if (res.data.code == 200) {
              if (res.data.rows) {
                this.dataList = res.data.rows;
                this.dataList.forEach((item) => {
                  // 是否运用信息化手段
                  if (this.infoMeans) {
                    let index = this.infoMeans.findIndex((i) => i.value === item.isInfo);
                    if (index != -1) {
                      item.isInfoStr = this.infoMeans[index].name;
                    }
                  }

                  // 课堂纪律
                  if (item.classroomDiscipline) {
                    let classroomDiscipline = item.classroomDiscipline.split(';');
                    classroomDiscipline.forEach((o) => {
                      let keys = o.split(':');
                      let key = keys[0];
                      let value = keys[1];
                      item[key] = /^\s*$/.test(value) ? '' : value;
                    });
                  }

                  // item.listenPatrolRecordAttachList = [{ attachName: '1213', attachUrl: '' }];
                });
              } else {
                this.dataList = [];
              }
            } else {
              this.$Message.error(`${res.data.msg}`);
            }
            this.loading = false;
          })
          .catch((e) => {
            this.loading = false;
            console.error(e);
            this.$Message.error(e.message);
          });
      },
      // 获得课堂纪律的信息
      getDiscipline() {
        return new Promise((resolve) => {
          let params = {
            paramType: 'DM_Discipline',
          };
          this.loading = true;
          this.axios
            .post(this.interfaceUrl + '/param/getParamsByParamType', this.qs(params))
            .then((res) => {
              if (res.data.state) {
                if (res.data.sysParamDicts) {
                  this.disciplineList = res.data.sysParamDicts;
                }
              } else {
                this.$Message.error(`${res.data.msg}`);
              }
              this.loading = false;
              let index = this.columns.findIndex((item) => item.key == 'classroomDiscipline');
              if (index != -1) {
                let children = [];
                this.disciplineList.forEach((item) => {
                  children.push({ title: item.paramDesc, key: item.paramCd, align: 'center', width: 100 });
                });
                let classroomDisciplineColumn = this.columns[index];
                classroomDisciplineColumn.children = children;
                this.refreshComp();
              }
              resolve();
            })
            .catch((e) => {
              this.loading = false;
              console.error(e);
              this.$Message.error(e.message);
            });
        });
      },
    },
  };
</script>

<style scoped lang="less">
  .screen-wrapper {
    min-height: 64px;
    background-color: #ffffff;
    font-size: 16px;
    position: relative;
  }
  .data-item {
    font-size: 16px;
    display: flex;
  }

  .upload-list-wrapper {
    .upload_list {
      margin-top: 6px;
      margin-bottom: 6px;
    }

    .upload_list-cover {
      margin-top: 6px;
      margin-bottom: 6px;
      height: 36px;
      line-height: 36px;
      background: #f8f8f9;
      padding-left: 20px;
      padding: 0 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .ellipsis {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .attach_name {
      cursor: pointer;
      color: #2b85e4;
    }
  }
</style>
