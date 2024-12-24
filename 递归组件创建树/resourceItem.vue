<template>
  <ul>
    <li :class="'level_' + item.level">
      <div class="menu-item hover" :class="{ active: activeItemId == item.reviewTaskDetailId, triangle: false }" @click.stop="handleClickItem(item)">
        <div class="ellipsis list-title" :title="item.columnName">
          <slot name="content" :data="item">{{ item.columnName }}</slot>
        </div>
      </div>
      <div :class="{ 'is-expand': item.expand }">
        <template v-if="item.level == 0 ? showSecondLevel(item) : true">
          <template v-for="(c, i) of item.children">
            <resource-item :key="i" :item="c" :activeItemId="activeItemId" :expand="expand" :handleClick="handleClick" v-if="true">
              <template slot="content" slot-scope="{ data }">
                <slot name="content" :data="data"></slot>
              </template>
            </resource-item>
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
      expand: false,

      handleClick: {
        require: true,
        type: Function,
      },
    },
    model: {
      prop: 'activeItemId',
      event: 'change',
    },
    data() {
      return {};
    },
    computed: {
      showSecondLevel() {
        return (item) => {
          return item.children && item.children.length > 1;
        };
      },
    },
    methods: {
      handleClickItem(item) {
        let activeItemId = item.reviewTaskDetailId;
        if (this.expand) {
          this.$set(item, 'expand', !item.expand);
        }
        if (item.level == 0) {
          if (item.children) {
            if (item.children.length > 1) {
              activeItemId = item.children[0].id;
              this.$emit('change', activeItemId);
            }
            this.handleClick(item.children[0], activeItemId);
          }
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

<style scoped lang="scss">
  .ellipsis {
    max-width: 290px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .menu-item {
    min-height: 50px;
    display: flex;
    align-items: center;
    padding: 8px 6px;
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
      // padding-right: 32px;
      font-size: 16px;
    }
  }
  .level_2 {
    .menu-item {
      padding-left: 60px;
      font-size: 16px;
    }
  }
  .hover {
    cursor: pointer;
    &:hover {
      // color: #8f1f11;
      background-color: #f5f7fa;

      &:after {
        border-left: 4px solid #8f1f11;
      }
    }
  }

  .active {
    // color: #8f1f11;
    background-color: #f5f7fa;
  }

  .triangle {
    position: relative;
  }
  .triangle:after {
    content: '';
    position: absolute;
    top: 20px;
    right: 24px;
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
