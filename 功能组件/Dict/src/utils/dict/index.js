import Dict from './Dict'
import { mergeOptions } from './DictOptions'

export default function(Vue, options) {
  mergeOptions(options)
  Vue.mixin({
    data() {
      // /如果vue没有定义dicts，即this.$options.dicts为空，则返回{}相当于不混入
      if (this.$options === undefined || this.$options.dicts === undefined || this.$options.dicts === null) {
        return {}
      }
      // 生成初始化的字典对象
      const dict = new Dict()
      dict.owner = this
      return {
        // 混入dict，在页面上可以使用dict对象
        dict
      }
    },
    created() {
      if (!(this.dict instanceof Dict)) {
        return
      }
      options.onCreated && options.onCreated(this.dict)
      //执行Dict对象的init方法，将vue页面上定义的dicts数组传进去，组装数据，执行dictMeta.request(), 请求后端接口，获取对应类型的字典数据
      this.dict.init(this.$options.dicts).then(() => {
        options.onReady && options.onReady(this.dict)
        this.$nextTick(() => {
          //回调，在页面上通过 onDictReady方法或者触发dictReady事件，可以对dict进行一些后续处理
          this.$emit('dictReady', this.dict) // 事件总线 通过this.$on()触发
          if (this.$options.methods && this.$options.methods.onDictReady instanceof Function) {
            this.$options.methods.onDictReady.call(this, this.dict)
          }
        })
      })
    },
  })
}
