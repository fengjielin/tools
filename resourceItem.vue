<template>
  <div>
    <ul>
      <li>
        <div class="first-level children-level-item list-item">
          <div class="ellipsis">
            {{ item.chapterName }}
          </div>
          <div class="resource-item">
            <div
              v-for="(rItem, rIndex) in item.resources"
              :key="rIndex"
              @click="showResource(rItem, item)"
            >
              <Tooltip
                :content="rItem.resourceName"
                transfer
                placement="top"
                max-width="250"
              >
                <span
                  class="iconfont icon-excel"
                  style="color: #00c26e"
                  v-if="rItem.suffix == 'xls'"
                ></span>
                <span
                  class="iconfont icon-PPT"
                  style="color: #ff9914"
                  v-else-if="rItem.suffix == 'ppt'"
                ></span>
                <span
                  class="iconfont icon-PDF"
                  style="color: #ff4e4e"
                  v-else-if="rItem.suffix == 'pdf'"
                ></span>
                <span
                  class="iconfont icon-word"
                  style="color: #5784ff"
                  v-else-if="rItem.suffix == 'doc'"
                ></span>
                <span
                  class="iconfont icon-video"
                  style="color: #855aff"
                  v-else-if="rItem.suffix == 'mp4'"
                ></span>
                <span
                  class="iconfont icon-pic"
                  style="color: #7176ff"
                  v-else-if="rItem.suffix == 'img'"
                ></span>
              </Tooltip>
            </div>
          </div>
        </div>
        <template v-for="(c, i) of item.children">
          <resource-item :key="i" :item="c" class="children-level" />
        </template>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "resourceItem",
  props: {
    item: Object,
  },
  methods: {
    showResource(row, course) {
      this.$set(row, "timestamp", Date.now());
      this.$store.commit("setResourceItem", row);
      this.$store.commit("setCourseItem", course);
    },
  },
};
</script>

<style scoped>
.ellipsis {
  max-width: 290px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
ul {
  list-style: none;
}
.first-level {
  width: 100%;
  min-height: 42px;
  line-height: 42px;
  background-color: #f0faff;
  margin: 4px 0;
  padding-left: 16px;
  padding-right: 16px;
  display: flex;
  justify-content: space-between;
  font-size: 16px;
}
.children-level {
  margin: 4px 0 4px 24px;
}
.children-level .children-level-item {
  height: 36px;
  line-height: 36px;
  padding-left: 6px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #e8eaec;
  background-color: initial;
  font-size: 13px;
}
.resource-item {
  display: flex;
  max-width: 750px;
  flex-wrap: wrap;
}
.resource-item > div {
  cursor: pointer;
  margin-left: 6px;
}
.resource-item span {
  padding-left: 2px;
  padding-right: 2px;
}
.list-item {
  border-bottom: 1px dotted #e4e6eb;
}
.list-item:hover {
  background-color: #f7f9fc;
}
</style>