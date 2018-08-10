// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import Echarts from 'echarts'
import store from './store/index'
import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false

/* eslint-disable no-new */
Vue.use(ElementUI)
Vue.prototype.$echarts = Echarts

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
