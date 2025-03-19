<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" label-width="100px">
      <el-form-item label="培训名称" prop="name"><el-input :maxlength="50" v-model="queryParams.name" placeholder="请输入培训名称" clearable @keyup.enter.native="handleQuery" /></el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" style="margin-bottom: 8px">
      <el-col :span="1.5"><el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button></el-col>
    </el-row>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="实践审核流程" name="T01"></el-tab-pane>
      <el-tab-pane label="培训审核流程" name="T02"></el-tab-pane>
    </el-tabs>
    <el-table v-loading="loading" :data="dataList" style="width: 100%">
      <el-table-column prop="hierarchy" label="流程序号"></el-table-column>
      <el-table-column prop="reviewNode" label="流程名称"></el-table-column>
      <el-table-column prop="reviewerName" label="审核人员"></el-table-column>
      <el-table-column prop="status" label="开启状态" width="">
        <template slot-scope="scope">
          <el-switch class="mySwitch" v-model="scope.row.status" active-color="#13ce66" inactive-color="#ff4949" active-text="启用" inactive-text="停用" @change="handleStatus"></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="" label="操作" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
    <!-- 添加或修改 对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="名称" prop="reviewNode"><el-input v-model="form.reviewNode" placeholder="请输入名称" /></el-form-item>
        <el-form-item label="审核人" prop="reviewer">
          <el-select v-model="form.reviewer" placeholder="请选择"><el-option v-for="item in userList" :key="item.id" :label="item.label" :value="item.id"></el-option></el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import { listProcess, getProcess, delProcess, addProcess, updateProcess } from '@/api/base/process';
  export default {
    name: 'process',
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
        rules: { reviewNode: [{ required: true, message: '名称不能为空', trigger: 'blur' }], reviewer: [{ required: true, message: '审核人不能为空', trigger: 'blur' }] },
        activeName: 'T01',
        dataList: [
          { hierarchy: '1', reviewNode: '一级审核', reviewerName: '王小虎', status: '上海市普陀区金沙江路 1518 弄' },
          { hierarchy: '2', reviewNode: '二级审核', reviewerName: '王小虎', status: '上海市普陀区金沙江路 1518 弄' },
          { hierarchy: '3', reviewNode: '三级审核', reviewerName: '王小虎', status: '上海市普陀区金沙江路 1518 弄' },
          { hierarchy: '4', reviewNode: '四级审核', reviewerName: '王小虎', status: '上海市普陀区金沙江路 1518 弄' },
        ],
        userList: [],
      };
    },
    created() {
      this.getList();
    },
    mounted() {},
    watch: {},
    computed: {},
    methods: {
      /** 查询列表 */
      getList() {
        this.loading = true;
        listProcess(this.queryParams).then((response) => {
          this.dataList = response.rows;
          this.loading = false;
        });
      },
      handleClick(tab, event) {
        console.log(this.activeName);
        console.log(tab, event);
      },
      /** 切换状态 */
      handleStatus(flag) {
        console.log(flag);
        if (flag) {
        } else {
        }
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.getList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm('queryForm');
        this.handleQuery();
      },
      /** 取消按钮 */
      cancel() {
        this.open = false;
        this.reset();
      },
      /** 表单重置 */
      reset() {
        this.form = { id: null, reviewer: null };
        this.resetForm('form');
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
      /**删除按钮操作 */
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
      /* 提交按钮 */
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
