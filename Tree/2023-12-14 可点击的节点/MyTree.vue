<template>
  <Tree class="demo-tree-render catalogs-tree" ref="tree" :data="treeData" :render="renderContent"></Tree>
</template>

<script>
  export default {
    name: '',
    components: {},
    props: {
      value: {
        type: [Date, String, Number, Object],
      },
      data: {
        type: Array,
        default: () => [],
      },
      hasOperBtn: {
        type: Boolean,
        default: true,
      },
      renderOperBtn: Function, // 渲染按钮的方法函数
      dataId: [String, Number], // 用于判断操作类型是新增还是修改，用于选中效果的定位
      curData: {
        type: [String, Object],
        default: () => {
          return {};
        },
      },
      renderNodeTextCustom: Function, // 渲染节点名称的方法函数

      // 不可点击的层级
      notClickLevel: {
        type: [String, Number],
        default: -1,
      },
      canSelectNode: {
        type: [Array, String],
        default: '',
      },
    },
    model: {
      prop: 'value',
      event: 'valueUpdate',
    },
    data() {
      return {
        baseClass: ['tree-title ivu-tree-title'],
        currentRoot: '',
        currentNode: '',
        currentData: '',
        treeData: this.data,
        treeDataTemp: [],
        e: '',
      };
    },
    created() {},
    mounted() {},
    watch: {
      data: {
        handler(val) {
          this.resetSelectedClass(); // 赋值tree的数据，在赋值之前先将tree中的选中状态去掉
          this.treeData = val;

          // 这一部分放在这里会导致出现curChapter获取错误，所有放到父级获取treeData的方法里
          // this.treeData = this.deepClone(val, []);
          // let flag = true;
          // this.parseTreeJson(
          //   this.treeData,
          //   (item) => {
          //     this.$set(item, 'clickTime', new Date().getTime()); // 记录点击时间 处理点击自身不会去请求环节数据的问题
          //     this.$set(item, 'selected', false);
          //     this.$set(item, 'isUpdate', false); // 是否渲染修改时的输入框
          //     this.$set(item, 'expand', true); // 全部展开
          //     if (!item.children && flag) {
          //       // 定位到第一个活动上
          //       this.curData = item;
          //       flag = false;
          //     }
          //   },
          //   0,
          // );
          // if (this.treeDataTemp.length === 0) {
          //   this.treeDataTemp = this.flatten(this.treeData);
          //   // 初次进入界面 备份 用于在新增时判断新增的数据时哪一条 或者搜索操作后
          //   if (this.isAppend && this.treeDataTemp.length === 1) {
          //     // this.$set(this.curData, "isUpdate", true); // 第一次新增时的输入框
          //     // this.inputFocus();
          //   }
          // } else {
          //   if (!this.dataId) {
          //     // 新增操作 所选数据定位到新增的那一项 并将INPUT框打开以及自动聚焦
          //     this.parseTreeJson(this.treeData, (item) => {
          //       let index = this.treeDataTemp.findIndex((t) => t.id === item.id);
          //       if (index === -1) {
          //         this.curData = item;
          //         // this.$set(this.curData, "isUpdate", true); // 是否渲染修改时的输入框
          //         // this.inputFocus();
          //       }
          //     });
          //   } else {
          //     // 修改操作 修改完成后 所选数据定位到修改的那一项
          //     this.parseTreeJson(this.treeData, (item) => {
          //       if (item.id === this.dataId) {
          //         this.curData = item;
          //       }
          //     });
          //   }
          //   this.treeDataTemp = this.flatten(this.treeData);
          // }
          // console.log('重复/.....');
          // this.$set(this.curData, 'selected', true);
          // this.$emit('setCurChapter', this.curData);
        },
        deep: true,
      },
      '$store.state.richTextIdSaved': {
        handler(val) {
          console.log(val);
          if (val) {
            let root = this.currentRoot;
            let node = this.currentNode;
            let data = this.currentData;
            this.clickTreeNode(this.e, { root, node, data });
          }
        },
        deep: true,
      },
    },
    computed: {},
    methods: {
      renderContent(h, { root, node, data }) {
        return h(
          'span',
          {
            attrs: {
              'data-id': data.id,
              class: data.selected || data.id == this.curData.id ? `${this.baseClass}  ivu-tree-title-selected` : this.baseClass, // data.id == this.curData.id 用于判断第二次点击时选中效果是否要存在
            },
            on: {
              click: (e) => {
                if (data.level == this.notClickLevel) return; // 判断某一层级是否允许点击，所以查看时不需要可点击

                if (this.canSelectNode && this.canSelectNode.length != 0 && !this.canSelectNode.includes(data.id)) return; // 判断当前节点是否可点击

                this.currentRoot = root;
                this.currentNode = node;
                this.currentData = data;
                this.resetTreeData(data);
                this.clickTreeNode(e.currentTarget, { root, node, data });
                // this.$set(data, 'expand', !data.expand);
              },
            },
          },
          [
            data.isUpdate ? this.renderInput(h, data) : this.renderNodeText(h, data),
            this.hasOperBtn && h('span', { style: { display: data.isUpdate ? 'none' : 'inline' } }, [this.renderOperBtn(h, data)]),
          ],
        );
      },
      clickTreeNode(e, { root, node, data }) {
        this.e = e;
        // this.$emit('saveResourceV2');
        // let oldHtml = this.$store.state.oldHtml && this.$store.state.oldHtml != '<p><br></p>' ? this.$store.state.oldHtml : "";
        // let newHtml = this.$store.state.newHtml && this.$store.state.newHtml != '<p><br></p>' ? this.$store.state.newHtml : "";
        // // console.log('oldHtml', oldHtml);
        // // console.log('newHtml', newHtml);
        // if (oldHtml != newHtml) {
        // 	this.$store.commit('setRichTextIdSaved', false);
        //   let flag = confirm(`内容发生改变？是否需要保存内容`);
        //   if (flag) {
        //     this.$emit('saveResourceV2');
        //     return;
        //   }
        // }
        this.resetSelectedClass();
        if (e) {
          e.className = `${this.baseClass} ivu-tree-title-selected`;
        }
        this.$emit('clickTreeNode', { root, node, data });
      },
      setTreeIcon(data) {
        if (data.level == 0) {
          return 'ios-folder-open';
        } else {
          return 'ios-paper-outline';
        }
      },
      resetTreeData(data) {
        this.parseTreeJson(this.data, (item) => {
          if (item.id != data.id) {
            // this.$set(item, 'selected', false);
            this.$set(item, 'isUpdate', false);
          }
        });
      },
      resetSelectedClass() {
        let selected = this.$refs['tree'].$el.querySelectorAll('.ivu-tree-title-selected');
        for (let i = 0; i < selected.length; i++) {
          console.log(selected[i].getAttribute('data-id'));
          if (this.currentData.id != selected[i].getAttribute('data-id')) {
            // 只有当data-id不和当前选中项的id不一致时，执行class重置。处理当修改项是当前选择项，修改完成后，所选中状态会消失的问题】
            selected[i].className = this.baseClass;
          }
        }
      },

      // 渲染节点名称的方法函数
      renderNodeText(h, data) {
        // 如果从父组件中传递了渲染节点名称的方法，则使用传进来的方法
        if (this.renderNodeTextCustom) {
          return this.renderNodeTextCustom(h, data);
        }
        return h('span', [
          h('Icon', {
            props: { type: data.level == 0 ? 'ios-folder-open' : 'ios-paper-outline' },
            style: { marginRight: '8px' },
          }),
          h('span', { attrs: { title: data.chapterName }, style: { height: '24px' } }, data.chapterName),
        ]);
      },
      renderInput(h, data) {
        let temp = this.$createElement('Input', {
          ref: 'input', // this.$createElement
          style: { width: 'auto' },
          props: {
            value: data.chapterName,
            maxlength: 50,
          },
          nativeOn: {
            click: (e) => {
              e.stopPropagation();
            },
          },
          on: {
            'on-enter': (e) => {
              e.target.blur();
            },
            'on-blur': (e) => {
              this.$set(data, 'isUpdate', false);
              this.$emit('updateTreeNode', data, e.target.value);
            },
          },
        });
        return temp;
      },
      inputFocus() {
        this.$nextTick(() => {
          let input = this.$refs['input'].$refs['input']; // 获取iview 的INPUT组件中的原生input
          let val = input.value;
          input.focus();
          if (val.length) {
            input.setSelectionRange(0, val.length); // 选中文字
          }
        });
      },
      // 渲染操作按钮，提取到父组件
      // renderOperBtn(h, data) {
      //   let temp = h(
      //     'span',
      //     {
      //       attrs: { class: 'mouse_hover' },
      //       style: { display: 'none', position: 'absolute', top: '0px', right: '10px' },
      //     },
      //     [
      //       this.checkAuth(['KCJA_ADD_CHAPTER']) &&
      //         data.level == 0 && // 仅可创建二级目录
      //         h('Button', {
      //           props: Object.assign({}, this.buttonProps, { icon: 'ios-add' }),
      //           style: { marginRight: '8px', width: '20px', height: '20px', fontSize: '12px' },
      //           on: {
      //             click: (e) => {
      //               // 增加子级
      //               e.stopPropagation();
      //               this.dataId = '';
      //               this.$emit('appendTreeNode', data);
      //             },
      //           },
      //         }),
      //       this.checkAuth(['KCJA_DELETE_CHAPTER']) &&
      //         h('Button', {
      //           props: Object.assign({}, this.buttonProps, { icon: 'ios-remove' }),
      //           style: { marginRight: '8px', width: '20px', height: '20px', fontSize: '12px' },
      //           on: {
      //             click: (e) => {
      //               // 删除
      //               e.stopPropagation();
      //               this.$emit('deleteTreeNode', data);
      //             },
      //           },
      //         }),
      //       this.checkAuth(['KCJA_UPATE_CHAPTER']) &&
      //         h('Button', {
      //           props: Object.assign({}, this.buttonProps, { icon: 'ios-create' }),
      //           style: { marginRight: '8px', width: '20px', height: '20px', fontSize: '12px' },
      //           on: {
      //             click: (e) => {
      //               e.stopPropagation();
      //               this.dataId = data.id;
      //               this.$set(data, 'isUpdate', true);
      //               this.inputFocus();
      //             },
      //           },
      //         }),
      //     ],
      //   );
      //   return temp;
      // },
      // 遍历树形结构数据
      parseTreeJson(treeNodes, callback = () => {}, level = 0) {
        if (!treeNodes || !treeNodes.length) return;
        for (let i = 0; i < treeNodes.length; i++) {
          callback(treeNodes[i], i);
          if (typeof level == 'number') this.$set(treeNodes[i], 'level', level);
          let _children = treeNodes[i].children;
          if (_children && _children.length > 0) {
            this.parseTreeJson(_children, callback, level + 1);
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
      // 深拷贝
      deepClone(origin, target) {
        let newTarget = target || [];
        // 1.遍历对象
        for (let prop in origin) {
          // 2.判断是否为引用值
          if (origin[prop] !== 'null' && typeof origin[prop] == 'object') {
            // 3.判断引用值是数组还是对象
            // 4.建立新的数组或对象
            newTarget[prop] = Object.prototype.toString.call(origin[prop]) == '[object Array]' ? [] : {};
            // 5.递归调用，实现多层拷贝
            this.deepClone(origin[prop], newTarget[prop]);
          } else {
            newTarget[prop] = origin[prop];
          }
        }
        return newTarget;
      },
    },
  };
</script>

<style scoped>
  .catalogs-tree {
    padding-top: 12px;
  }
</style>

<style>
  .catalogs-tree .ivu-tree-arrow {
    line-height: 32px;
  }
  .catalogs-tree .ivu-tree-title {
    width: 100%;
    padding: 0;
  }
  .catalogs-tree .tree-title-hover {
    position: absolute;
    top: 0px;
    right: 10px;
    visibility: hidden;
  }
  .catalogs-tree .tree-title:hover .tree-title-hover {
    visibility: visible;
  }
  .catalogs-tree.ivu-tree ul li {
    line-height: 24px;
  }
  .catalogs-tree .tree-title {
    display: inline-block;
    width: 100%;
    position: relative;
    height: 32px;
    line-height: 32px;
    padding: 0 4px;
  }

  .catalogs-tree .tree-title:hover .mouse_hover {
    display: inline-block !important;
  }
</style>
