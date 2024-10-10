import Vue from 'vue'
import App from './App'
import store from './store' // store
import plugins from './plugins' // plugins
import './permission' // permission

import '@/components'

import { getDicts } from "@/api/system/dict/data";
import { parseTime } from "@/utils/training";

import {multipleClicks,toast} from '@/utils/multipleClicks'
Vue.prototype.$multipleClicks = multipleClicks;

Vue.use(plugins)

Vue.config.productionTip = false
Vue.prototype.$store = store
Vue.prototype.parseTime = parseTime
Vue.prototype.getDicts = getDicts


App.mpType = 'app'

const app = new Vue({
  ...App
})

app.$mount()
