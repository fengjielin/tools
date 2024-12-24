<template>
  <ul>
    <li :class="'level_' + item.level">
      <div class="menu-item hover" :class="{ active: activeItemId == item.id, triangle: item.level != 0 && item.children }" @click.stop="handleClickItem(item)">
        <div class="ellipsis list-title" :title="item.columnName">
          <template v-if="item.columnName == '期满任务完成情况自评表'">
            <span class="line-height-s">
              期满任务
              <br />
              完成情况自评表
            </span>
          </template>
          <template v-else>
            {{ item.columnName }}
          </template>
        </div>
      </div>
      <div :class="{ 'is-expand': item.expand }">
        <template v-if="item.level == 0 ? showSecondLevel(item) : true">
          <template v-for="(c, i) of item.children">
            <resource-item :key="i" :item="c" :activeItemId="activeItemId" :expand="expand" :hidden="hidden" :handleClick="handleClick" v-if="true" />
          </template>
        </template>
      </div>
    </li>
  </ul>
</template>

<script>
  /** 使用
  *  <template v-for="item of reviewTaskDetailList">
       <resourceItem :activeItemId="activeItemId" :item="item" :key="item.reviewTaskDetailId" :handleClick="handleClick" v-if="true">
         <template slot="content" slot-scope="{ data }">
           <span>{{ data.columnName }}</span>
         </template>
       </resourceItem>
     </template>
  */
  export default {
    name: 'resourceItem',
    props: {
      item: Object,
      activeItemId: {
        type: [String, Number],
        default: 67,
      },
      // 是否隐藏二级，当只有一级的时候
      hidden: {
        type: Boolean,
        default: true,
      },
      expand: {
        type: Boolean,
        default: true,
      },
      handleClick: {
        require: true,
        type: Function,
      },
    },
    data() {
      return {};
    },
    computed: {
      showSecondLevel() {
        return (item) => {
          if (this.hidden) {
            if (item.columnType == 'T07') {
              return true;
            }
            return item.children && item.children.length > 1;
          } else {
            return true;
          }
        };
      },
    },
    methods: {
      handleClickItem(item) {
        let activeItemId = item.id;
        if (this.expand) {
          this.$set(item, 'expand', !item.expand);
        }
        if (item.level == 0 && this.hidden) {
          let data = '';
          if (item.children) {
            data = item.children[0];

            if (item.children.length > 1) {
              activeItemId = item.children[0].id;
            }
          }
          if (!item.children || item.children.length == 0) {
            data = {
              columnName: '',
              parentId: item.id,
              level: 0,
            };
          }
          this.$emit('change', activeItemId);
          this.handleClick(data, activeItemId);
        } else {
          this.$emit('change', activeItemId);
          this.handleClick(item, activeItemId);
        }
      },
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

<style scoped lang="less">
  .ellipsis {
    max-width: 290px;
    overflow: hidden;
    // text-overflow: ellipsis;
    // white-space: nowrap;
  }
  ul {
    list-style: none;
  }

  .menu-item {
    min-height: 50px;
    display: flex;
    align-items: center;
    padding: 6px 6px 6px 6px;
    position: relative;
  }
  .level_0 {
    cursor: pointer;
    border-bottom: 1px dashed #fff;

    > .menu-item {
      font-weight: 700;
      padding-top: 16px;
      padding-bottom: 16px;
      padding-left: 16px;
      font-size: 22px;
    }
  }
  .level_1 {
    .menu-item {
      padding-left: 36px;
      padding-right: 32px;
      font-size: 16px;
    }
  }
  .level_2 {
    .menu-item {
      padding-left: 60px;
      font-size: 16px;
    }
  }
  .level_3 {
    .menu-item {
      padding-left: 76px;
      font-size: 16px;
    }
  }
  .hover {
    cursor: pointer;
    &:hover {
      color: #8f1f11;
      background-color: #fff;

      &:after {
        border-left: 4px solid #8f1f11;
      }
    }
  }

  .active {
    color: #8f1f11;
    background-color: #fff;
  }

  .triangle {
    position: relative;
  }
  .triangle:after {
    content: '';
    position: absolute;
    top: 50%;
    right: 24px;
    transform: translateY(-50%);
    border-top: 4px solid transparent;
    border-bottom: 4px solid transparent;
    border-left: 4px solid #fff;
  }
  .active.triangle:after {
    border-left: 4px solid #8f1f11;
  }
  .line-height-s {
    font-size: 22px;
    line-height: 26px;
    text-align: left;
    // padding-left: 20px;
    width: auto;
  }

  .is-expand {
    height: 0;
    overflow: hidden;
  }
</style>
