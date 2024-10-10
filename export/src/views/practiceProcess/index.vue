<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="50px">
      <el-form-item label="学员" prop="studentName">
        <el-input :maxlength="50" v-model="queryParams.studentName" placeholder="请输入学员姓名" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAddCover">手册封面</el-button>
      <el-button type="primary" plain icon="el-icon-download" size="mini" @click="handleExportBatch">批量导出</el-button>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="studentList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="培训名称" align="left" prop="trainingName" fixed="left" /> -->
      <el-table-column label="学员姓名" align="center" prop="name" fixed="left" width="200" />
      <el-table-column label="企业" align="left" prop="enterpriseName" />
      <el-table-column label="岗位" align="left" prop="trainingPostName" />
      <el-table-column label="专家姓名" align="center" prop="expertName" width="200" />
      <el-table-column label="带教导师姓名" align="center" prop="teacherName" width="200" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right" width="200">
        <template slot-scope="scope">
          <!-- <el-button size="mini" type="text" icon="el-icon-view" @click="handleWeelyRecord(scope.row)" >工作周志</el-button > -->
          <el-button size="mini" type="text" icon="el-icon-view" @click="handlePracticeManual(scope.row)">企业实践手册</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <div style="width: 835px; position: absolute; left: -100%; top: 0px" v-if="isExportBatch">
      <practice-manual ref="practiceManualRef" :trainingId="trainingId" :userId="userId" :signUpId="signUpId" :autoExport="true" :outputType="'zip'" @exportSuccess="exportSuccess" v-if="userId" />
    </div>

    <practiceManualDialog ref="practiceManualDialog" title="实践手册" :trainingId="trainingId" :userId="userId" :signUpId="signUpId"></practiceManualDialog>

    <el-dialog :title="title" :visible.sync="open" :width="'680px'" top="5vh" append-to-body>
      <div style="position: relative">
        <el-form ref="form" :model="form" label-width="120px" inline>
          <el-form-item label="培训名称：" prop="name" style="margin-bottom: 6px; display: block">
            <div>{{ form.name }}</div>
          </el-form-item>
          <el-form-item label="手册封面：" prop="coverUrl">
            <image-upload v-model="form.coverUrl" :limit="1" />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormCover">确 定</el-button>
        <el-button @click="cancel">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
  .el-input {
    width: 217px !important;
  }
</style>
<style>
  .train-student .el-form-item__content {
    width: 217px !important;
  }
</style>

<script>
  import { listApplyAudit } from '@/api/audit/applyAudit';
  import { listApplyStudent, listApplyStudentDept } from '@/api/audit/applyStudent';
  import { getTraining, updateTraining } from '@/api/training/training';
  import practiceManualDialog from '@/views/training/trainingCheck/components/practiceManualDialog.vue';
  import practiceManual from '@/views/training/practiceManual/index';
  import JSZip from 'jszip';
  import FileSaver from 'file-saver';

  export default {
    name: 'PracticeProcess', // 实践过程
    dicts: [],
    components: { practiceManualDialog, practiceManual },
    data() {
      return {
        // 页签 进行中 已结束
        typeList: [
          { label: '进行中', value: 'S01' },
          { label: '已结束', value: 'S02' },
        ],
        // 遮罩层
        loading: true,
        // 选中数组
        ids: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 显示搜索条件
        showSearch: true,
        // 总条数
        total: 0,
        // 学员基本信息表格数据
        studentList: [],
        // 弹出层标题
        title: '',
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          name: null,
          trainingId: null,
          isVerify: 1,
          deptId: null,
        },
        pasternList: null,
        // 表单参数
        form: {},

        defaultActiveMenu: '',
        trainingList: [],

        isExportBatch: false,
        userId: '',
        trainingId: '',
        signUpId: '',

        zip: '',
      };
    },
    created() {
      this.isCheckDept = false;
      if (this.$route.path && this.$route.path.includes('Check')) {
        this.isCheckDept = true;
      }
      const trainingId = this.$route.params && this.$route.params.trainingId;
      const deptId = this.$route.query && this.$route.query.deptId;

      this.queryParams.trainingId = trainingId;
      this.queryParams.deptId = deptId;
      this.getList();
    },
    computed: {
      // 培训列表只显示区、校的企业实践培训
      filterTrainingList() {
        if (this.trainingList.length) {
          return this.trainingList.filter((item) => {
            if (item.secoudLevel && (item.secoudLevel.includes('区') || item.secoudLevel.includes('校')) && item.trainingType == 'T03') {
              return true;
            }
          });
        }
        return [];
      },
    },
    methods: {
      exportSuccess(PDF, fileName) {
        this.zip.file(`${fileName}-${new Date().getTime()}.pdf`, PDF.output('blob'));

        let exportSuccessList = this.$store.state.training.exportSuccessList;
        // 判断所勾选的内容已全部完成pdf的生成后，调用zip的生成和保存
        if (this.ids[this.ids.length - 1] == exportSuccessList[exportSuccessList.length - 1]) {
          this.zip.generateAsync({ type: 'blob' }).then((content) => {
            FileSaver.saveAs(content, '实践手册.zip');
          });
        }
      },
      // 批量导出
      handleExportBatch() {
        let exportSuccessList = [];
        this.$store.dispatch('training/changeExportSuccessList', exportSuccessList);
        // console.log(this.ids);
        this.zip = new JSZip();
        this.loadingExport = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          // background: 'rgba(0, 0, 0, 0.7)',
        });
        this.forLoop(this.ids);
      },
      // 轮询遍历list，不断询问导出进度
      forLoop(list) {
        this.totalList = list.length;
        let t = setInterval(() => {
          try {
            let exportSuccessList = this.$store.state.training.exportSuccessList;
            let curExportItem = this.$store.state.training.curExportItem;
            let exportFailed = this.$store.state.training.exportFailed;
            if (exportFailed) {
              console.log('导出出现错误，关闭定时器');
              clearInterval(t);
              this.loadingExport.close();
              this.$modal.alertWarning('错误，导出失败');
            }
            this.loadingExport.setText(`实践手册导出中：${exportSuccessList.length} / ${this.totalList}`);
            console.log('(====================================): ');
            for (let i = 0; i < list.length; i++) {
              const item = list[i];
              // 1、判断是否已导出，没有的话就说明应该导出当前值，所有将当前的值保存下来作为将要渲染导出的内容
              if (!exportSuccessList.includes(item) && !curExportItem) {
                this.$store.dispatch('training/changeCurExportItem', item);

                this.curItem = item;
                console.log('将要导出手册：', this.curItem);
                this.isExportBatch = false;
                let signUpObj = this.studentList.find((o) => o.signUpId == this.curItem);
                if (signUpObj) {
                  this.signUpId = signUpObj.signUpId;
                  this.userId = signUpObj.userId;
                  this.trainingId = signUpObj.trainingId;
                  this.$nextTick(() => {
                    this.isExportBatch = true;
                  });
                }
                return;
              }
              // 2、否则说明导出当前值，跳过当前循环，进入下一个值
              continue;
            }
            // 最后一个，关掉定时器
            if (this.ids[this.ids.length - 1] == exportSuccessList[exportSuccessList.length - 1]) {
              clearInterval(t);
              this.loadingExport.close();
              this.$modal.alertSuccess('导出成功');
            }
          } catch (error) {
            clearInterval(t);
            this.loadingExport.close();
            this.$modal.alertWarning('错误，导出失败');
          }
        }, 1000);
      },

      handleAddCover() {
        this.loading = true;
        getTraining(this.queryParams.trainingId).then((response) => {
          this.form = response.data;
          this.loading = false;
          this.open = true;
          this.title = '添加手册封面';
        });
      },
      submitFormCover() {
        if (this.form.trainingId != null) {
          updateTraining(this.form).then((response) => {
            this.$modal.msgSuccess('操作成功');
            this.open = false;
          });
        }
      },

      // 企业实践手册
      handlePracticeManual(row) {
        this.signUpId = row.signUpId;
        this.userId = row.userId;
        this.trainingId = row.trainingId;
        this.manualInfo = row;
        this.$nextTick(() => {
          this.$refs['practiceManualDialog'].show();
        });
      },
      // 工作周志
      handleWeelyRecord(row) {
        const id = row.userId;
        const name = row.name;
        const params = { trainingId: row.trainingId, enterpriseName: row.enterpriseName, trainingPostName: row.trainingPostName };
        this.$tab.openPage('[' + name + ']的工作周志审核', '/train/weeklyReportAudit/index/' + id, params);
      },
      /** 查询学员基本信息列表 */
      getList() {
        this.loading = true;
        if (this.isCheckDept) {
          listApplyStudentDept(this.queryParams).then((response) => {
            this.studentList = response.rows;
            this.total = response.total;
            this.loading = false;
          });
        } else {
          listApplyStudent(this.queryParams).then((response) => {
            this.studentList = response.rows;
            this.total = response.total;
            this.loading = false;
          });
        }
      },
      // 取消按钮
      cancel() {
        this.open = false;
      },
      // 表单重置
      reset() {
        this.form = {
          studentId: null,
          name: null,
        };
        this.resetForm('form');
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
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map((item) => item.signUpId);
        this.single = !selection.length;
        this.multiple = !selection.length;
      },
    },
  };
</script>
