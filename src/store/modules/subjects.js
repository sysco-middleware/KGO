import Vue from 'vue'
import axios from 'axios'

const state = {
  availible: [],
  info: {},
  subjects: [],
  subject: {}
}

const getters = {
}

const actions = {
  async fetchAvailible ({commit}) {
    const {data: subjectNames} = await axios.get('/subjects')
    commit('setSubjects', subjectNames)
  },
  async fetchVersions ({commit}, subjectName) {
    const {data: versions} = await axios.get(`/subjects/${subjectName}/versions`)
    commit('setSubjectVersions', subjectName, versions)
  },
  async fetchLatestSubject ({commit}, subjectName) {
    const {data: subject} = await axios.get(`/subjets/${subjectName}/versions/latest`)
    commit('setSubject', subject)
  },
  async fetchSubjectByVersion ({commit}, subjectName, version) {
    const {data: subject} = await axios.get(`/subjets/${subjectName}/versions/${version}`)
    commit('setSubject', subject)
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
  setSubjects (state, subjectNames) {
    state.availible = subjectNames
    state.subjects = subjectNames.map(subjectName => {
      var s = {}
      s[subjectName] = []
      return s
    })
    console.log(state.subjects)
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
  },
  setSubjectVersions (state, subjectName, versions) {
    state.subjects[subjectName] = versions
  },
  setSubject (state, subject) {
    state.subject = subject
  }
}

export default {
  namespaced: true,
  mutations,
  getters,
  actions,
  state
}
