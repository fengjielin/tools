<template>
  <div></div>
</template>

<script>
  export default {
    name: 'Index',
    components: {},
    data() {
      return {
        // 版本号
        version: '3.8.8',
      };
    },
    computed: {
      // 检查用户是否拥有某个角色
      checkRoles() {
        return (role) => {
          let roles = this.$store.state.user.roles;
          if (roles.includes(role)) {
            return true;
          } else {
            return false;
          }
        };
      },
    },
    methods: {
      goTarget(href) {
        window.open(href, '_blank');
      },
    },
  };
</script>

<style scoped lang="scss"></style>
