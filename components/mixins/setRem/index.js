export const mixins = {
  data() {
    return {
      baseSize: 100, // 基准大小
    };
  },
  created() {
    //钩子函数
    console.log('这是混入的组件');
  },
  mounted() {
    // 初始化
    this.setRem();
    // 改变窗口大小时重新设置 rem
    window.addEventListener('resize', this.handleResize);
  },
  destroyed() {
    document.documentElement.style.fontSize = 'initial';
    window.removeEventListener('resize', this.handleResize);
  },
  computed: {},
  methods: {
    handleResize(){
      this.setRem();
    },
    // 设置 rem 函数
    setRem() {
      let clientWidth = document.documentElement.clientWidth;
      clientWidth = clientWidth < 1200 ? 1200 : clientWidth;
      // 当前页面宽度相对于 1920宽的缩放比例，可根据自己需要修改。
      const scale = clientWidth / 1920;
      // 设置页面根节点字体大小（“Math.min(scale, 2)” 指最高放大比例为2，可根据实际业务需求调整）
      document.documentElement.style.fontSize = this.baseSize * Math.min(scale, 2) + 'px';

      // 1rem = 1px / 100
    },
  },
};
