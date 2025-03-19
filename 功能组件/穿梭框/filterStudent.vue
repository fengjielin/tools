<template>
  <div class="container">
    <el-form :model="studentParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="180px">
      <el-form-item label="学员姓名" prop="name">
        <el-input :maxlength="50" v-model="studentParams.name" placeholder="学员姓名" clearable />
      </el-form-item>
      <el-form-item label="专业" prop="major">
        <el-input :maxlength="50" v-model="studentParams.major" placeholder="请输入专业" clearable />
      </el-form-item>
      <el-form-item label="学历/学位" prop="education">
        <el-select v-model="studentParams.education" placeholder="请选择学历/学位" clearable @change="getStudent">
          <el-option
            v-for="dict in dict.type.sys_education_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="职业" prop="jobLevel">
        <el-input :maxlength="50" v-model="studentParams.jobLevel" placeholder="请输入职业" clearable />
      </el-form-item>
      <el-form-item label="职务" prop="post">
        <el-input :maxlength="50" v-model="studentParams.post" placeholder="请输入职务" clearable />
      </el-form-item>
      <el-form-item label="职称" prop="professionalTitle">
        <el-input :maxlength="50" v-model="studentParams.professionalTitle" placeholder="请输入职称" clearable />
      </el-form-item>
      <el-form-item label="所属系部" prop="pasternId">
        <el-select
          v-model="studentParams.pasternId"
          placeholder="请选择系部"
          :disabled="isPasternId"
          @change="getStudent"
          clearable
        >
          <el-option
            v-for="item in citiesList"
            :key="item.pasternId"
            :label="item.pasternName"
            :value="item.pasternId"
            :disabled="item.status == 1"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="区级人才梯队" prop="isQjrc">
        <el-select v-model="studentParams.isQjrc" placeholder="请选择区级人才梯队" clearable @change="getStudent">
          <el-option
            v-for="dict in dict.type.base_rctd_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="校级专业成长培育序列教师" prop="isXjzy">
        <el-select
          v-model="studentParams.isXjzy"
          placeholder="请选择校级专业成长培育序列教师"
          clearable
          @change="getStudent"
        >
          <el-option
            v-for="dict in dict.type.base_xjzy_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="市级成长序列" prop="isSjcz">
        <el-select v-model="studentParams.isSjcz" placeholder="请选择市级成长序列" clearable @change="getStudent">
          <el-option
            v-for="dict in dict.type.base_sjcz_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否为新任教师" prop="isNewTeacher" label-width="110px">
        <el-radio-group v-model="studentParams.isNewTeacher" style="width: 110px" @change="getStudent">
          <el-radio v-for="dict in dict.type.base_student_yes_no" :key="dict.value" :label="dict.value">{{
            dict.label
          }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否为辅导员" prop="isClassTeacher" label-width="110px">
        <el-radio-group v-model="studentParams.isClassTeacher" style="width: 110px" @change="getStudent">
          <el-radio v-for="dict in dict.type.base_student_yes_no" :key="dict.value" :label="dict.value">{{
            dict.label
          }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否为中层干部" prop="isMidCadre" label-width="110px">
        <el-radio-group v-model="studentParams.isMidCadre" style="width: 110px" @change="getStudent">
          <el-radio v-for="dict in dict.type.base_student_yes_no" :key="dict.value" :label="dict.value">{{
            dict.label
          }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否在任校长" prop="isHeadmaster" label-width="110px">
        <el-radio-group v-model="studentParams.isHeadmaster" style="width: 110px" @change="getStudent">
          <el-radio v-for="dict in dict.type.base_student_yes_no" :key="dict.value" :label="dict.value">{{
            dict.label
          }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="最小年龄" prop="minAge">
        <el-input-number
          v-model="studentParams.minAge"
          :min="0"
          :max="100"
          label="请输入最小年龄"
          style="width: 200px"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="最大年龄" prop="maxAge">
        <el-input-number
          v-model="studentParams.maxAge"
          :min="0"
          :max="100"
          label="请输入最大年龄"
          style="width: 200px"
        ></el-input-number>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="getStudent" style="float: right" size="mini">搜索学员</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery" style="float: right; margin-right: 20px">
          重置
        </el-button>
      </el-form-item>
    </el-form>
    <el-divider></el-divider>
    <div class="content-wrapper clearfix">
      <div class="left-wrapper">
        <div class="table-title">
          <div>学员列表</div>
          <div class="num">{{ ids.length }}/{{ studentList.length }}</div>
        </div>
        <el-table
          v-loading="loading"
          ref="studentList"
          border
          :data="studentList"
          height="400"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" align="center" key="selection" />
          <el-table-column label="学员名称" align="left" prop="name" key="name" />
        </el-table>
      </div>
      <div class="oper-button-group">
        <el-button-group class="button-group">
          <el-button
            type="primary"
            icon="el-icon-arrow-left"
            :disabled="multipleSelect"
            @click="handleToLeft"
          ></el-button>
          <el-button type="primary" icon="el-icon-arrow-right" :disabled="multiple" @click="handleToRight"></el-button>
        </el-button-group>
      </div>
      <div class="right-wrapper">
        <div class="table-title">
          <div>已选学员</div>
          <div class="num">{{ idsSelect.length }}/{{ studentListSelect.length }}</div>
        </div>
        <el-table
          v-loading="loading"
          ref="studentListSelect"
          border
          :data="studentListSelect"
          height="400"
          @selection-change="handleSelectionChangeSelected"
        >
          <el-table-column type="selection" width="55" align="center" key="selection" />
          <el-table-column label="学员名称" align="left" prop="name" key="name" />
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { listStudent } from "@/api/base/student";
import { listPastern } from "@/api/base/pastern";

export default {
  name: "filterStudent",
  components: {},
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    // 是否根据一个固定的系部id查询学生
    pasternId: {
      type: [Number, String],
      default: "",
    },
    // 默认不查询校外学员
    isOutsideSchool: {
      type: [Boolean],
      default: false,
    },
  },
  dicts: ["base_sjcz_type", "sys_education_type", "base_xjzy_type", "base_rctd_type", "base_student_yes_no"],
  data() {
    return {
      ids: [], // 学员列表选中数组
      single: true, // 非单个禁用
      multiple: true, // 非多个禁用
      idsSelect: [], // 已选学员列表选中数组
      singleSelect: true, // 非单个禁用
      multipleSelect: true, // 非多个禁用
      loading: false,
      studentList: [], // 学员列表
      studentListSelect: [], // 已选学员列表
      studentParams: {
        pageNum: 1,
        pageSize: 999999,
        name: null,
        sex: null,
        nation: null,
        major: null,
        education: null,
        jobLevel: null,
        post: null,
        professionalTitle: null,
        pasternId: null,
        isNewTeacher: null,
        isClassTeacher: null,
        isMidCadre: null,
        isHeadmaster: null,
        isQjrc: null,
        isXjzy: null,
        isSjcz: null,
        trainExperience: null,
        userName: null,
      },

      showSearch: true,
      citiesList: [], // 所属系部
      isPasternId: false,
    };
  },
  created() {
    this.getListPastern();
    this.isPasternId = false;
    if (this.pasternId) {
      this.studentParams.pasternId = this.pasternId;
      this.isPasternId = true;
    }
    this.getStudent("init");
  },
  mounted() {},
  watch: {},
  computed: {},
  methods: {
    // 获取系部列表
    getListPastern() {
      listPastern({ pageNum: 1, pageSize: 99999 }).then((response) => {
        this.citiesList = response.rows;
      });
    },
    // 交换两个数组中的元素
    exchangeElement(ids, originList, targetList) {
      ids.forEach((item) => {
        let index = originList.findIndex((origin) => origin.userId == item);
        if (index != -1) {
          let list = originList.splice(index, 1);
          targetList.splice(targetList.length + 1, 0, ...list);
        }
      });
      targetList.sort((a, b) => a.userId - b.userId);
    },
    // 将已选学员列表 中所选学员 移动到 学员列表中
    handleToLeft() {
      this.exchangeElement(this.idsSelect, this.studentListSelect, this.studentList);
      let idList = this.studentListSelect.map((item) => item.userId);
      this.$emit("input", idList);
    },
    // 将学员列表 中所选学员 移动到 已选学员列表中
    handleToRight() {
      this.exchangeElement(this.ids, this.studentList, this.studentListSelect);
      let idList = this.studentListSelect.map((item) => item.userId);
      this.$emit("input", idList);
    },
    getStudent(isInit) {
      this.loading = true;
      this.studentParams.isOutsideSchool = this.isOutsideSchool ? "1" : "0";
      listStudent(this.studentParams).then((response) => {
        this.loading = false;
        let rows = response.rows;

        if (isInit == "init") {
          this.studentListSelect = [];
          // 根据父级传进来的value设置已选学员列表
          rows.forEach((item) => {
            if (this.value.includes(item.userId)) {
              this.studentListSelect.push(item);
            }
          });
        }
        this.studentList = rows.filter((item) => {
          // 判断学员是否已在 已选学员列表中，存在，就不显示在左边的学员列表中
          let index = this.studentListSelect.findIndex((origin) => origin.userId == item.userId);
          if (index == -1) {
            return true;
          } else {
            return false;
          }
        });
      });
    },
    resetQuery() {
      this.studentParams = {
        pageNum: 1,
        pageSize: 999999,
        name: null,
        sex: null,
        nation: null,
        major: null,
        education: null,
        jobLevel: null,
        post: null,
        professionalTitle: null,
        isNewTeacher: null,
        isClassTeacher: null,
        isMidCadre: null,
        isHeadmaster: null,
        isQjrc: null,
        isXjzy: null,
        isSjcz: null,
        trainExperience: null,
        userName: null,
        maxAge: null,
        minAge: null,
      };
      this.getStudent();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.userId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    handleSelectionChangeSelected(selection) {
      this.idsSelect = selection.map((item) => item.userId);
      this.singleSelect = selection.length !== 1;
      this.multipleSelect = !selection.length;
    },
  },
};
</script>

<style scoped lang="scss">
.content-wrapper {
  display: flex;
  justify-content: center;
  .table-title {
    border: 1px solid #dfe6ec;
    border-bottom: none;
    height: 45px;
    line-height: 45px;
    padding-left: 16px;
    padding-right: 16px;
    display: flex;
    justify-content: space-between;
    .num {
      color: #909399;
      font-size: 12px;
      font-weight: normal;
    }
  }
  .left-wrapper {
    width: 400px;
  }
  .right-wrapper {
    width: 400px;
  }
  .oper-button-group {
    margin: 0 16px;
    position: relative;
    width: 116px;
  }
  .button-group {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
  }
}
.clearfix:after {
  visibility: hidden;
  display: block;
  font-size: 0;
  content: " ";
  clear: both;
  height: 0;
}
</style>
