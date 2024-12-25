<template>
  <Card style="width: 100%">
    <template #title>
      <Icon type="md-settings" />
      审核人设置
    </template>

    <div class="audit-level">
      <!-- <Select filterable clearable class="myselect" style="width: 240px" @on-open-change="handleVisibleChange">
        <Option :value="item.id" :key="item.id" v-for="item in visibleItems">{{ item.xm }}</Option>
        <div class="virtual-list-content" slot="list" :style="{ transform: `translateY(${offsetY}px)` }">
        </div>
      </Select> -->
      <Form :model="form" :rules="rules" ref="form" :label-width="160" @submit.native.prevent>
        <template v-for="(item, index) in form.processList">
          <FormItem
            :label="`${item.reviewNode}：`"
            :prop="'processList.' + index + '.verifyUser'"
            :key="index"
            v-if="true"
            :rules="{ required: true, message: '请选择' + item.reviewNode + '的审核人', trigger: 'change', type: 'number' }"
          >
            <template v-if="item.auditType == 2">
              <Select v-model="item.verifyUser" filterable clearable style="width: 240px" :class="'myselect_' + index" @on-open-change="handleVisibleChange($event, index)">
                <Option :value="item.id" :key="item.id" v-for="item in visibleItems">{{ item.xm }}</Option>
              </Select>
            </template>
            <template v-else>
              {{ item.reviewerName }}
            </template>
          </FormItem>
          <div class="arrow" :key="index" v-if="true"></div>
        </template>
        <div style="text-align: center">结束</div>
      </Form>
    </div>
  </Card>
</template>
<script>
  import { list } from '../data.js';

  export default {
    name: 'auditLevelAssigner', // 审核层级分配 用户在提交审核时可以设置不同审核层级的审核人员
    components: {},
    props: {
      form: {
        type: Object,
        default: () => {
          return {};
        },
      },
      // auditType 0：全院 1：指定院系 2：提交人自选审核人
      processList: {
        type: [Array],
        default: () => [],
      },
    },
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
        // form: {},
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

        teacherList: [],
        totalTeacherList: 0,

        //虚拟滚动相关变量
        scrollTop: 0,
        itemHeight: 33,
      };
    },
    created() {
      this.loading = false;
    },
    mounted() {
      this.reset();
      this.getTeacherList();
    },
    watch: {},
    computed: {
      // 获取要截取数组的起始索引，这里的30是每一项的高度，也就是已知的，可根据实际情况设置。
      startIndex() {
        return Math.floor(this.scrollTop / this.itemHeight);
      },
      //截取数组
      visibleItems() {
        // 200是可视区域的高度
        const endIndex = Math.min(this.startIndex + Math.ceil(200 / this.itemHeight), this.totalTeacherList);
        return this.teacherList.slice(this.startIndex, endIndex);
      },
      offsetY() {
        return this.startIndex * this.itemHeight;
      },
    },
    methods: {
      handleVisibleChange(visible, index) {
        this.selectIndex = index;
        if (visible) {
          const ivuSelectDropdown = document.querySelector(`.myselect_${index} .ivu-select-dropdown`);

          let scrollBar = document.querySelector(`.myselect_${index} .scroll-bar`);
          if (!scrollBar) {
            scrollBar = document.createElement('div');
            scrollBar.className = 'scroll-bar';
            //计算总的数据需要的高度，构造滚动条高度
            let totalHeight = this.itemHeight * this.teacherList.length + 'px';
            scrollBar.style.height = totalHeight;
            scrollBar.scrollTop = 0;

            ivuSelectDropdown.insertBefore(scrollBar, ivuSelectDropdown.firstChild);
          }

          console.log(scrollBar.scrollTop);
          this.scrollTop = 0;
          // 计算回显时滚动的位置
          if (this.form.processList[index].verifyUser) {
            let startIndex = this.teacherList.findIndex((item) => item.id == this.form.processList[index].verifyUser);
            let scrollTop = startIndex * this.itemHeight;
            scrollBar.scrollTop = scrollTop;
            this.$set(this, 'scrollTop', scrollTop);
          }

          const ivuSelectDropdownList = document.querySelector(`.myselect_${index} .ivu-select-dropdown-list`);
          ivuSelectDropdownList.style.position = 'absolute';
          ivuSelectDropdownList.style.top = 0;
          ivuSelectDropdownList.style.left = 0;

          ivuSelectDropdownList.style.top = this.startIndex * this.itemHeight + 'px';

          // 添加滚动事件监听
          const dropdown = document.querySelector(`.myselect_${index} .ivu-select-dropdown`);
          dropdown.addEventListener('scroll', this.debounce(this.handleScroll, 10));
        } else {
          // 移除滚动事件监听
          const dropdown = document.querySelector(`.myselect_${index} .ivu-select-dropdown`);
          dropdown.removeEventListener('scroll', this.debounce(this.handleScroll, 10));
        }
      },
      handleScroll() {
        //获取滚动高度
        const dropdown = document.querySelector(`.myselect_${this.selectIndex} .ivu-select-dropdown`);
        this.$set(this, 'scrollTop', dropdown.scrollTop);

        const ivuSelectDropdownList = document.querySelector(`.myselect_${this.selectIndex} .ivu-select-dropdown-list`);
        ivuSelectDropdownList.style.top = this.startIndex * this.itemHeight + 'px';
      },
      //防抖函数，由于滚动一次滑轮会触发多次scroll事件，需要控制一下触发的次数。
      debounce(func, delay) {
        let timeout;
        return function (...args) {
          const context = this;
          clearTimeout(timeout);
          timeout = setTimeout(() => func.apply(context, args), delay);
        };
      },

      changePage(i) {
        this.queryParams.pageNum = i;
        this.getList();
      },

      getTeacherList() {
        this.teacherList = list;
        this.totalTeacherList = list.length;
        // let params = {
        //   pageNum: 1,
        //   pageSize: 10000,
        // };
        // this.loading = true;
        // this.axios
        //   .post(this.interfaceUrl + '/teacher/selectAllByPage', this.qs(params))
        //   .then((res) => {
        //     if (res.data.state) {
        //       if (res.data.teacherList) {
        //         this.teacherList = res.data.teacherList;
        //       } else {
        //         this.teacherList = [];
        //       }
        //       this.totalTeacherList = res.data.dataCount;
        //     } else {
        //       this.$Message.error(`${res.data.msg}`);
        //     }
        //     this.loading = false;
        //   })
        //   .catch((e) => {
        //     this.loading = false;
        //     console.error(e);
        //     this.$Message.error(e.message);
        //   });
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
        let processList = [];
        this.processList.forEach((item) => {
          let data = JSON.parse(JSON.stringify(item));
          data.verifyUser = '';
          processList.push(data);
        });
        this.$set(this.form, 'processList', processList);
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
<style scoped lang="less">
  .audit-level {
    display: inline-block;
  }
  .arrow {
    margin: 0 auto;
    width: 2px;
    height: 18px;
    background: #e8eaec;
    margin-bottom: 18px;
    position: relative;

    &::before {
      content: '';
      display: inline-block;
      position: absolute;
      top: 50%;
      left: 0;
      transform: translateX(3px) rotate(45deg);
      width: 2px;
      height: 10px;
      background-color: #e8eaec;
    }
    &::after {
      content: '';
      display: inline-block;
      position: absolute;
      top: 50%;
      left: 0;
      transform: translateX(-3px) rotate(-45deg);
      width: 2px;
      height: 10px;
      background-color: #e8eaec;
    }
  }
</style>
