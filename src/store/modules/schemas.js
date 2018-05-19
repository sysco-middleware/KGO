import axios from 'axios'

const state = {
  schemas: [], // <- state initializer
  users: []
}

const getters = {
  active (state) { // A getter can merge/filter states
    return state.schemas.filter(function (schema) {
      return schema.active
    })
  }
}

const actions = {
  async fetchAllUsers (ctx) { // Only a action can preform async operations
    const {data} = await axios.get('https://reqres.in/api/users') // Some fake data
    ctx.commit('setUsers', data.data)
  }
}

const mutations = { // Mutations preform changes on the state
  setUsers (state, users) {
    state.users = users
  },
  pushUser (state, user) {
    state.users.push(user)
  }
}

export default {
  namespaced: true,
  mutations,
  getters,
  actions,
  state
}
