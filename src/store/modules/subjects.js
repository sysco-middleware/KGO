import api from '../../api/schema-registry-api'

const state = {
  subjects: []
}

const getters = {
  allSubjects: state => state.subjects
}

const actions = {
  async fetchSubjects ({commit}) {
    const response = await api.fetchAllSubjects()
    commit('setSubjects', response.data)
  },

}

const mutations = {
  setSubjects: (state, subjects) => {
    state.subjects = subjects
  }
}

export default {
  namespaced: true,
  mutations,
  getters,
  actions,
  state
}
