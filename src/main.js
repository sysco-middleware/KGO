import Vue from 'vue'
import VuePaginate from 'vue-paginate'
import axios from 'axios'

import App from './App.vue'
import router from './router'
import store from './store/'
import './registerServiceWorker'

axios.defaults.baseURL = 'http://127.0.0.1:8081' // TODO: fetch the host from a config file or api
Vue.config.productionTip = false

Vue.use(VuePaginate)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
