import Vue from 'vue'
import VuePaginate from 'vue-paginate'

import App from './App.vue'
import router from './router'
import store from './store/'
import './registerServiceWorker'

Vue.use(VuePaginate)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
