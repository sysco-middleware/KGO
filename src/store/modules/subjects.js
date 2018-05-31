import Vue from 'vue'
import axios from 'axios'

const state = {
  subjects: {}
}

const getters = {
}

const actions = {
  async fetchAvailible ({commit}) {
    const {data: subjects} = await axios.get('/subjects')
    commit('setAvailible', subjects)
  },
  async fetchAllVersions ({dispatch, state}, name) {
    for (let subject in state.subjects) {
      await dispatch('fetchVersions', subject)
    }
  },
  async fetchVersions ({commit}, name) {
    const {data: versions} = await axios.get(`/subjects/${name}/versions`)

    commit('setVersions', {
      name,
      versions
    })
  },
  async fetchSchemaByVersion ({commit}, {name, version}) {
    const {data: schema} = await axios.get(`/subjets/${name}/versions/${version}`)

    commit('setSchema', {
      name,
      schema,
      version
    })
  }
}

const mutations = {
  clearState (state) {
    state.subjects = {}
  },
  setAvailible (state, subjects) {
    for (let subject of subjects) {
      if (!state.subjects[subject]) {
        Vue.set(state.subjects, subject, {})
      }
    }
  },
  setSchema (state, {name, version, schema}) {
    if (!state.subjects[name]) Vue.set(state.subjects, name, {})
    Vue.set(state.subjects[name], version, schema)
  },
  setVersions (state, {name, versions}) {
    if (!state.subjects[name]) Vue.set(state.subjects, name, {})

    for (let version of versions) {
      Vue.set(state.subjects[name], version, {})
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
