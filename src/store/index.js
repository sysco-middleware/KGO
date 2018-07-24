import Vue from 'vue'
import Vuex from 'vuex'

import mutations from './mutations'
import getters from './getters'
import actions from './actions'
import state from './state'

import messages from './modules/messages'
import schemas from './modules/schemas'
import waiting from './modules/waiting'
import config from './modules/config'
import topics from './modules/topics'

Vue.use(Vuex)

export default new Vuex.Store({
  mutations,
  getters,
  actions,
  state,
  modules: {
    messages,
    schemas,
    waiting,
    config,
    topics
  }
})
