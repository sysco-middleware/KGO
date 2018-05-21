import Vue from 'vue'
import axios from 'axios'

const state = {
  availible: [],
  info: {}
}

const getters = {
}

const actions = {
  async fetchAvailible ({commit}) {
    const {data: subjects} = await axios.get('/subjects')
    commit('setSubjects', subjects)
  },
  async fetchLatest ({commit}, id) {
    const {data: schema} = await axios.get(`/subjects/${id}/versions/latest`)
    commit('setSubjectVersion', schema)
  }
}

const mutations = {
  clearState (state, subjects) {
    state.availible = []
    state.info = {}
  },
  setSubjects (state, subjects) {
    state.availible = subjects
  },
  setSubjectVersion (state, schema) {
    if (!state.info[schema.subject]) Vue.set(state.info, schema.subject, {})
    Vue.set(state.info[schema.subject], schema.version, schema)

    // Set the latest schema version
    const latest = state.info[schema.subject].latest
    if (!latest) {
      Vue.set(state.info[schema.subject], 'latest', schema)
    } else {
      if (!latest.version < schema.version) {
        Vue.set(state.info[schema.subject], 'latest', schema)
      }
    }
  }
}

export default {
  namespaced: true,
  mutations,
  getters,
  actions,
  state
}
