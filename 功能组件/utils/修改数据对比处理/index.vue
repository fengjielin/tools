<template>
  <div>
    <dividerTitle>{{ verifyText1 }}</dividerTitle>
    <el-table v-if="!wholeCompareFlag" height="300" v-loading="loading" :data="assemblyListFilter">
      <el-table-column label="项目" align="right" width="300" prop="fieldName" />
      <el-table-column label="原记录内容" align="left" prop="lastValue" v-if="verifyStatus != '1'">
        <template slot-scope="scope">
          <div :class="{ different: scope.row.isDifferent }">
            <template v-if="scope.row.isDicts">
              <dict-tag :options="dict.type[scope.row.dictName]" :value="scope.row.lastValue" />
            </template>
            <template v-else-if="scope.row.isTechnical">
              <table v-if="scope.row.lastValue">
                <tr v-for="(item, index) in scope.row.lastValue" :key="index + '13'" style="position: relative">
                  <td rowspan="1" colspan="3" class="text_center">
                    <template>{{ item.firstLevel }}</template>
                  </td>
                  <td rowspan="1" colspan="3" class="text_center">
                    <template>{{ item.secondLevel }}</template>
                  </td>
                  <td rowspan="1" colspan="2" class="text_center">
                    <template>{{ item.thirdLevel }}</template>
                  </td>
                </tr>
              </table>
            </template>
            <template v-else-if="scope.row.isExperience">
              <table v-if="scope.row.lastValue">
                <tr>
                  <td rowspan="1" colspan="2" class="td_label">时间</td>
                  <td rowspan="1" colspan="2" class="td_label">单位</td>
                  <td rowspan="1" colspan="2" class="td_label">职务</td>
                  <td rowspan="1" colspan="2" class="td_label">从事专业</td>
                </tr>
                <tr v-for="(item, index) in scope.row.lastValue" :key="index">
                  <td rowspan="1" colspan="2" class="text_center">
                    <template>{{ item.timePeriod }}</template>
                  </td>
                  <td rowspan="1" colspan="2" class="text_center">
                    <template>{{ item.organization }}</template>
                  </td>
                  <td rowspan="1" colspan="2" class="text_center">
                    <template>{{ item.positionHeld }}</template>
                  </td>
                  <td rowspan="1" colspan="2" class="text_center">
                    <template>{{ item.fieldWorked }}</template>
                  </td>
                </tr>
              </table>
            </template>
            <template v-else-if="scope.row.isPhonto">
              <avatarUpload style="width: 80px" v-model="scope.row.lastValue" :editable="false"></avatarUpload>
            </template>
            <template v-else>
              {{ scope.row.lastValue }}
            </template>
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="verifyStatus == '1' ? '更新内容' : '本次修改为'" align="left" prop="currValue">
        <template slot-scope="scope">
          <div :class="{ different: scope.row.isDifferent }">
            <template v-if="scope.row.isDicts">
              <dict-tag :options="dict.type[scope.row.dictName]" :value="scope.row.currValue" />
            </template>
            <template v-else-if="scope.row.isTechnical">
              <table v-if="scope.row.currValue">
                <tr v-for="(item, index) in scope.row.currValue" :key="index + '13'" style="position: relative">
                  <td rowspan="1" colspan="3" class="text_center">
                    <template>{{ item.firstLevel }}</template>
                  </td>
                  <td rowspan="1" colspan="3" class="text_center">
                    <template>{{ item.secondLevel }}</template>
                  </td>
                  <td rowspan="1" colspan="2" class="text_center">
                    <template>{{ item.thirdLevel }}</template>
                  </td>
                </tr>
              </table>
            </template>
            <template v-else-if="scope.row.isExperience">
              <table v-if="scope.row.currValue">
                <tr>
                  <td rowspan="1" colspan="2" class="td_label">时间</td>
                  <td rowspan="1" colspan="2" class="td_label">单位</td>
                  <td rowspan="1" colspan="2" class="td_label">职务</td>
                  <td rowspan="1" colspan="2" class="td_label">从事专业</td>
                </tr>
                <tr v-for="(item, index) in scope.row.currValue" :key="index">
                  <td rowspan="1" colspan="2" class="text_center">
                    <template>{{ item.timePeriod }}</template>
                  </td>
                  <td rowspan="1" colspan="2" class="text_center">
                    <template>{{ item.organization }}</template>
                  </td>
                  <td rowspan="1" colspan="2" class="text_center">
                    <template>{{ item.positionHeld }}</template>
                  </td>
                  <td rowspan="1" colspan="2" class="text_center">
                    <template>{{ item.fieldWorked }}</template>
                  </td>
                </tr>
              </table>
            </template>
            <template v-else-if="scope.row.isPhonto">
              <avatarUpload style="width: 80px" v-model="scope.row.currValue" :editable="false"></avatarUpload>
            </template>
            <template v-else>
              {{ scope.row.currValue }}
            </template>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-table v-if="wholeCompareFlag" height="300" v-loading="loading" :data="assemblyList">
      <el-table-column label="项目" align="right" width="300" prop="fieldName" />
      <el-table-column label="原记录内容" align="left" prop="lastValue" v-if="verifyStatus != '1'">
        <template slot-scope="scope">
          <div :class="{ different: scope.row.isDifferent }">
            <template v-if="scope.row.isDicts">
              <dict-tag :options="dict.type[scope.row.dictName]" :value="scope.row.lastValue" />
            </template>
            <template v-else-if="scope.row.isTechnical">
              <table v-if="scope.row.lastValue">
                <tr v-for="(item, index) in scope.row.lastValue" :key="index + '13'" style="position: relative">
                  <td rowspan="1" colspan="3" class="text_center">
                    <template>{{ item.firstLevel }}</template>
                  </td>
                  <td rowspan="1" colspan="3" class="text_center">
                    <template>{{ item.secondLevel }}</template>
                  </td>
                  <td rowspan="1" colspan="2" class="text_center">
                    <template>{{ item.thirdLevel }}</template>
                  </td>
                </tr>
              </table>
            </template>
            <template v-else-if="scope.row.isExperience">
              <table v-if="scope.row.lastValue">
                <tr>
                  <td rowspan="1" colspan="2" class="td_label">时间</td>
                  <td rowspan="1" colspan="2" class="td_label">单位</td>
                  <td rowspan="1" colspan="2" class="td_label">职务</td>
                  <td rowspan="1" colspan="2" class="td_label">从事专业</td>
                </tr>
                <tr v-for="(item, index) in scope.row.lastValue" :key="index">
                  <td rowspan="1" colspan="2" class="text_center">
                    <template>{{ item.timePeriod }}</template>
                  </td>
                  <td rowspan="1" colspan="2" class="text_center">
                    <template>{{ item.organization }}</template>
                  </td>
                  <td rowspan="1" colspan="2" class="text_center">
                    <template>{{ item.positionHeld }}</template>
                  </td>
                  <td rowspan="1" colspan="2" class="text_center">
                    <template>{{ item.fieldWorked }}</template>
                  </td>
                </tr>
              </table>
            </template>
            <template v-else-if="scope.row.isPhonto">
              <avatarUpload style="width: 80px" v-model="scope.row.lastValue" :editable="false"></avatarUpload>
            </template>
            <template v-else>
              {{ scope.row.lastValue }}
            </template>
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="verifyStatus == '1' ? '更新内容' : '本次修改为'" align="left" prop="currValue">
        <template slot-scope="scope">
          <div :class="{ different: scope.row.isDifferent }">
            <template v-if="scope.row.isDicts">
              <dict-tag :options="dict.type[scope.row.dictName]" :value="scope.row.currValue" />
            </template>
            <template v-else-if="scope.row.isTechnical">
              <table v-if="scope.row.currValue">
                <tr v-for="(item, index) in scope.row.currValue" :key="index + '13'" style="position: relative">
                  <td rowspan="1" colspan="3" class="text_center">
                    <template>{{ item.firstLevel }}</template>
                  </td>
                  <td rowspan="1" colspan="3" class="text_center">
                    <template>{{ item.secondLevel }}</template>
                  </td>
                  <td rowspan="1" colspan="2" class="text_center">
                    <template>{{ item.thirdLevel }}</template>
                  </td>
                </tr>
              </table>
            </template>
            <template v-else-if="scope.row.isExperience">
              <table v-if="scope.row.currValue">
                <tr>
                  <td rowspan="1" colspan="2" class="td_label">时间</td>
                  <td rowspan="1" colspan="2" class="td_label">单位</td>
                  <td rowspan="1" colspan="2" class="td_label">职务</td>
                  <td rowspan="1" colspan="2" class="td_label">从事专业</td>
                </tr>
                <tr v-for="(item, index) in scope.row.currValue" :key="index">
                  <td rowspan="1" colspan="2" class="text_center">
                    <template>{{ item.timePeriod }}</template>
                  </td>
                  <td rowspan="1" colspan="2" class="text_center">
                    <template>{{ item.organization }}</template>
                  </td>
                  <td rowspan="1" colspan="2" class="text_center">
                    <template>{{ item.positionHeld }}</template>
                  </td>
                  <td rowspan="1" colspan="2" class="text_center">
                    <template>{{ item.fieldWorked }}</template>
                  </td>
                </tr>
              </table>
            </template>
            <template v-else-if="scope.row.isPhonto">
              <avatarUpload style="width: 80px" v-model="scope.row.currValue" :editable="false"></avatarUpload>
            </template>
            <template v-else>
              {{ scope.row.currValue }}
            </template>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <div
      v-if="expertChangeList && expertChangeList.length > 1"
      style="margin: 16px; width: 100%; display: flex; justify-content: center"
    >
      <el-button type="primary" v-if="!wholeCompareFlag && verifyStatus != '1'" @click="showWholeCompareInfo"
        >查看完整对比</el-button
      >
      <el-button type="primary" v-if="wholeCompareFlag && verifyStatus != '1'" @click="showWholeCompareInfo"
        >查看改动项对比</el-button
      >
    </div>
  </div>
</template>

<script>
import dividerTitle from "@/views/components/dividerTitle";
import {
  listVerify,
  listExpertChange,
  getExpertChange,
  delExpertChange,
  addExpertChange,
  updateExpertChange,
} from "@/api/expert/expertInfoChange";
import avatarUpload from "@/components/avatarUpload/index.vue";
export default {
  components: { avatarUpload, dividerTitle },
  name: "changeVerifyDetail",
  props: {
    expertInfoId: {
      type: Number,
      default: "",
    },
    verifyStatus: {
      type: String,
      default: "",
    },
    expertChangeId: {
      type: String,
      default: "",
    },
  },
  dicts: ["sys_user_sex", "yes_no", "special_allowance", "unit_type", "expert_category", "expertinfo_status"],
  data() {
    return {
      wholeCompareFlag: false,
      verifyText1: "待审核",
      verifyStatus: "0",
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
      // 校级教师状态信息表格数据
      expertChangeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 1,
        onJobStatusCd: null,
        statusCd: null,
        userName: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},

      assemblyList: [],
      sourceObj: {},
    };
  },
  created() {
    this.queryParams.edExpertInfoId = this.expertInfoId;
    this.queryParams.status = this.verifyStatus;
    this.queryParams.edExpertInfoChangeId = this.expertChangeId;
    this.getList();
  },
  computed: {
    assemblyListFilter() {
      return this.assemblyList.filter((item) => item.isDifferent);
    },
  },
  methods: {
    showWholeCompareInfo() {
      this.wholeCompareFlag = !this.wholeCompareFlag;
    },
    handleClick() {
      this.queryParams.status = this.verifyStatus;
      this.getList();
    },
    /** 查询校级教师状态信息列表 */
    getList() {
      this.loading = true;
      listVerify(this.queryParams).then(async (response) => {
        this.expertChangeList = response.rows;

        // let data = {
        //   total: 2,
        //   rows: [
        //     {
        //       createBy: "",
        //       createTime: "2024-07-17 11:31:40",
        //       updateBy: "13512345676",
        //       updateTime: null,
        //       remark: null,
        //       edExpertInfoChangeId: 39,
        //       name: "张伟",
        //       idNumber: "340102197611278561",
        //       birthDate: "1976-11-27",
        //       photoUrl:
        //         "data:image/png;base64,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",
        //       workLocation: "广州市越秀区1",
        //       age: 47,
        //       sex: "0",
        //       workUnit: "中国科学院计算技术研究所",
        //       position: null,
        //       communicationAddress: "211123123",
        //       postalCode: null,
        //       officePhone: null,
        //       mobile: "13512345676",
        //       email: null,
        //       firstEducation: "博士",
        //       firstDegree: "博士学位",
        //       firstMajor: "计算机科学",
        //       firstGraduatedSchool: "北京大学",
        //       highestEducation: "硕士",
        //       highestDegree: "硕士学位",
        //       highestMajor: "软件工程",
        //       highestGraduatedSchool: "清华大学",
        //       technicalTitle: "高级研究员",
        //       isPhdSupervisor: 0,
        //       isAcademician: 0,
        //       enjoysSpecialAllowance: "无",
        //       currentMajor: "计算机科学",
        //       workYears: 20,
        //       relevantWorkYears: 12,
        //       unitType: "其他",
        //       familiarTechnicalFields: null,
        //       workResume: null,
        //       expertiseInScienceEducation:
        //         "人工智能与机器学习\n\n深度学习算法\n强化学习\n神经网络\n数据科学\n\n大数据分析\n数据挖掘技术\n统计建模\n",
        //       recentResearchActivities:
        //         "项目一：\n\n项目名称：基于深度学习的智能教育系统\n项目来源：国家高技术研究发展计划（863计划）\n立项时间：2020年1月\n本人承担的工作：作为项目负责人，领导团队进行教育数据分析、设计智能推荐算法，并监督系统的开发和测试。\n项目二：\n\n项目名称：跨学科STEM教育课程开发\n项目来源：教育部重点研究基地项目\n立项时间：2019年9月\n本人承担的工作：主导课程内容的创新设计，整合科学、技术、工程和数学领域的教学资源，负责跨学科团队的协调和课程实施效果评估。",
        //       publications:
        //         "近年发表的科技教育论著情况：\n\n作品名称：《未来教育：技术与创新的融合》\n\n出版社：高等教育出版社\n出版时间：2022年5月\n简介：本书探讨了教育技术的最新发展趋势，以及如何将创新技术应用于教育实践，提高教育质量和效率。\n作品名称：《人工智能在教育中的应用》\n\n出版社：科学出版社\n出版时间：2023年1月\n简介：本书详细介绍了人工智能技术在教育领域的应用案例，包括个性化学习、智能辅导和教育数据分析等。",
        //       awards:
        //         "项目名称：基于人工智能的个性化教育平台开发\n\n项目来源：国家教育部\n立项时间：2021年1月\n本人承担的工作：项目负责人，主导研究和开发工作\n项目名称：跨学科STEM教育模式创新研究\n\n项目来源：省级教育科学规划领导小组\n立项时间：2019年9月\n本人承担的工作：研究团队核心成员，负责课程设计和教学方法研究",
        //       intellectualProperty:
        //         "环保科技领域获奖情况：\n\n奖项名称：中华环保联合会杰出青年科技奖\n获奖时间：2023年\n获奖原因：王强教授在有机废弃物资源化转化技术、可再生能源利用与可持续发展领域的研究工作，对生态环境保护技术推广、生态环境保护观念形成发挥重要作用，其学术成果已被本行业认可，获得良好的社会效益和经济效益 。\n\n奖项名称：环境保护科学技术奖一等奖\n获奖时间：2023年\n获奖项目：“有色金属采选冶废渣场污染源头综合防控与生态修复关键技术及应用”\n获奖原因：该项目在环境科学技术上有重大创新，技术难度大，总体技术水平、主要技术经济指标达到国际先进水平，得到广泛应用，取得重大环境效益，对推动经济发展和社会进步有重大意义和作用 。",
        //       unitOpinion: null,
        //       unitStampDate: null,
        //       expertCategory: "T02",
        //       subLibrary: null,
        //       status: "0",
        //       delFlag: "0",
        //       userId: 146,
        //       edExpertInfoId: 34,
        //       edWorkExperienceList: [
        //         {
        //           createBy: null,
        //           createTime: null,
        //           updateBy: null,
        //           updateTime: null,
        //           remark: null,
        //           id: 370,
        //           edExpertInfoId: null,
        //           edExpertInfoChangeId: null,
        //           timePeriod: "2015-08-01,2015-10-01",
        //           organization: "中国科学院自动化研究所",
        //           positionHeld: "研究员",
        //           fieldWorked: "深度学习与模式识别",
        //         },
        //         {
        //           createBy: null,
        //           createTime: null,
        //           updateBy: null,
        //           updateTime: null,
        //           remark: null,
        //           id: 371,
        //           edExpertInfoId: null,
        //           edExpertInfoChangeId: null,
        //           timePeriod: "2010-07-01,2010-07-02",
        //           organization: "北京科技大学计算机科学与技术学院",
        //           positionHeld: "副教授",
        //           fieldWorked: "计算机视觉与图像处理",
        //         },
        //         {
        //           createBy: null,
        //           createTime: null,
        //           updateBy: null,
        //           updateTime: null,
        //           remark: null,
        //           id: 372,
        //           edExpertInfoId: null,
        //           edExpertInfoChangeId: null,
        //           timePeriod: "",
        //           organization: null,
        //           positionHeld: null,
        //           fieldWorked: null,
        //         },
        //         {
        //           createBy: null,
        //           createTime: null,
        //           updateBy: null,
        //           updateTime: null,
        //           remark: null,
        //           id: 373,
        //           edExpertInfoId: null,
        //           edExpertInfoChangeId: null,
        //           timePeriod: "",
        //           organization: null,
        //           positionHeld: null,
        //           fieldWorked: null,
        //         },
        //       ],
        //       edTechnicalFieldsList: [
        //         {
        //           createBy: null,
        //           createTime: null,
        //           updateBy: null,
        //           updateTime: null,
        //           remark: null,
        //           id: 374,
        //           edExpertInfoId: null,
        //           edExpertInfoChangeId: null,
        //           firstLevel: "人工智能",
        //           secondLevel: "人工智能1",
        //           thirdLevel: "人工智能2",
        //         },
        //         {
        //           createBy: null,
        //           createTime: null,
        //           updateBy: null,
        //           updateTime: null,
        //           remark: null,
        //           id: 375,
        //           edExpertInfoId: null,
        //           edExpertInfoChangeId: null,
        //           firstLevel: "机器学习",
        //           secondLevel: "机器学习1",
        //           thirdLevel: "机器学习2",
        //         },
        //         {
        //           createBy: null,
        //           createTime: null,
        //           updateBy: null,
        //           updateTime: null,
        //           remark: null,
        //           id: 376,
        //           edExpertInfoId: null,
        //           edExpertInfoChangeId: null,
        //           firstLevel: "数据挖掘",
        //           secondLevel: "数据挖掘1",
        //           thirdLevel: "数据挖掘2",
        //         },
        //         {
        //           createBy: null,
        //           createTime: null,
        //           updateBy: null,
        //           updateTime: null,
        //           remark: null,
        //           id: 377,
        //           edExpertInfoId: null,
        //           edExpertInfoChangeId: null,
        //           firstLevel: null,
        //           secondLevel: null,
        //           thirdLevel: null,
        //         },
        //       ],
        //       reviewerId: null,
        //       reviewDate: null,
        //       expertStatus: "0",
        //     },
        //     {
        //       createBy: "",
        //       createTime: "2024-07-17 11:30:02",
        //       updateBy: "13512345676",
        //       updateTime: "2024-07-17 10:57:23",
        //       remark: null,
        //       edExpertInfoChangeId: null,
        //       name: "张伟",
        //       idNumber: "340102197611278561",
        //       birthDate: "1976-11-27",
        //       photoUrl:
        //         "data:image/png;base64,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",
        //       workLocation: "广州市越秀区1",
        //       age: 47,
        //       sex: "0",
        //       workUnit: "中国科学院计算技术研究所",
        //       position: null,
        //       communicationAddress: "211",
        //       postalCode: null,
        //       officePhone: null,
        //       mobile: "13512345676",
        //       email: null,
        //       firstEducation: "博士",
        //       firstDegree: "博士学位",
        //       firstMajor: "计算机科学",
        //       firstGraduatedSchool: "北京大学",
        //       highestEducation: "硕士",
        //       highestDegree: "硕士学位",
        //       highestMajor: "软件工程",
        //       highestGraduatedSchool: "清华大学",
        //       technicalTitle: "高级研究员",
        //       isPhdSupervisor: 0,
        //       isAcademician: 0,
        //       enjoysSpecialAllowance: "无",
        //       currentMajor: "计算机科学",
        //       workYears: 20,
        //       relevantWorkYears: 12,
        //       unitType: "其他",
        //       familiarTechnicalFields: null,
        //       workResume: null,
        //       expertiseInScienceEducation:
        //         "人工智能与机器学习\n\n深度学习算法\n强化学习\n神经网络\n数据科学\n\n大数据分析\n数据挖掘技术\n统计建模\n",
        //       recentResearchActivities:
        //         "项目一：\n\n项目名称：基于深度学习的智能教育系统\n项目来源：国家高技术研究发展计划（863计划）\n立项时间：2020年1月\n本人承担的工作：作为项目负责人，领导团队进行教育数据分析、设计智能推荐算法，并监督系统的开发和测试。\n项目二：\n\n项目名称：跨学科STEM教育课程开发\n项目来源：教育部重点研究基地项目\n立项时间：2019年9月\n本人承担的工作：主导课程内容的创新设计，整合科学、技术、工程和数学领域的教学资源，负责跨学科团队的协调和课程实施效果评估。",
        //       publications:
        //         "近年发表的科技教育论著情况：\n\n作品名称：《未来教育：技术与创新的融合》\n\n出版社：高等教育出版社\n出版时间：2022年5月\n简介：本书探讨了教育技术的最新发展趋势，以及如何将创新技术应用于教育实践，提高教育质量和效率。\n作品名称：《人工智能在教育中的应用》\n\n出版社：科学出版社\n出版时间：2023年1月\n简介：本书详细介绍了人工智能技术在教育领域的应用案例，包括个性化学习、智能辅导和教育数据分析等。",
        //       awards:
        //         "项目名称：基于人工智能的个性化教育平台开发\n\n项目来源：国家教育部\n立项时间：2021年1月\n本人承担的工作：项目负责人，主导研究和开发工作\n项目名称：跨学科STEM教育模式创新研究\n\n项目来源：省级教育科学规划领导小组\n立项时间：2019年9月\n本人承担的工作：研究团队核心成员，负责课程设计和教学方法研究",
        //       intellectualProperty:
        //         "环保科技领域获奖情况：\n\n奖项名称：中华环保联合会杰出青年科技奖\n获奖时间：2023年\n获奖原因：王强教授在有机废弃物资源化转化技术、可再生能源利用与可持续发展领域的研究工作，对生态环境保护技术推广、生态环境保护观念形成发挥重要作用，其学术成果已被本行业认可，获得良好的社会效益和经济效益 。\n\n奖项名称：环境保护科学技术奖一等奖\n获奖时间：2023年\n获奖项目：“有色金属采选冶废渣场污染源头综合防控与生态修复关键技术及应用”\n获奖原因：该项目在环境科学技术上有重大创新，技术难度大，总体技术水平、主要技术经济指标达到国际先进水平，得到广泛应用，取得重大环境效益，对推动经济发展和社会进步有重大意义和作用 。",
        //       unitOpinion: null,
        //       unitStampDate: null,
        //       expertCategory: "T02",
        //       subLibrary: null,
        //       status: "0",
        //       delFlag: "0",
        //       userId: 146,
        //       edExpertInfoId: 34,
        //       edWorkExperienceList: [
        //         {
        //           createBy: null,
        //           createTime: null,
        //           updateBy: null,
        //           updateTime: null,
        //           remark: null,
        //           id: 362,
        //           edExpertInfoId: 34,
        //           edExpertInfoChangeId: null,
        //           timePeriod: "2015-08-01,2015-10-01",
        //           organization: "中国科学院自动化研究所",
        //           positionHeld: "研究员",
        //           fieldWorked: "深度学习与模式识别",
        //         },
        //         {
        //           createBy: null,
        //           createTime: null,
        //           updateBy: null,
        //           updateTime: null,
        //           remark: null,
        //           id: 363,
        //           edExpertInfoId: 34,
        //           edExpertInfoChangeId: null,
        //           timePeriod: "2010-07-01,2010-07-02",
        //           organization: "北京科技大学计算机科学与技术学院",
        //           positionHeld: "副教授",
        //           fieldWorked: "计算机视觉与图像处理",
        //         },
        //         {
        //           createBy: null,
        //           createTime: null,
        //           updateBy: null,
        //           updateTime: null,
        //           remark: null,
        //           id: 364,
        //           edExpertInfoId: 34,
        //           edExpertInfoChangeId: null,
        //           timePeriod: "",
        //           organization: null,
        //           positionHeld: null,
        //           fieldWorked: null,
        //         },
        //         {
        //           createBy: null,
        //           createTime: null,
        //           updateBy: null,
        //           updateTime: null,
        //           remark: null,
        //           id: 365,
        //           edExpertInfoId: 34,
        //           edExpertInfoChangeId: null,
        //           timePeriod: "",
        //           organization: null,
        //           positionHeld: null,
        //           fieldWorked: null,
        //         },
        //       ],
        //       edTechnicalFieldsList: [
        //         {
        //           createBy: null,
        //           createTime: null,
        //           updateBy: null,
        //           updateTime: null,
        //           remark: null,
        //           id: 366,
        //           edExpertInfoId: 34,
        //           edExpertInfoChangeId: null,
        //           firstLevel: "人工智能",
        //           secondLevel: "人工智能1",
        //           thirdLevel: "人工智能2",
        //         },
        //         {
        //           createBy: null,
        //           createTime: null,
        //           updateBy: null,
        //           updateTime: null,
        //           remark: null,
        //           id: 367,
        //           edExpertInfoId: 34,
        //           edExpertInfoChangeId: null,
        //           firstLevel: "机器学习",
        //           secondLevel: "机器学习1",
        //           thirdLevel: "机器学习2",
        //         },
        //         {
        //           createBy: null,
        //           createTime: null,
        //           updateBy: null,
        //           updateTime: null,
        //           remark: null,
        //           id: 368,
        //           edExpertInfoId: 34,
        //           edExpertInfoChangeId: null,
        //           firstLevel: "数据挖掘",
        //           secondLevel: "数据挖掘1",
        //           thirdLevel: "数据挖掘2",
        //         },
        //         {
        //           createBy: null,
        //           createTime: null,
        //           updateBy: null,
        //           updateTime: null,
        //           remark: null,
        //           id: 369,
        //           edExpertInfoId: 34,
        //           edExpertInfoChangeId: null,
        //           firstLevel: null,
        //           secondLevel: null,
        //           thirdLevel: null,
        //         },
        //       ],
        //       reviewerId: null,
        //       reviewDate: null,
        //       expertStatus: "0",
        //     },
        //   ],
        //   code: 200,
        //   msg: "查询成功",
        // };
        
        if (this.expertChangeList) {
          let curObj = this.expertChangeList[0];
          this.verifyText1 = "提交时间:" + curObj.createTime;
        }
        this.loading = false;

        // 2024-01-10 当数据自存在当前记录的内容，而没有上一次记录的内容时，默认展示完整数据
        this.wholeCompareFlag = false;
        if (this.verifyStatus == "1") {
          this.wholeCompareFlag = true;
        }

        this.sourceObj = this.expertChangeList[1];

        // 字段的map配置
        let map = {
          photoUrl: {
            fieldName: "头像",
            isDicts: false,
            isPhonto: true,
          },
          name: {
            fieldName: "名称",
            isDicts: false,
          },
          idNumber: {
            fieldName: "身份证号码",
            isDicts: false,
          },
          birthDate: {
            fieldName: "出生年月",
            isDicts: false,
          },
          workLocation: {
            fieldName: "工作所在地",
            isDicts: false,
          },
          age: {
            fieldName: "年龄",
            isDicts: false,
          },
          sex: {
            fieldName: "性别",
            isDicts: true,
            dictName: "sys_user_sex",
          },
          workUnit: {
            fieldName: "工作单位",
            isDicts: false,
          },
          position: {
            fieldName: "职务",
            isDicts: false,
          },
          communicationAddress: {
            fieldName: "通讯地址",
            isDicts: false,
          },
          postalCode: {
            fieldName: "邮编",
            isDicts: false,
          },
          officePhone: {
            fieldName: "办公电话",
            isDicts: false,
          },
          mobile: {
            fieldName: "手机",
            isDicts: false,
          },
          email: {
            fieldName: "E-mail",
            isDicts: false,
          },
          firstEducation: {
            fieldName: "第一学历",
            isDicts: false,
          },
          firstDegree: {
            fieldName: "学位",
            isDicts: false,
          },
          firstMajor: {
            fieldName: "专业",
            isDicts: false,
          },
          firstGraduatedSchool: {
            fieldName: "毕业学校",
            isDicts: false,
          },
          highestEducation: {
            fieldName: "最高学历",
            isDicts: false,
          },
          highestDegree: {
            fieldName: "学位",
            isDicts: false,
          },
          highestMajor: {
            fieldName: "专业",
            isDicts: false,
          },
          highestGraduatedSchool: {
            fieldName: "毕业学校",
            isDicts: false,
          },
          technicalTitle: {
            fieldName: "专业技术职称/专业资格",
            isDicts: false,
          },
          isPhdSupervisor: {
            fieldName: "是否博导",
            isDicts: true,
            dictName: "yes_no",
          },
          isAcademician: {
            fieldName: "是否院士",
            isDicts: true,
            dictName: "yes_no",
          },
          enjoysSpecialAllowance: {
            fieldName: "享受特殊津贴 省级, 国际级, 无",
            isDicts: true,
            dictName: "special_allowance",
          },
          currentMajor: {
            fieldName: "现从事专业",
            isDicts: false,
          },
          workYears: {
            fieldName: "工作年限",
            isDicts: false,
          },
          relevantWorkYears: {
            fieldName: "相关技术/管理工作年限",
            isDicts: false,
          },
          unitType: {
            fieldName: "单位类别",
            isDicts: true,
            dictName: "unit_type",
          },
          edTechnicalFieldsList: {
            fieldName: "现熟悉技术领域",
            isDicts: false,
            isTechnical: true,
          },
          edWorkExperienceList: {
            fieldName: "相关工作经历",
            isDicts: false,
            isExperience: true,
          },
          expertiseInScienceEducation: {
            fieldName: "本人专长的学科和领域",
            isDicts: false,
          },
          recentResearchActivities: {
            fieldName: "近年主要科学教育研究和活动及完成情况",
            isDicts: false,
          },
          publications: {
            fieldName: "近年发表科技教育论著、科技教育作品",
            isDicts: false,
          },
          awards: {
            fieldName: "科技教育研究和活动获奖情况",
            isDicts: false,
          },
          intellectualProperty: {
            fieldName: "环保科技、知识产权",
            isDicts: false,
          },
          unitOpinion: {
            fieldName: "单位意见",
            isDicts: false,
          },
          unitStampDate: {
            fieldName: "单位工作时间",
            isDicts: false,
          },
          expertCategory: {
            fieldName: "专家类型",
            isDicts: true,
            dictName: "expert_category",
          },
          expertStatus: {
            fieldName: "专家状态",
            isDicts: true,
            dictName: "expertinfo_status",
          },
        };
        let list = response.rows;

        //移除掉id属性用于对比两个数组是否相等
        list.forEach((item) => {
          item.edWorkExperienceList.forEach((obj) => {
            delete obj.id;
            delete obj.edExpertInfoId;
          });
          item.edTechnicalFieldsList.forEach((obj) => {
            delete obj.id;
            delete obj.edExpertInfoId;
          });
        });
        this.assemblyList = this.setAssemblyList(list, map);
        console.log(this.assemblyList);
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        statusCd: null,
        createTime: null,
        userId: null,
        userName: null,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.schoolTeaOnJobStatusId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加校级教师状态信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const schoolTeaOnJobStatusId = row.schoolTeaOnJobStatusId || this.ids;
      getJobStatus(schoolTeaOnJobStatusId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改校级教师状态信息";
      });
    },

    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "tea/jobStatus/export",
        {
          ...this.queryParams,
        },
        `jobStatus_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
<style>
.text_center,
.td_label {
  text-align: center;
  width: 200px;
  height: 50px;
}

.different {
  color: red;
  position: relative;
}
</style>
