<template>
  <Tree
    class="demo-tree-render catalogs-tree"
    ref="tree"
    :data="treeData"
    :render="renderContent"
  ></Tree>
</template>

<script>
export default {
  name: "",
  components: {},
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    moreOper: {
      // 更多的操作，用于控制下拉菜单的渲染, 在复制到中的有使用到
      type: Boolean,
      default: true,
    },
    curChapterId: {
      // 当前点击项的id
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      baseClass: ["tree-title ivu-tree-title"],
      currentRoot: "",
      currentNode: "",
      currentData: "",
      treeData: [],
    };
  },
  created() {},
  mounted() {},
  watch: {
    data: {
      handler(val, oldVal) {
        this.resetSelectedClass(); // 赋值tree的数据，在赋值之前先将tree中的选中状态去掉
        this.treeData = val;
      },
    },
  },
  computed: {},
  methods: {
    renderContent(h, { root, node, data }) {
      if (data.selected) {
        this.currentRoot = root;
        this.currentNode = node;
        this.currentData = data;
      }
      return h(
        "span",
        {
          attrs: {
            "data-id": data.id,
            class: data.selected
              ? `${this.baseClass}  ivu-tree-title-selected`
              : this.baseClass,
          },

          on: {
            click: (e) => {
              this.resetTreeDataSelected(data);
              this.resetTreeDataIsUpdate(data);
              this.clickTreeNode(e.currentTarget, data);
              this.currentRoot = root;
              this.currentNode = node;
              this.currentData = data;
              this.$set(data, "expand", !data.expand);
              this.$emit("clickTreeNode", data);
            },
          },
        },
        [
          data.isUpdate
            ? this.renderInput(h, data)
            : h("span", [
                h("Icon", {
                  props: {
                    type: this.setTreeIcon(data.chapterType),
                  },
                  style: {
                    marginRight: "8px",
                  },
                }),
                h(
                  "span",
                  {
                    style: {
                      height: "24px",
                    },
                  },
                  data.chapterName
                ),
              ]),
          this.moreOper &&
            h(
              "span",
              {
                attrs: {
                  class: "tree-title-hover",
                },
              },
              [this.renderDropdown(h, data)]
            ),
        ]
      );
    },
    setTreeIcon(chapterType) {
      if (chapterType == "T01") {
        return "md-folder";
      } else if (chapterType == "T02") {
        return "md-paper";
      } else if (chapterType == "T03") {
        return "md-stats";
      }
    },
    resetTreeDataSelected(data) {
      this.parseTreeJson(this.data, (item) => {
        this.$set(item, "selected", false);
      });
    },
    resetTreeDataIsUpdate(data) {
      this.parseTreeJson(this.data, (item) => {
        if (item.id != data.id) {
          this.$set(item, "isUpdate", false);
        }
      });
    },
    resetSelectedClass() {
      let selected = this.$refs["tree"].$el.querySelectorAll(
        ".ivu-tree-title-selected"
      );
      for (let i = 0; i < selected.length; i++) {
        if (this.curChapterId != selected[i].getAttribute("data-id")) {
          // 只有当data-id不和当前选中项的id不一致时，执行class重置。处理当修改项是当前选择项，修改完成后，所选中状态会消失的问题】
          selected[i].className = this.baseClass;
        }
      }
    },
    clickTreeNode(e, data) {
      this.resetSelectedClass();
      if (e) {
        e.className = `${this.baseClass}  ivu-tree-title-selected`;
      }
    },
    renderDropdown(h, data) {
      let temp = h(
        "div",
        {
          style: {
            position: "relative",
          },
          on: {
            click: (e) => {
              e.stopPropagation();
            },
          },
        },
        [
          h(
            "Dropdown",
            {
              props: {
                icon: "md-more",
                trigger: "hover",
                placement: "right-end",
                transfer: true,
                "transfer-class-name": "my-dropdown",
              },
              style: {
                marginRight: "8px",
              },
              on: {
                "on-click": (name) => {
                  this.resetTreeDataIsUpdate(data);
                  if (name === "T01") {
                    this.$emit("appendTreeNode", data.id, name);
                  } else if (name === "T02") {
                    this.$emit("appendTreeNode", data.id, name);
                  } else if (name === "T03") {
                    this.$emit("appendTreeNode", data.id, name);
                  } else if (name === "T04") {
                    this.$set(data, "isUpdate", true);
                    this.inputFocus();
                  } else if (name === "T05") {
                    this.$Modal.confirm({
                      closable: true,
                      title: "提示",
                      content: "确定删除所选教学内容吗？",
                      onOk: () => {
                        this.$emit("removeTreeNode", data.id);
                      },
                    });
                  } else if (name == "T06") {
                    this.$emit("on-copy", data);
                  }
                },
              },
            },
            [
              h("Button", {
                props: Object.assign({}, this.buttonProps, {
                  icon: "md-more",
                }),
                style: {
                  marginRight: "8px",
                  width: "24px",
                  height: "24px",
                },
              }),

              h(
                "DropdownMenu",
                {
                  slot: "list",
                },
                [
                  data.chapterType === "T01" &&
                    h("div", [
                      data.level < 2 &&
                        h(
                          "DropdownItem",
                          { props: { name: "T01" } },
                          "新建文件夹"
                        ),
                      h(
                        "DropdownItem",
                        { props: { name: "T02" } },
                        "新建线上活动"
                      ),
                      h(
                        "DropdownItem",
                        { props: { name: "T03" } },
                        "新建课堂活动"
                      ),
                    ]),
                  h("DropdownItem", { props: { name: "T04" } }, "修改"),
                  h("DropdownItem", { props: { name: "T05" } }, "删除"),
                  data.chapterType !== "T01" &&
                    h("DropdownItem", { props: { name: "T06" } }, "复制到"),
                ]
              ),
            ]
          ),
        ]
      );
      return temp;
    },
    renderInput(h, data) {
      let temp = this.$createElement("Input", {
        ref: "input", // this.$createElement
        style: {
          width: "auto",
        },
        props: {
          value: data.chapterName,
          maxlength: 16,
        },
        on: {
          "on-enter": (e) => {
            e.target.blur();
          },
          "on-blur": (e) => {
            this.$emit("updateTreeNode", data, e.target.value);
          },
        },
      });
      return temp;
    },
    inputFocus() {
      this.$nextTick(() => {
        let input = this.$refs["input"].$refs["input"]; // 获取iview 的INPUT组件中的原生input
        let val = input.value;
        input.focus();
        if (val.length) {
          input.setSelectionRange(0, val.length); // 选中文字
        }
      });
    },
    // 遍历树形结构数据
    parseTreeJson(treeNodes, callback) {
      if (!treeNodes || !treeNodes.length) return;
      for (let i = 0; i < treeNodes.length; i++) {
        callback(treeNodes[i], i);
        let _children = treeNodes[i].children;
        if (_children && _children.length > 0) {
          this.parseTreeJson(_children, callback);
        }
      }
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
</style>