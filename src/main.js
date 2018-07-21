import Vue from 'vue'
import VuePaginate from 'vue-paginate'

import * as config from '@/lib/config'
import App from './App.vue'
import router from './router'
import store from './store/'
import './registerServiceWorker'

Vue.use(VuePaginate)

async function init () {
  await config.fetch()

  store.commit('messages/setRequestHandle', {
    baseURL: config.get('kafka.rest.proxy.api')
  })

  store.commit('topics/setRequestHandle', {
    baseURL: config.get('kafka.rest.proxy.api')
  })

  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app')
}

init()
