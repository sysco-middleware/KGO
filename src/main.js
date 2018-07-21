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

  store.dispatch('messages/setRequestHandle')
  store.dispatch('topics/setRequestHandle')

  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app')
}

init()
