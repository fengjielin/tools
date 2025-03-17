<template>
  <Modal v-model="visible" :title="title" :width="width" :closable="true" :mask-closable="false" @on-cancel="close">
    <div style="min-height: 300px">
      <!-- 表单 -->
      <Form :model="form" :rules="rules" ref="form" :label-width="100" @submit.native.prevent>
        <FormItem label="标题：" prop="title">
          <Input type="text" v-model="form.title" placeholder="请输入标题" style="width: 240px" maxlength="50"></Input>
        </FormItem>
      </Form>
    </div>
    <div slot="footer" style="text-align: right">
      <Button @click="close">取消</Button>
      <Button type="primary" @click="submitForm" :loading="loading">保存</Button>
    </div>
  </Modal>
</template>

<script>
export default {
  name: "",
  components: {},
  props: {
    title: {
      type: String,
      default: "导入教案",
    },
    width: {
      type: String,
      default: "700px",
    },
  },
  data() {
    return {
      visible: false,

      form: {
        id: "",
        title: "",
      },
      rules: {
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
      },
    };
  },
  created() {},
  mounted() {},
  watch: {},
  computed: {},
  methods: {
    show() {
      this.visible = true;
    },
    close() {
      this.visible = false;
      this.$refs["form"].resetFields();
    },
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          console.log(valid);
        }
      });
    },
  },
};
</script>

<style scoped></style>
