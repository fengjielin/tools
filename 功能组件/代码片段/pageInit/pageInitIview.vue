<template>
  <div class="app-container">
    <Form :model="queryParams" :rules="rules" ref="queryForm" :label-width="60" inline @submit.native.prevent>
      <FormItem label="标题：" prop="name">
        <Input type="text" v-model="queryParams.name" :maxlength="50" placeholder="请输入标题" @keyup.enter.native="handleQuery"></Input>
      </FormItem>
      <FormItem :label-width="0">
        <div style="display: flex; gap: 8px">
          <Button type="primary" @click="handleQuery">搜索</Button>
          <Button @click="resetQuery">重置</Button>
        </div>
      </FormItem>
    </Form>

    <Row :gutter="10" style="margin-bottom: 8px">
      <Col :span="1.5">
        <Button type="primary" @click="handleAdd">新增</Button>
      </Col>
    </Row>

    <Table :columns="columns" :data="dataList" :loading="loading" border>
      <template slot-scope="scope" slot="operation">
        <div style="display: flex; gap: 8px">
          <Button type="primary" size="small" @click="handleUpdate(scope.row)">修改</Button>
          <Button type="error" size="small" @click="handleDelete(scope.row)">删除</Button>
        </div>
      </template>
    </Table>
    <Page class="page" @on-change="changePage" :total="total" :current="queryParams.pageNum" :page-size="queryParams.pageSize" show-elevator show-total v-show="total > 0" />

    <Modal v-model="open" :title="title" width="700px" :closable="true" :mask-closable="false" @on-cancel="cancel">
      <div style="min-height: 300px">
        <Form :model="form" :rules="rules" ref="form" :label-width="100" @submit.native.prevent>
          <FormItem label="标题：" prop="title">
            <Input type="text" v-model="form.title" placeholder="请输入标题" style="width: 240px" maxlength="50"></Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer" style="text-align: right">
        <Button @click="cancel">取消</Button>
        <Button type="primary" @click="submitForm" :loading="loading">保存</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  export default {
    name: '',
    components: {},
    data() {
      return {
        // 遮罩层
        loading: true,
        // 总条数
        total: 0,
        // 弹出层标题
        title: '',
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: { pageNum: 1, pageSize: 10 },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          reviewNode: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
          reviewer: [{ required: true, message: '审核人不能为空', trigger: 'blur' }],
        },

        columns: [
          { title: '标题名称', key: '' },
          {
            title: '操作',
            width: 140,
            align: 'center',
            slot: 'operation',
            key: '',
          },
        ],
        dataList: [
          { hierarchy: '1', reviewNode: '一级审核', reviewerName: '王小虎', status: '上海市普陀区金沙江路 1518 弄' },
          { hierarchy: '2', reviewNode: '二级审核', reviewerName: '王小虎', status: '上海市普陀区金沙江路 1518 弄' },
          { hierarchy: '3', reviewNode: '三级审核', reviewerName: '王小虎', status: '上海市普陀区金沙江路 1518 弄' },
          { hierarchy: '4', reviewNode: '四级审核', reviewerName: '王小虎', status: '上海市普陀区金沙江路 1518 弄' },
        ],
      };
    },
    created() {
      this.loading = false;
      // this.getList();
    },
    mounted() {},
    watch: {},
    computed: {},
    methods: {
      changePage(i) {
        this.queryParams.pageNum = i;
        this.getList();
      },

      /** 查询列表 */
      getList() {
        this.loading = true;
        listProcess(this.queryParams).then((response) => {
          this.dataList = response.rows;
          this.loading = false;
        });
      },
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
      /** 取消按钮 */
      cancel() {
        this.open = false;
        this.reset();
      },
      /** 表单重置 */
      reset() {
        this.form = {
          id: null,
        };
        this.$refs['form'].resetFields();
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = '添加';
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids;
        getProcess(id).then((response) => {
          this.form = response.data;
          this.open = true;
          this.title = '修改';
        });
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const ids = row.id || this.ids;
        const reviewNode = row.reviewNode || '';
        this.$modal
          .confirm('是否确认删除名称为' + reviewNode + '的数据项？')
          .then(function () {
            return delProcess(ids);
          })
          .then(() => {
            this.getList();
            this.$modal.msgSuccess('删除成功');
          })
          .catch(() => {});
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            if (this.form.id != null) {
              updateProcess(this.form).then((response) => {
                this.$modal.msgSuccess('修改成功');
                this.open = false;
                this.getList();
              });
            } else {
              addProcess(this.form).then((response) => {
                this.$modal.msgSuccess('新增成功');
                this.open = false;
                this.getList();
              });
            }
          }
        });
      },
    },
  };
</script>
<style scoped></style>
