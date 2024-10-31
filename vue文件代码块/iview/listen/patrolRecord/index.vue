<template>
  <div class="container">
    <Breadcrumb separator=">" style="padding-bottom: 14px">
      <BreadcrumbItem>
        <Icon type="ios-pin-outline" style="color: #5784ff; margin-right: 12px" />
        质量监控
      </BreadcrumbItem>
      <BreadcrumbItem>巡堂记录</BreadcrumbItem>
    </Breadcrumb>
    <div class="header">
      <Form ref="queryForm" :model="queryParams" :label-width="75" inline @submit.native.prevent>
        <FormItem label="检查人员" prop="inspectionPersonnel" style="margin-bottom: 0">
          <Input v-model="queryParams.inspectionPersonnel" type="text" placeholder="请输入检查人员" search @on-search="handleQuery"></Input>
        </FormItem>
        <FormItem :label-width="0" style="margin-bottom: 0">
          <div style="display: flex; gap: 8px">
            <Button type="primary" @click="handleQuery">搜索</Button>
            <Button @click="resetQuery">重置</Button>
          </div>
        </FormItem>
      </Form>
    </div>
    <div class="content">
      <Table :columns="columns" :data="dataList" :loading="loading" border></Table>
      <Page class="page" @on-change="changePage" :total="totalNum" :current="queryParams.pageNum" :page-size="queryParams.pageSize" show-elevator show-total />
    </div>

    <patrolRecordDetailsModal ref="patrolRecordDetailsModalRef" title="巡堂记录详情" :listenPatrolHeaderId="listenPatrolHeaderId"></patrolRecordDetailsModal>
  </div>
</template>

<script>
  import patrolRecordDetailsModal from '../components/patrolRecordDetailsModal.vue';
  export default {
    name: 'patrolRecord', 
    components: { patrolRecordDetailsModal },
    data() {
      return {
        loading: false,
        totalNum: 0,
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          inspectionPersonnel: '',
        },
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
            title: '检查人员',
            key: 'inspectionPersonnel',
            width: '200',
          },
          {
            title: '检查时间',
            key: 'inspectionTime',
          },
          {
            title: '检查区域',
            key: 'checkArea',
          },
          {
            title: '总体情况',
            key: 'overallSituation',
          },
          {
            title: '操作',
            key: '',
            align: 'center',
            width: 130,
            render: (h, params) => {
              return h('span', [
                h(
                  'a',
                  {
                    props: {},
                    style: {
                      color: '#1B81FF',
                    },
                    on: {
                      click: (e) => {
                        e.stopPropagation();
                        this.showPatrolRecordDetailsModal(params.row);
                      },
                    },
                  },
                  '查看',
                ),
              ]);
            },
          },
        ],
        dataList: [],

        listenPatrolHeaderId: '',
        userInfo: '',
      };
    },
    created() {
      let state = JSON.parse(sessionStorage.state);
      this.userInfo = state.userinfo;

      this.getList();
    },
    mounted() {},
    watch: {},
    computed: {},
    methods: {
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.getList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.$refs['queryForm'].resetFields();
        this.handleQuery();
      },
      showPatrolRecordDetailsModal(row) {
        this.listenPatrolHeaderId = row.id;
        this.$nextTick(() => {
          this.$refs['patrolRecordDetailsModalRef'].show();
        });
      },
      changePage(i) {
        this.page.pageNum = i;
        this.getList();
      },
      getList() {
        // this.queryParams.inspectionPersonnelId = this.userInfo.id;
        this.loading = true;
        this.axios
          .get(this.interfaceUrl + '/listen/patrolHeader/list', {
            params: this.queryParams,
          })
          .then((res) => {
            if (res.data.code == '200') {
              this.totalNum = res.data.total;
              if (res.data.rows) {
                this.dataList = res.data.rows;
                this.dataList.forEach((item) => {
                  if (item.inspectionTime) {
                    item.inspectionTime = item.inspectionTime.split(',').join(' ');
                  }
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
    },
  };
</script>

<style scoped lang="less">
  .header {
    width: 100%;
    min-height: 52px;
    background-color: #fff;
    box-sizing: border-box;
    padding: 3px 16px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
  }
  .content {
    margin-top: 16px;
    padding: 16px;
    background-color: #fff;
    box-sizing: border-box;
    min-height: 520px;
  }
  .page {
    float: none;
    text-align: center;
    margin-right: 0;
    margin-top: 12px;
  }
</style>
