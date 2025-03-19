<template>
  <div class="container">
    <div class="content-wrapper clearfix">
      <div class="left-wrapper">
        <div style="padding: 16px">
          <MyTree
            ref="MyTreeRef"
            :data="sortTreeData"
            :curNode="currentData"
            :renderNodeTextCustom="renderNodeTextCustom"
            :renderOperBtn="renderOperBtn"
            :draggable="true"
            notClickLevel="0"
            :canSelectNode="canSelectNode"
            @clickTreeNode="clickTreeNode"
            @getTreeList="getSortTree"
          ></MyTree>
        </div>
      </div>
      <div class="right-wrapper">
        {{ currentData.id }}
      </div>
    </div>
  </div>
</template>

<script>
  import { list } from './data.js';

  import MyTree from './MyTree.vue';
  export default {
    name: '',
    components: { MyTree },
    data() {
      return {
        sortTreeData: [],
        currentRoot: null,
        currentNode: null,
        currentData: '',

        canSelectNode: '',
      };
    },
    created() {},
    mounted() {
      this.getSortTree();
    },
    watch: {},
    computed: {},
    methods: {
      renderOperBtn(h, data) {
        let temp = h(
          'span',
          {
            attrs: { class: 'mouse_hover' },
            style: {
              display: this.currentData.id == data.id ? 'inline-block' : 'none',
              position: 'absolute',
              top: '0px',
              right: '15px',
            },
          },
          [
            h('Button', {
              attrs: { title: '录入子节点' },
              props: Object.assign({}, this.buttonProps, { icon: 'ios-add' }),
              style: { marginRight: '8px', width: '20px', height: '20px', fontSize: '12px' },
              on: {
                click: (e) => {
                  e.stopPropagation();
                  this.dataId = '';
                  this.appendTreeNode(data);
                },
              },
            }),
            h('Button', {
              props: Object.assign({}, this.buttonProps, { icon: 'ios-create', title: '编辑' }),
              style: { marginRight: '8px', width: '20px', height: '20px', fontSize: '12px' },
              on: {
                click: (e) => {
                  e.stopPropagation();
                  this.dataId = data.id;
                  this.$set(data, 'isUpdate', true);
                  this.inputFocus();
                },
              },
            }),
            h('Button', {
              props: Object.assign({}, this.buttonProps, { icon: 'ios-trash', title: '删除' }),
              style: { marginRight: '8px', width: '20px', height: '20px', fontSize: '12px', color: '#ed4014' },
              on: {
                click: (e) => {
                  e.stopPropagation();
                  this.deleteTreeNode(data);
                },
              },
            }),
          ],
        );
        return temp;
      },
      renderNodeTextCustom(h, data) {
        return h('span', [
          h('span', [
            h('Icon', {
              props: {
                type: !data.sortType || data.sortType === 'T01' || data.sortType == 'T02' ? 'ios-folder-open' : data.taskStatus == 'S02' ? 'md-checkmark' : 'ios-paper-outline',
              },
              style: {
                marginRight: '8px',
              },
            }),
            data.sortType &&
              data.sortType != 'T04' &&
              h(
                'Tag',
                {
                  props: {
                    color: data.sortType == 'T02' ? 'primary' : data.sortType == 'T03' ? 'warning' : '',
                  },
                  attrs: {
                    'data-tag': 'tree-node-tag',
                  },
                  style: {
                    display: 'inline-block',
                    cursor: 'pointer',
                    marginLeft: '0px',
                    position: 'static',
                    transform: 'none',
                    padding: '0 2px',
                  },
                },
                '',
              ),
            h(
              'span',
              {
                attrs: {
                  title: data.nodeName,
                  class: 'tree-node-name',
                },
              },
              [h('span', data.nodeName)],
            ),
          ]),
        ]);
      },
      clickTreeNode({ root, node, data }) {
        this.currentRoot = root;
        this.currentNode = node;
        this.currentData = data;
      },
      updateTreeNode(data, value) {},
      appendTreeNode(data) {},
      deleteTreeNode(data) {},

      inputFocus() {
        this.$nextTick(() => {
          let input = this.$refs['MyTreeRef'].$refs['input'].$refs['input']; // 获取iview 的INPUT组件中的原生input
          let val = input.value;
          input.focus();
          console.log(input);
          if (val.length) {
            input.setSelectionRange(0, val.length); // 选中文字
          }
        });
      },
      parseTreeData(treeDate) {
        let flag = true;
        this.parseTreeJsonMyTree(
          treeDate,
          (item) => {
            this.$set(item, 'clickTime', new Date().getTime()); // 记录点击时间 处理点击自身不会去请求环节数据的问题
            this.$set(item, 'selected', false);
            this.$set(item, 'isUpdate', false); // 是否渲染修改时的输入框
            this.$set(item, 'expand', false); // 全部展开
            if (flag) {
              this.$set(item, 'expand', true);
            }
            if (!item.children && flag) {
              // 定位到第一个活动上
              this.currentData = item;
              flag = false;
            }

            if (!this.lastReviewList && item.tkProcessDetails) {
              this.lastReviewList = item.tkProcessDetails;
            }
          },
          0,
        );
        if (this.isEffect == 'Y') {
          this.hasisEffect = true;
        }
        if (!this.treeDataTemp || this.treeDataTemp.length === 0) {
          this.treeDataTemp = this.flatten(treeDate);
          // 初次进入界面 备份 用于在新增时判断新增的数据时哪一条 或者搜索操作后
          if (this.isAppend && this.treeDataTemp.length === 1) {
            // this.$set(this.currentData, "isUpdate", true); // 第一次新增时的输入框
            // this.inputFocus();
          }
        } else {
          if (!this.dataId) {
            // 新增操作 所选数据定位到新增的那一项 并将INPUT框打开以及自动聚焦
            this.parseTreeJsonMyTree(treeDate, (item) => {
              let index = this.treeDataTemp.findIndex((t) => t.id === item.id);
              if (index === -1) {
                this.currentData = item;
                // this.$set(this.currentData, "isUpdate", true); // 是否渲染修改时的输入框
                // this.inputFocus();
              }
            });
          } else {
            // 修改操作 修改完成后 所选数据定位到修改的那一项
            this.parseTreeJsonMyTree(treeDate, (item) => {
              if (item.id === this.dataId) {
                this.currentData = item;
              }
            });
          }
          this.treeDataTemp = this.flatten(treeDate);
        }
        sessionStorage.setItem('currentData', JSON.stringify(this.currentData));
      },
      // 遍历树形结构数据 用于遍历章节目录
      parseTreeJsonMyTree(treeNodes, callback, level = 0) {
        if (!treeNodes || !treeNodes.length) return;
        for (let i = 0; i < treeNodes.length; i++) {
          this.$set(treeNodes[i], '_showChildren', true);
          this.$set(treeNodes[i], 'disabled', true);
          callback(treeNodes[i], i);
          if (typeof level == 'number') this.$set(treeNodes[i], 'level', level);
          let _children = treeNodes[i].children;
          if (_children && _children.length > 0) {
            this.parseTreeJsonMyTree(_children, callback, level + 1);
          }
        }
      },
      flatten(arr) {
        if (!arr || !Array.isArray(arr)) return false;
        let result = [];
        for (let i = 0; i < arr.length; i++) {
          if (Array.isArray(arr[i].children)) {
            result.push(arr[i]);
            result = result.concat(this.flatten(arr[i].children));
          } else {
            result.push(arr[i]);
          }
        }
        return result;
      },

      // 获取左侧树结构的数据
      getSortTree() {
        this.sortTreeData = list;
        this.parseTreeData(this.sortTreeData);

        // if (this.sortTreeData.length < 1) {
        // } else {
        //   //保留渲染节点状态并添加新增节点
        //   this.loadTreeData(this.sortTreeData, list);
        //   this.sortTreeData = list;
        // }
      },
      loadTreeData(oldData, newData) {
        let oldChilds = [];
        let newChilds = [];
        oldData.forEach((o) => {
          oldChilds = o.children;
          newData.forEach((oo) => {
            if (oo.id == o.id) {
              newChilds = oo.children;
              oo.expand = o.expand;
              if (oldChilds && oldChilds.length > 0 && newChilds && newChilds.length > 0) {
                this.loadTreeData(oldChilds, newChilds);
              }
              newChilds = [];
            }
          });
        });
      },
    },
  };
</script>

<style scoped lang="less">
  .content-wrapper {
    width: 100%;
    position: relative;
    overflow: hidden;

    .left-wrapper {
      float: left;
      width: 350px;
      margin-right: 16px;
      background: #fff;
      overflow: hidden;
    }
    .right-wrapper {
      float: right;
      width: calc(~'100% - 366px');
      min-height: 300px;
      box-sizing: border-box;
      overflow: auto;
      padding: 16px;
      background: #fff;

      &.fixed {
        position: fixed;
        top: 57px;
        left: 382px;
        z-index: 9;
        width: calc(~'100% - 405px');
      }
    }
  }

  .clearfix:after {
    visibility: hidden;
    display: block;
    font-size: 0;
    content: ' ';
    clear: both;
    height: 0;
  }
</style>
