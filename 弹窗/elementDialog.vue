<template>
  <el-dialog :title="title" :visible.sync="visible" :width="width" top="5vh" append-to-body>
    <div v-loading="loading">
      <el-form ref="form" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="名称" prop="reviewNode"
          ><el-input v-model="form.reviewNode" placeholder="请输入名称"
        /></el-form-item>
        <el-form-item label="审核人" prop="reviewer">
          <el-select v-model="form.reviewer" placeholder="请选择"
            ><el-option v-for="item in userList" :key="item.id" :label="item.label" :value="item.id"></el-option
          ></el-select>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="close">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { listExpertInfo, getExpertInfo, delExpertInfo, addExpertInfo, updateExpertInfo } from "@/api/expert/expertInfo";

export default {
  name: "uploadRecommendAttach",
  components: {},
  props: {
    title: {
      type: String,
      default: "",
    },
    width: {
      type: String,
      default: "600px",
    },
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      visible: false,
      // 查询参数
      queryParams: {},

      // 表单参数
      form: {},
      // 表单校验
      rules: {
        reviewNode: [{ required: true, message: "名称不能为空", trigger: "blur" }],
        reviewer: [{ required: true, message: "审核人不能为空", trigger: "blur" }],
      },
    };
  },
  methods: {
    // 显示弹框
    show() {
      this.getListExpertInfo();
      this.reset();
      this.visible = true;
    },
    close() {
      this.visible = false;
    },
    // 表单重置
    reset() {
      this.form = {};
      this.fileList = [];
      this.resetForm("form");
    },
    getListExpertInfo() {
      let params = {
        pageNum: 1,
        pageSize: 99999,
      };
      this.loading = true;
      listExpertInfo(params).then((response) => {
        this.expertInfoList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
          } else {
          }
        }
      });
    },
  },
};
</script>
