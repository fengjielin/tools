<template>
  <div class="container">
    <div class="content-wrapper clearfix">
      <div class="left-wrapper">
        <div class="column-menu-title-wrapper">
          <div class="column-menu-title">专栏导航</div>
          <div>Thematic navigation</div>
        </div>
        <el-divider></el-divider>
        <div class="column-menu">
          <template v-for="item of reportColumnList">
            <resourceItem :item="item" :key="item.id" :activeItemId="activeItemId" :handleClick="handleClick" v-if="true"></resourceItem>
          </template>
        </div>
      </div>
      <div class="right-wrapper"></div>
    </div>
  </div>
</template>

<script>
  import menuItem from './menuItem.vue';

  export default {
    name: '',
    components: { menuItem },
    data() {
      return {
        activeItemId: '',
        curReportColumn: '',
        curColumnParent: '',
      };
    },
    created() {},
    mounted() {},
    watch: {},
    computed: {},
    methods: {
      setColumnItemAndActiveItemId(item) {
        let activeItemId = item.id;
        if (item.level == 0) {
          let data = '';
          if (item.children) {
            data = item.children[0];
            if (item.children && item.children.length > 1) {
              activeItemId = item.children[0].id;
            }
          } else {
            data = {
              columnName: '',
              parentId: item.id,
              level: 0,
            };
          }
          this.handleClick(data, activeItemId);
        } else {
          this.handleClick(item, activeItemId);
        }
      },
      handleClickFirst() {
        let flag = true;
        this.parseTreeJson(this.reportColumnList, (item) => {
          if (flag) {
            this.$set(item, 'expand', false);
          }
          if (flag && item.level == 0 && item.children && item.children.length == 1 && !item.children[0].children) {
            this.activeItemId = item.id;
            this.setColumnItemAndActiveItemId(item);
            flag = false;
          }
          if (flag && (!item.children || item.children.length == 0)) {
            this.activeItemId = item.id;
            this.setColumnItemAndActiveItemId(item);
            flag = false;
          }
        });
      },
      handleClick(item, activeItemId) {
        this.activeItemId = item.id;
        if (activeItemId) {
          this.activeItemId = activeItemId;
        }
        this.curReportColumn = item;
        let list = parseTreeFindParent(this.reportColumnList, item.parentId);
        if (list && list.length > 0) {
          this.curColumnParent = list[0];
        }
        // 递归遍历，除了自身及自身的孩子节点和父级节点外的其它节点都收起来
        let pIdList = list ? list.map((p) => p.id) : [];
        this.parseTreeJson(
          this.reportColumnList,
          (o) => {
            let cIdList = [];
            if (o.id == item.id && item.children) {
              this.parseTreeJson(
                item.children,
                (c) => {
                  cIdList.push(c.id);
                },
                null,
              );
            }
            if (o.id != item.id && !cIdList.includes(o.id) && !pIdList.includes(o.id)) {
              this.$set(o, 'expand', true);
            }
          },
          null,
        );
      },
      parseTreeJson(treeNodes, callback, level = 0) {
        if (!treeNodes || !treeNodes.length) return;
        for (let i = 0; i < treeNodes.length; i++) {
          if (typeof level == 'number') this.$set(treeNodes[i], 'level', level);
          callback(treeNodes[i], i);
          let _children = treeNodes[i].children;
          if (_children && _children.length > 0) {
            if (typeof level == 'number') {
              this.parseTreeJson(_children, callback, level + 1);
            } else {
              this.parseTreeJson(_children, callback, null);
            }
          }
        }
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

  /deep/ .el-divider--horizontal {
    margin: 12px 0;
  }
  /deep/ .column-menu {
    padding: 0 0 16px 16px;

    .menu-item {
      min-height: 40px;
      display: flex;
      align-items: center;
      padding: 6px 0 6px 6px;
      font-weight: 600;
      font-size: 16px;
    }
    .hover {
      cursor: pointer;
      &:hover {
        color: #409eff;
        background-color: #f5f5f5;

        &:after {
          border-left: 4px solid #409eff;
        }
      }
    }

    .active {
      color: #409eff;
      background-color: #f5f5f5;
    }
    .triangle:after {
      border-left: 4px solid #409eff;
    }
    .active.triangle:after {
      border-left: 4px solid #409eff;
    }

    .level_0 {
      border-bottom: 1px dashed #dcdfe6 !important;
    }
  }
</style>
