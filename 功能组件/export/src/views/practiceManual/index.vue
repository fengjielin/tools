<template>
  <div class="app-container manual" style="margin-top: -32px; margin-left: -20px; margin-right: -20px;" v-loading="loading">
    <div id="print" class="pdf-group" style="padding-top: 24px; box-sizing: border-box; font-size: 18px;">
      <div class="cover" v-if="coverUrl" :style="{ background: 'url(' + coverUrl + ') center top/cover no-repeat' }">
        <div class="section_area" style="font-size: 24px; width: 100%; text-align: left; line-height: 2;">
          <div class="section_line">
            <div style="display: flex" >
              <div class="section_type">教师姓名：</div>
              <div class="section_item">
                <span style="display: inline-block; width: 100px; text-decoration: solid;">{{ studentInfo.name }}</span>
              </div>
            </div>
          </div>
          <template>
            <div class="section_line">
              <div style="display: flex" >
                <div class="section_type">派出院校：</div>
                <div class="section_item">{{ studentInfo.workUnit }}</div>
              </div>
            </div>
            <div class="section_line">
              <div style="display: flex" >
                <div class="section_type">企业实践单位：</div>
                <div class="section_item">{{ practiceInfo.enterpriseName }}</div>
              </div>
            </div>
            <div class="section_line">
              <div style="display: flex" >
                <div class="section_type">实践项目：</div>
                <div class="section_item">{{ trainingObj.name }}</div>
              </div>
            </div>
            <div class="section_line">
              <div style="display: flex" >
                <div class="section_type">实践时间：</div>
                <div class="section_item">
                  {{ parseTime(practiceInfo.beginDate, '{y}-{m}-{d}') }} - {{ parseTime(practiceInfo.endDate, '{y}-{m}-{d}') }}
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>

      <div class="p_style pdf-group-item pdf-split-page" style="padding-top: 20px">基础信息</div>

      <div class="card-wrapper" style="padding: 0 20px;">
        <div class="card__header pdf-group-item">
          <div class="title">一、教师个人信息</div>
        </div>
        <div class="box-card">
          <div class="info-wrapper">
            <div class="j-card">
              <div class="j-card-line">
                <div class="j-card-item pdf-group-item">
                  <span class="label">教师姓名：</span>
                  <span>{{ studentInfo.name }}</span>
                </div>
                <div class="j-card-item pdf-group-item">
                  <span class="label">学 历：</span>
                  <dict-tag :options="dict.type.sys_education_type" :value="studentInfo.education" />
                </div>

                <div class="j-card-item pdf-group-item">
                  <span class="label">年 龄：</span>
                  <span>{{ getAge(studentInfo.birthDate) }}</span>
                </div>
                <div class="j-card-item pdf-group-item">
                  <span class="label">职 称：</span>
                  <span>{{ studentInfo.professionalTitle }}</span>
                </div>

                <div class="j-card-item pdf-group-item">
                  <span class="label">任教专业/学科：</span>
                  <dict-tag style="display: inline" :options="dict.type.base_major" :value="studentInfo.teachMajor" />
                </div>
                <div class="j-card-item pdf-group-item">
                  <span class="label">职业教育年限：</span>
                  <span>{{ studentInfo.workYears ? studentInfo.workYears + '年' : '' }}</span>
                </div>

                <div class="j-card-item pdf-group-item">
                  <span class="label">联系电话：</span>
                  <span>{{ studentInfo.phone }}</span>
                </div>
                <div class="j-card-item pdf-group-item">
                  <span class="label">电子邮箱：</span>
                  <span>{{ studentInfo.email }}</span>
                </div>
              </div>

              <el-divider style="margin: 16px 0" class="pdf-group-item"></el-divider>

              <div class="j-card-line" style="display: flex">
                <div class="j-card-item pdf-group-item" v-if="studentInfo.isNewTeacher == 1">
                  <el-tag>新任教师</el-tag>
                </div>
                <div class="j-card-item pdf-group-item" v-if="studentInfo.isClassTeacher == 1">
                  <el-tag type="success">辅导员（班主任）</el-tag>
                </div>
                <div class="j-card-item pdf-group-item" v-if="studentInfo.isMidCadre == 1">
                  <el-tag type="info">中层干部</el-tag>
                </div>
                <div class="j-card-item pdf-group-item" v-if="studentInfo.isHeadmaster == 1">
                  <el-tag type="warning">在任校长</el-tag>
                </div>
              </div>
              <div class="j-card-line">
                <div class="j-card-item pdf-group-item" v-if="studentInfo.isQjrc">
                  <span class="label">区级人才梯队：</span>
                  <dict-tag style="display: inline" :options="dict.type.base_rctd_type" :value="studentInfo.isQjrc" />
                </div>
                <div class="j-card-item pdf-group-item" v-if="studentInfo.isXjzy">
                  <span class="label" style="display: inline-block; width: 120px">校级专业成长培育序列教师</span>
                  <span>：</span>
                  <dict-tag style="display: inline" :options="dict.type.base_xjzy_type" :value="studentInfo.isXjzy" />
                </div>
              </div>
              <div class="j-card-line">
                <div class="j-card-item pdf-group-item" v-if="studentInfo.isSjcz">
                  <span class="label">市级成长序列：</span>
                  <dict-tag style="display: inline" :options="dict.type.base_sjcz_type" :value="studentInfo.isSjcz" />
                </div>
              </div>

              <div class="item" style="margin-bottom: 8px">
                <div class="label pdf-group-item" style="margin-bottom: 8px">专业相关主要职业资格等级证书（中级及以上），近5年获证情况（证书名称、颁证单位、证书等级、获证时间）：</div>
                <div>
                  <ul class="certificate">
                    <li class="c-li pdf-group-item" v-for="(item, index) in certificateList" :key="index">
                      <span class="c-item">{{ item.certificateName }}</span>
                      <span class="c-item">{{ item.certificateUnit }}</span>
                      <span class="c-item">{{ item.certificateLevel }}</span>
                      <span class="c-item">{{ item.certificateGetDate }}</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div class="item">
                <div class="label pdf-group-item">以往的企业实践经历：</div>
                <div v-html="practiceSignupInfo.practiceRecord" class="item-contents ql-editor practiceRecord"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="card__header pdf-group-item">
          <div class="title">二、教师个人情况及需求</div>
        </div>
        <div class="box-card">
          <div class="info-wrapper">
            <div class="j-card">
              <div class="j-card-line">
                <div class="j-card-item pdf-group-item">
                  <span class="label">实践单位：</span>
                  {{ practiceInfo.enterpriseName }}
                </div>
                <div class="j-card-item pdf-group-item">
                  <span class="label">实践岗位：</span>
                  {{ practiceInfo.trainingPostName }}
                </div>
                <div class="j-card-item pdf-group-item">
                  <span class="label">实践时间：</span>
                  {{ parseTime(practiceInfo.beginDate, '{y}-{m}-{d}') }}
                  <br />
                  {{ parseTime(practiceInfo.endDate, '{y}-{m}-{d}') }}
                </div>
                <div class="j-card-item pdf-group-item">
                  <span class="label">带教导师：</span>
                  {{ practiceInfo.teacherName }}
                </div>
              </div>

              <el-divider content-position="center" class="pdf-group-item"></el-divider>
              <div v-html="practiceSignupInfo.personalInfoNeeds" class="personalInfoNeeds"></div>
            </div>
          </div>
        </div>

        <!-- <div class="card__header ">
          <span class="title">三、派出院校对教师培训预期及需求</span>
        </div>
        <div class="card__header ">
          <span class="title">四、专指委与企业实践基地诊断意见</span>
        </div> -->

        <div class="card__header pdf-group-item">
          <div class="title">三、“双项目”设定情况</div>
        </div>
        <div class="box-card">
          <div class="info-wrapper proj-info-wrapper" style="padding-top: 12px">
            <div class="j-card proj-item" style="padding-bottom: 0" v-for="(item, index) in projList" :key="index">
              <template v-if="item.regInfoFormProjId">
                <div class="proj-item-top">
                  <div class="item-proj pdf-group-item">
                    <span class="label">项目类别：</span>
                    <dict-tag :options="dict.type.reg_proj_type" :value="item.projType" />
                  </div>
                  <div class="item-proj pdf-group-item">
                    <span class="label">项目名称：</span>
                    <span>{{ item.projName }}</span>
                  </div>
                </div>
                <!-- P01:工作项目 P02: 教学项目 -->
                <div class="" style="margin-bottom: 12px">
                  <div class="label pdf-group-item" v-if="item.projType == 'P01'">拟参与的项目内容：</div>
                  <div class="label pdf-group-item" v-if="item.projType == 'P02'">拟解决的教学问题：</div>
                  <div class="ql-editor projContent" v-html="item.projContent"></div>
                </div>
                <div class="" style="margin-bottom: 12px">
                  <div class="label pdf-group-item" v-if="item.projType == 'P01'">预期项目成果名称及形式（产品生产、项目开发、方案设计、流程优化、技术服务、技术改造、横向课题等）：</div>
                  <div class="label pdf-group-item" v-if="item.projType == 'P02'">预期项目成果名称及形式（人培方案优化、教学实施方案编制、公开课展示、论文、教学资源开发、实训中心建设、科研课题等）：</div>
                  <div class="ql-editor projResult" v-html="item.projResult"></div>
                </div>
              </template>
            </div>
          </div>
        </div>

        <div class="card__header pdf-group-item">
          <div class="p_style">教师企业实践学习计划</div>
        </div>
        <div class="box-card">
          <div class="info-wrapper">
            <div class="j-card">
              <div class="practiceStudyPlan" v-html="practiceSignupInfo.practiceStudyPlan"></div>
            </div>
          </div>
        </div>

        <div class="card__header pdf-group-item">
          <div class="p_style">工作周志</div>
        </div>
        <div class="box-card">
          <div class="info-wrapper">
            <table>
              <colgroup>
                <col width="180">
                <col width="">
                <col width="100">
                <col width="">
              </colgroup>
              <thead>
                <tr class="pdf-group-item">
                  <th rowspan="1" colspan="1">日期</th>
                  <th rowspan="1" colspan="1">实践内容</th>
                  <th rowspan="1" colspan="1">带教导师</th>
                  <th rowspan="1" colspan="1">导师点评</th>
                </tr>
              </thead>
              <tbody>
                <tr class="pdf-group-item" v-for="(item, index) in reportsList" :key="index">
                  <td>{{ item.weeklyDate }}</td>
                  <td>{{ item.practiceContent }}</td>
                  <td style="text-align: center;">{{ item.teacherName }}</td>
                  <td>{{ item.teacherSuggestion }}</td>
                </tr>
                <tr class="pdf-group-item" v-if="reportsList.length == 0">
                  <td colspan="4" style="text-align: center;">暂无数据</td>
                </tr>
              </tbody>
            </table>

            <!-- <el-table v-loading="loading" :data="reportsList">
              <el-table-column label="日期" align="center" prop="weeklyDate" width="300"></el-table-column>
              <el-table-column label="实践内容" align="left" prop="practiceContent" />
              <el-table-column label="带教导师" align="left" prop="teacherName" />
              <el-table-column label="导师点评" align="left" prop="teacherSuggestion" />
            </el-table> -->
          </div>
        </div>

        <div class="card__header pdf-group-item">
          <div class="p_style">请假记录</div>
        </div>
        <div class="box-card">
          <div class="info-wrapper">
            <table>
              <colgroup>
                <col width="180">
                <col width="">
                <col width="100">
                <col width="">
              </colgroup>
              <thead>
                <tr class="pdf-group-item">
                  <th rowspan="1" colspan="1">请假时间</th>
                  <th rowspan="1" colspan="1">请假事由</th>
                  <th rowspan="1" colspan="1">请假方式</th>
                  <th rowspan="1" colspan="1">审批结果</th>
                </tr>
              </thead>
              <tbody>
                <tr class="pdf-group-item" v-for="(item, index) in leaveList" :key="index">
                  <td>
                    <span v-if="item.leaveType == '3'">{{ parseTime(item.leaveBeginTime, '{y}-{m}-{d}') }} ~ {{ parseTime(item.leaveEndTime, '{y}-{m}-{d}') }}</span>
                    <span v-else>{{ parseTime(item.leaveBeginTime, '{y}-{m}-{d}') }}</span>
                  </td>
                  <td>{{ item.reason }}</td>
                  <td>
                    <dict-tag :options="dict.type.leave_type" :value="item.leaveType" />
                  </td>
                  <td>
                    <dict-tag :options="dict.type.is_verify" :value="item.isVerify" />
                  </td>
                </tr>
                <tr class="pdf-group-item" v-if="leaveList.length == 0">
                  <td colspan="4" style="text-align: center;">暂无数据</td>
                </tr>
              </tbody>
            </table>
            <!-- <el-table v-loading="loading" :data="leaveList">
              <el-table-column label="请假时间" align="center" prop="" width="300">
                <template slot-scope="scope">
                  <span v-if="scope.row.leaveType == '3'">{{ parseTime(scope.row.leaveBeginTime, '{y}-{m}-{d}') }} ~ {{ parseTime(scope.row.leaveEndTime, '{y}-{m}-{d}') }}</span>
                  <span v-else>{{ parseTime(scope.row.leaveBeginTime, '{y}-{m}-{d}') }}</span>
                </template>
              </el-table-column>
              <el-table-column label="请假事由" align="left" prop="reason" />
              <el-table-column label="请假方式" align="left" prop="leaveType">
                <template slot-scope="scope">
                  <dict-tag :options="dict.type.leave_type" :value="scope.row.leaveType" />
                </template>
              </el-table-column>
              <el-table-column label="审批结果" align="left" prop="teacherName">
                <template slot-scope="scope">
                  <dict-tag :options="dict.type.is_verify" :value="scope.row.isVerify" />
                </template>
              </el-table-column>
            </el-table> -->
          </div>
        </div>

        <template v-if="!hasPrint">
          <div class="card__header">
            <div class="p_style">实践成果</div>
          </div>
          <div class="box-card">
            <div class="info-wrapper">
              <ul class="upload-file-list">
                <li :key="fileIndex" class="upload-list__item" v-for="(file, fileIndex) in trainingPerformanceList" :title="file.name">
                  <el-link :href="`${baseUrl}${file.path}`" :underline="false" target="_blank">
                    <span class="el-icon-document">{{ file.name }}</span>
                  </el-link>
                </li>
              </ul>
              <div v-if="trainingPerformanceList.length == 0" style="text-align: center; border-bottom: 1px solid #e6ebf5; border-top: 1px solid #e6ebf5">
                <span style="line-height: 60px; color: #909399">暂无数据</span>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
    <!-- <div style="margin: 36px auto; display: flex; justify-content: center" v-if="hasPrint">
      <el-button type="primary" @click="selectExport">导 出</el-button>
    </div> -->

    <el-dialog title="选择导出" :visible.sync="open" width="500px" append-to-body>
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
      <el-checkbox-group v-model="checkListExport" @change="handleCheckedCitiesChange">
        <el-checkbox label="学生信息">学生信息</el-checkbox>
        <el-checkbox label="实践信息">实践信息</el-checkbox>
        <el-checkbox label="工作周志">工作周志</el-checkbox>
        <el-checkbox label="请假记录">请假记录</el-checkbox>
      </el-checkbox-group>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listReports } from '@/api/training/weeklyReports';
import { listApplyStudent } from '@/api/audit/applyStudent';
import { listForm } from '@/api/training/form';
import { listDiagnosis } from '@/api/training/diagnosis';
import { listLeave } from '@/api/training/leave';
import { listProj } from '@/api/training/proj';
import { listCertificate } from '@/api/training/certificate';
import { getTrainingResult } from '@/api/training/trainingResult';
import { getTraining } from '@/api/training/training';

// import PdfLoader from '@/utils/PdfLoader';
import { htmlToPdf } from '@/utils/htmlToPdf';
import { PdfLoader } from "@/utils/pdfLoader-jseven";

export default {
  name: 'practiceManual1', // 企业实践手册
  components: {},
  dicts: ['sys_education_type', 'sys_nation_type', 'base_rctd_type', 'base_xjzy_type', 'base_sjcz_type', 'base_major', 'base_sdept', 'is_verify', 'leave_type', 'reg_proj_type'],
  props: {
    signUpId: {
      type: [Number, String]
    },
    userId: {
      type: [Number, String]
    },
    trainingId: {
      type: [Number, String]
    },
    hasPrint: {
      type: Boolean,
      default: true
    },
    // 是否在数据全部请求完成后自动导出手册
    autoExport: {
      type: Boolean,
      default: false
    },
    // 导出的类型，传'zip'表示需要将多个pdf打包成zip
    outputType: {
      type: [Number, String]
    },
  },
  data() {
    return {
      // userId:"",
      // trainingId: "",
      loading: false,
      studentInfo: {}, // 学员信息
      practiceInfo: {}, // 实践信息
      practiceSignupInfo: {}, // 实践信息
      reportsList: [], // 工作周志
      reportsParams: {
        pageNum: 1,
        pageSize: 999999,
        userId: ''
      },
      reportsTotal: 0,
      leaveList: [], // 请假记录
      leaveParams: {
        pageNum: 1,
        pageSize: 999999,
        userId: ''
      },
      leaveTotal: 0,

      open: false,
      title: '',

      checkListExport: [],
      checkAll: false,
      checkAllList: ['学生信息', '实践信息', '工作周志', '请假记录'],
      isIndeterminate: false,

      diagnosis: {}, // 专家点评意见

      // 双项目信息情况
      projList: [],

      certificateList: [],
      baseUrl: process.env.VUE_APP_BASE_API,

      trainingPerformanceList: [], // 成果附件列表

      trainingObj: {},
      coverUrl: '', // 封面地址
    };
  },
  created() {
    // this.userId = this.$route.params && this.$route.params.userId;
    // this.trainingId = this.$route.query && this.$route.query.trainingId;

    let tasks = [];
    tasks.push(this.getTraining());
    tasks.push(this.getPracticeInfo());
    tasks.push(this.getFList());
    tasks.push(this.getCList());
    tasks.push(this.getPList());
    tasks.push(this.getReportsList());
    tasks.push(this.getLeaveList());
    Promise.all(tasks).then(() => {
      console.log('全部接口请求完成');
      if(this.autoExport){
        this.selectExport();
      }
    })
  },
  mounted() {},
  watch: {},
  computed: {
    sexIsMan() {
      return key => {
        return key == 0 ? '男' : key == 1 ? '女' : '未知';
      };
    },
    isTrue() {
      return key => {
        return key == 0 ? '否' : key == 1 ? '是' : '未知';
      };
    },
    // 根据出生日期计算年龄 格式为"1996-12-15"
    getAge() {
      return strBirthday => {
        if (!strBirthday) return;
        var returnAge,
          strBirthdayArr = strBirthday.split('-'),
          birthYear = strBirthdayArr[0],
          birthMonth = strBirthdayArr[1],
          birthDay = strBirthdayArr[2],
          noeDate = new Date(),
          nowYear = noeDate.getFullYear(),
          nowMonth = noeDate.getMonth() + 1,
          nowDay = noeDate.getDate();
        if (nowYear == birthYear) {
          returnAge = 0; //同年 则为0周岁
        } else {
          var ageDiff = nowYear - birthYear; //年之差
          if (ageDiff > 0) {
            if (nowMonth == birthMonth) {
              var dayDiff = nowDay - birthDay; //日之差
              if (dayDiff < 0) {
                returnAge = ageDiff - 1;
              } else {
                returnAge = ageDiff;
              }
            } else {
              var monthDiff = nowMonth - birthMonth; //月之差
              if (monthDiff < 0) {
                returnAge = ageDiff - 1;
              } else {
                returnAge = ageDiff;
              }
            }
          } else {
            returnAge = -1; //返回-1 表示出生日期输入错误 晚于今天
          }
        }
        return returnAge; //返回周岁年龄
      };
    }
  },
  methods: {
    getTraining(){
      return new Promise((resolve,reject) => {
        this.loading = true;
        getTraining(this.trainingId).then((response) => {
          this.loading = false;
          this.trainingObj = response.data;
          if(this.trainingObj && this.trainingObj.coverUrl){
            this.coverUrl = this.baseUrl + this.trainingObj.coverUrl
          }else{
            this.coverUrl = ''
          }
          resolve()
        });
      })
    },
    // 给富文本中标签 添加class pdf-group-item 用于判断是否换行
    setPdfGroupItemToP(className){
      this.$nextTick(() => {
          let PList = document.querySelectorAll(`.${className} > p`);
          console.log(className, PList);
          for (let i = 0; i < PList.length; i++) {
            const element = PList[i];
            element.classList.add('pdf-group-item');
          }
        })
    },
    getTrainingResult(resultId) {
      getTrainingResult(resultId).then(response => {
        this.trainingPerformanceList = response.data.trainingPerformanceList;
      });
    },
    /** 查询双项目设定情况列表 */
    getPList() {
      return new Promise((resolve,reject) => {
        this.loading = true;
        let params = {
          pageNum: 1,
          pageSize: 9999,
          userId: this.userId,
          trainingId: this.trainingId,
          signedUp: 0 //是否已报名 0 是 2否
        };
        listProj(params).then(response => {
          this.projList = response.rows;
          if (this.projList.length % 2 != 0) {
            let data = {};
            this.projList.push(data);
          }
          // 2n+1
          this.totalp = response.total;
          this.loading = false;

          this.setPdfGroupItemToP('projContent')
          this.setPdfGroupItemToP('projResult')
          resolve();
        });
      })
    },
    // 导出选择
    selectExport() {
      // htmlToPdf('企业实践手册', 'print');

      // let pdf = new PdfLoader(document.querySelector("#print"), 'pdf' , 'itemClass')
      // pdf.outPutPdfFn()

      // 2023-11-13 更改导出pdf的方法
      // https://gitee.com/fjielin/vue-pdf2#%E4%BD%BF%E7%94%A8
      let loading = ''
      if(this.outputType != 'zip'){
        loading = this.$loading({
        lock: true,
        text: '正在导出，请稍后',
        spinner: 'el-icon-loading',
        // background: 'rgba(0, 0, 0, 0.7)'
      });
      }
      const element = document.querySelector('#print');
      let fileName =  this.studentInfo?.name + '-' + this.trainingObj?.name + '-企业实践手册-'
      const pdfLoader = new PdfLoader(element, {
        // footer: footer,
        // header: header,
        fileName: fileName,
        direction: 'p',
        isPageMessage: true,
        outputType: this.outputType,
        contentWidth: 595
      });
      pdfLoader.getPdf().then((res) => {
        console.log('[ 导出成功] >', res);
        if(this.outputType != 'zip'){
          loading.close();
        }
        let exportSuccessList = this.$store.state.training.exportSuccessList;
        if(exportSuccessList){
          exportSuccessList.push(this.signUpId);
        }else{
          exportSuccessList = [this.signUpId]
        }
        this.$store.dispatch('training/changeExportSuccessList', exportSuccessList);
        this.$store.dispatch('training/changeCurExportItem', '');
        this.$emit('exportSuccess', res.pdfResult, fileName);
      }).catch(() => {
        this.$store.dispatch('training/changeExportFailed', true);
      });
    },
    cancel() {
      this.open = false;
    },
    submitForm() {
      console.log(this.checkListExport);
      if (!this.checkListExport.length) {
        return this.$modal.msgWarning('请选择需要导出的内容');
      }
    },
    handleCheckAllChange(val) {
      this.checkListExport = val ? this.checkAllList : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.checkAllList.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.checkAllList.length;
    },
    handleCurrentChangeReport(i) {
      this.reportsParams.pageNum = i;
      this.getReportsList();
    },
    handleCurrentChangeLeave(i) {
      this.leaveParams.pageNum = i;
      this.getLeaveList();
    },
    // 获得 工作周志
    getReportsList() {
      return new Promise((resolve,reject) => {
        this.reportsParams.userId = this.userId;
        this.reportsParams.trainingId = this.trainingId;
        this.reportsParams.isVerify = 1;
        this.loading = true;
        listReports(this.reportsParams).then(res => {
          this.reportsList = res.rows;
          this.reportsTotal = res.total;
          this.loading = false;
          resolve();
        });
      })
    },
    // 获得 请假记录
    getLeaveList() {
      return new Promise((resolve,reject) => {
        this.loading = true;
        this.leaveParams.userId = this.userId;
        this.leaveParams.trainingId = this.trainingId;
        listLeave(this.leaveParams).then(res => {
          this.leaveList = res.rows;
          this.leaveTotal = res.total;
          this.loading = false;
          resolve();
        });
      })
    },

    /** 获得 实践信息 */
    getPracticeInfo() {
      return new Promise((resolve,reject) => {
        this.loading = true;
        let params = {
          pageNum: 1,
          pageSize: 99999,
          trainingId: this.trainingId,
          userId: this.userId
        };
        this.loading = true;
        listApplyStudent(params).then(res => {
          let rows = res.rows;
          if (rows.length) {
            this.practiceInfo = rows[0];
            this.studentInfo = rows[0].trainingStudent || {};

            this.resultId = rows[0].trainingResultInfo.resultId;
            // 当可打印时不显示成果列表
            if (this.resultId && !this.hasPrint) {
              this.getTrainingResult(this.resultId);
            }
          } else {
            this.practiceInfo = {};
            this.studentInfo = {};
          }
          this.loading = false;
          resolve();
        });
      })
    },
    /** 查询企业实践教师报名信息表列表 */
    getFList() {
      return new Promise((resolve,reject) => {
        let params = {
          pageNum: 1,
          pageSize: 99999,
          trainingId: this.trainingId,
          userId: this.userId
        };
        this.loading = true;
        listForm(params).then(response => {
          let formList = response.rows;
          if (formList[0]) {
            this.practiceSignupInfo = formList[0];

            this.setPdfGroupItemToP('practiceStudyPlan')
            this.setPdfGroupItemToP('practiceRecord')
          } else {
            this.practiceSignupInfo = {};
          }
          this.loading = false;
          resolve();
        });
      })
    },
    // 专家点评意见
    getListDiagnosis() {
      let params = {
        pageNum: 1,
        pageSize: 99999,
        trainingId: this.trainingId,
        userId: this.userId
      };
      this.loading = true;
      listDiagnosis(params).then(res => {
        if (res.rows.length) {
          this.diagnosis = res.rows[0];
        } else {
          this.diagnosis = {};
        }
        this.loading = false;
      });
    },

    /** 查询企业实践教师信息报名证书信息列表 */
    getCList() {
      return new Promise((resolve,reject) => {
        this.loading = true;
        let params = {
          pageNum: 1,
          pageSize: 99999,
          trainingId: this.trainingId,
          userId: this.userId
        };
        listCertificate(params).then(response => {
          this.certificateList = response.rows;
          this.loading = false;
          resolve();
        });
      })
    },
    handleView(row) {
      window.open(this.baseUrl + row.certificatePath, '_blank');
    }
  }
};
</script>

<style>
.manual .el-table .cell{
  font-size: 18px;
}
</style>

<style scoped lang="scss">
.cover {
  width: 100%;
  height: 1123px;
  // border: 1px solid #e8eaec;
  text-align: center;
  line-height: 1;
  padding: 400px 60px 0 140px;
}
.app-container {
  // position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: auto;
  padding: 0;
}
.card-wrapper {
  width: 100%;
  margin: 0 auto;
  // border: 1px solid #e8eaec;
}
.icon {
  margin-right: 6px;
}
h3 {
  text-align: center;
  margin: 26px 0;
  font-size: 26px;
  color: #333;
}
.card__header {
  height: 40px;
  line-height: 40px;
  padding-left: 12px;
}
.box-card {
  padding-bottom: 20px;
  border: none;
  box-shadow: none;
  background: #fff;
}

.title {
  font-size: 20px;
  color: #333;
  font-weight: 700;
  text-align: left;
  margin-bottom: 16px;
}
.p_style {
  font-size: 20px;
  color: #333;
  font-weight: 700;
  text-align: center;
  margin-bottom: 16px;
}

.info-wrapper {
  line-height: 1.5;
  padding: 0 24px;
}
.j-card {
  margin-bottom: -8px;
  border: none;
  padding: 16px;
}
.j-card-line {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-bottom: 8px;
}
.j-card-item {
  display: flex;
}

.c-li {
  border-bottom: 1px solid #dcdfe6;
  padding: 4px 0;
}
.c-item {
  margin-right: 12px;
}

.label {
  flex-shrink: 0;
  color: #000;
}

.proj-info-wrapper {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}
.proj-item:nth-child(2n + 1) {
  border-right: 1px solid #dcdfe6;
}
.proj-item {
  border-top: 1px solid #dcdfe6;
}
.proj-item-top {
  .item-proj {
    display: flex;
    justify-content: flex-start;
  }
}

.upload-file-list {
  margin: 0;
  padding: 0;
  list-style: none;
  .upload-list__item {
    border: 1px solid #e4e7ed;
    line-height: 2;
    margin-bottom: 10px;
    position: relative;
    color: inherit;
    padding: 6px;
    line-height: 1;

    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    padding: 6px;
    border-radius: 4px;
  }
}

/* 火狐美化滚动条 */
* {
  scrollbar-color: #c8d2e0 #f3f4f9;
  /* 滑块颜色 滚动条背景颜色 */
  scrollbar-width: thin;
  /* 滚动条宽度有三种：thin、auto、none */
}

::-webkit-scrollbar-track-piece {
  background-color: #fff;
  /*滚动条的背景颜色*/
  border-radius: 0;
  -webkit-border-radius: 0;
  /*滚动条的圆角宽度*/
}

::-webkit-scrollbar-track-piece {
  background-color: #fff;
  /*滚动条的背景颜色*/
  border-radius: 0;
  -webkit-border-radius: 0;
  /*滚动条的圆角宽度*/
}

div::-webkit-scrollbar {
  width: 8px;
  /*滚动条的宽度*/
  height: 8px;
  /*滚动条的高度*/
}

::-webkit-scrollbar-thumb:vertical {
  /*垂直滚动条的样式*/
  height: 50px;
  background-color: #999;
  border-radius: 4px;
  -webkit-border-radius: 4px;
  outline: 2px solid #fff;
  outline-offset: -2px;
  border: 2px solid #fff;
}

::-webkit-scrollbar-thumb:hover {
  /*滚动条的hover样式*/
  height: 50px;
  background-color: #9f9f9f;
  border-radius: 4px;
  -webkit-border-radius: 4px;
}

::-webkit-scrollbar-thumb:horizontal {
  /*水平滚动条的样式*/
  width: 5px;
  background-color: #cccccc;
  border-radius: 6px;
  -webkit-border-radius: 6px;
}

table {
  width: 100%;
  border-collapse: collapse;
  thead {
    background-color: #f8f8f9;
    color: #515a6e;
  }
  td, th {
    border: 1px solid #dcdee2;
    height: 38px;
    padding-left: 10px;
    padding-right: 10px;
  }
}

.section_area {
  position: relative;

  .section_line {
    display: flex;
    justify-content: space-between;
    overflow: hidden;

    .section_type {
      width: 170px;
      flex-shrink: 0;
      text-align: right;
      font-weight: 600;
      color: #404040;
    }
    .section_item {
      display: flex;
      flex-wrap: wrap;
      color: #404040;
    }
  }
}
</style>
