// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import router from './router'
import axios from 'axios'

Vue.config.productionTip = false

Vue.use(ElementUI)
axios.defaults.headers.post['x-key'] = window.sessionStorage.getItem('adminId');
axios.defaults.headers.post['x-token'] = window.sessionStorage.getItem('token');

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
