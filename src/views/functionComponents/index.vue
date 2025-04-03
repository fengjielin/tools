<template>
  <div class="app-container">
    <MyUpload></MyUpload>
  </div>
</template>
<script>
  export default {
    name: '',
    components: {},
    data() {
      return {
        loading: true,
        compList: [
          {
            name: 'Upload',
            value: '',
            descriptions: '',
            createdTime: '',
            updatedTime: '',
          },
          {
            name: 'Tree',
            value: '',
            descriptions: '',
            createdTime: '',
            updatedTime: '',
          },
          {
            name: 'Menu',
            value: '',
            descriptions: '',
            createdTime: '',
            updatedTime: '',
          },
          {
            name: 'Viewer',
            value: '',
            descriptions: '',
            createdTime: '',
            updatedTime: '',
          },
          {
            name: 'Export',
            value: '',
            descriptions: '',
            createdTime: '',
            updatedTime: '',
          },
          {
            name: 'Dict',
            value: '',
            descriptions: '',
            createdTime: '',
            updatedTime: '',
          },
          {
            name: '富文本编辑器',
            value: '',
            descriptions: '',
            createdTime: '',
            updatedTime: '',
          },
        ],
      };
    },
    created() {},
    mounted() {},
    watch: {},
    computed: {},
    methods: {},
  };
</script>
<style scoped></style>
