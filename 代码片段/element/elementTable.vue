<template>
  <div>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">添加</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDeleteBatch">删除</el-button>
      </el-col>
    </el-row>
    <el-table
      :data="detailList"
      :row-class-name="rowIndex"
      @selection-change="handleSelectionChange"
      ref="recordDetail"
    >
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="评分备注" prop="recordName" width="240">
        <template slot-scope="scope">
          <el-input v-model="scope.row.recordName" placeholder="请输入评分备注" />
        </template>
      </el-table-column>
      <el-table-column label="权重" prop="score" width="220">
        <template slot-scope="scope">
          <el-input-number v-model="scope.row.score" :min="0" :max="1" step="0.1" placeholder="请输入权重" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="100">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row, scope.$index)"
            >移除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      detailList: [],
    };
  },
  methods: {
    /** 添加按钮操作 */
    handleAdd() {
      let obj = {
        recordName: new Date().getFullYear() + "年度评分",
        assessUserId: "",
        assessTime: "",
        score: "",
        rank: "",
      };
      this.detailList.push(obj);
    },
    /** 删除按钮操作 */
    handleDelete(row, index) {
      this.$modal
        .confirm("是否确认移除所选数据项？")
        .then(() => {
          return this.detailList.splice(index, 1);
        })
        .then(() => {
          this.$modal.msgSuccess("移除成功");
        })
        .catch(() => {});
    },
    handleDeleteBatch() {
      if (this.checked.length == 0) {
        this.$modal.msgError("请先选择要删除的数据");
      } else {
        const detailList = this.detailList;
        const checked = this.checked;
        this.detailList = detailList.filter(function (item) {
          return checked.indexOf(item.index) == -1;
        });
      }
    },
    /** 复选框选中数据 */
    handleSelectionChange(selection) {
      this.checked = selection.map((item) => item.index);
    },
    /** 序号 */
    rowIndex({ row, rowIndex }) {
      row.index = rowIndex + 1;
    },
  },
};
</script>
