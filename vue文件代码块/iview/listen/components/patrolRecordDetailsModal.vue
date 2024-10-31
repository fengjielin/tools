<template>
  <Modal v-model="visible" :title="title" :width="width" :closable="true" :mask-closable="false" @on-cancel="close" :styles="{ top: '20px' }">
    <div style="min-height: 300px">
      <patrolRecordDetails :listenPatrolHeaderId="listenPatrolHeaderId" v-if="visible"></patrolRecordDetails>
    </div>
    <div slot="footer" style="text-align: center">
      <Button @click="close">关闭</Button>
    </div>
  </Modal>
</template>

<script>
  import patrolRecordDetails from '../patrolRecordDetails/index.vue';
  export default {
    name: 'iviewModal',
    components: { patrolRecordDetails },
    props: {
      title: {
        type: String,
        default: '导入教案',
      },
      width: {
        type: String,
        default: '90vw',
      },
      listenPatrolHeaderId: {
        type: [String, Number],
        default: '',
      },
    },
    data() {
      return {
        loading: false,
        visible: false,
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
        this.$refs['form'].resetFields();
      },
      submitForm() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            console.log(valid);
          }
        });
      },
    },
  };
</script>
