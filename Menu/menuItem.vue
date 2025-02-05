<template>
  <ul>
    <li :class="'level_' + item.level">
      <div class="menu-item hover" :class="{ active: activeItemId == item.id, triangle: item.level != 0 && item.children }" @click.stop="handleClickItem(item)">
        <div class="ellipsis list-title" :title="item.columnName" :data-id="item.id">
          <template v-if="lineFeed && item.columnName == '期满任务完成情况自评表'">
            <div class="line-height-s">
              期满任务
              <br />
              完成情况自评表
            </div>
          </template>
          <template v-else>
            {{ item.columnName }}
          </template>
        </div>
      </div>
      <div :class="{ 'is-expand': item.expand }">
        <template v-if="item.level == 0 ? showSecondLevel(item) : true">
          <template v-for="(c, i) of item.children">
            <resource-item :key="i" :item="c" :activeItemId="activeItemId" :expand="expand" :hidden="hidden" :handleClick="handleClick" :lineFeed="lineFeed" v-if="true" />
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
      // 期满任务完成情况自评表 是否需要换行
      lineFeed: {
        type: [Boolean],
        default: false,
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
        // 点击一级目录，并且一级目录的子节点被隐藏的情况下
        if (item.level == 0 && this.hidden) {
          let data = '';
          // 当点击一级目录时，并且子节点长度等于1时，查找下级并显示，否则为点击哪个就定位哪个
          if (item.children && item.children.length == 1) {
            let flag = true;
            this.parseTreeJson(item.children, (o) => {
              if (flag && o.children && o.children.length == 1 && !o.children[0].children) {
                activeItemId = o.id;
                data = o;
                flag = false;
              }
              if (flag && (!o.children || o.children.length == 0)) {
                data = o;
                flag = false;
              }
            });
            console.log(data, activeItemId);
          } else {
            data = item;
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
    max-width: 2.9rem;
    overflow: hidden;
    // text-overflow: ellipsis;
    // white-space: nowrap;
  }
  ul {
    list-style: none;
  }

  .menu-item {
    min-height: 0.5rem;
    display: flex;
    align-items: center;
    padding: 0.06rem;
    position: relative;
  }
  .level_0 {
    cursor: pointer;
    border-bottom: 1px dashed #fff;

    > .menu-item {
      font-weight: 700;
      padding-top: 0.16rem;
      padding-bottom: 0.16rem;
      padding-left: 0.16rem;
      font-size: 0.22rem;
    }
  }
  .level_1 {
    .menu-item {
      padding-left: 0.36rem;
      padding-right: 0.32rem;
      font-size: 0.16rem;
    }
  }
  .level_2 {
    .menu-item {
      padding-left: 0.6rem;
      font-size: 0.16rem;
    }
  }
  .level_3 {
    .menu-item {
      padding-left: 0.76rem;
      font-size: 0.16rem;
    }
  }
  .hover {
    cursor: pointer;
    &:hover {
      color: #8f1f11;
      background-color: #fff;

      &:after {
        border-left: 0.04rem solid #8f1f11;
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
    right: 0.24rem;
    transform: translateY(-50%);
    border-top: 0.04rem solid transparent;
    border-bottom: 0.04rem solid transparent;
    border-left: 0.04rem solid #fff;
  }
  .active.triangle:after {
    border-left: 0.04rem solid #8f1f11;
  }

  .is-expand {
    height: 0;
    overflow: hidden;
  }
</style>
