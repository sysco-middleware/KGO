import {LOCAL_STORAGE_EMAIL, LOCAL_STORAGE_NAME} from '@/lib/constants'

const state = {
  active: null
}

const getters = {
  active (state) {
    if (!state.active) {
      return {}
    }

    const {name, email} = state.active
    const match = name.trim().match(/^\s*(\w)|\b(\w)(?=\S+$)/g)

    if (!match) {
      return ''
    }

    const [first = '', last = ''] = match
    const shortname = (first + last).toUpperCase()

    return {
      shortname,
      email,
      name
    }
  }
}

const actions = {
  fetchFromCache ({commit}) {
    const name = localStorage.getItem(LOCAL_STORAGE_NAME)
    const email = localStorage.getItem(LOCAL_STORAGE_EMAIL)

    if (!name || !email) {
      return
    }

    commit('set', {
      name,
      email
    })
  },
  async register ({commit}, {name, email}) {
    // TODO: commit a users information to kafka
    if (!name || !email) {
      throw new Error('no email or name set')
    }

    commit('set', {
      name,
      email
    })
  },
  clear ({commit}) {
    commit('clear')
  }
}

const mutations = {
  set (state, {name, email}) {
    localStorage.setItem(LOCAL_STORAGE_NAME, name)
    localStorage.setItem(LOCAL_STORAGE_EMAIL, email)

    state.active = {
      name,
      email
    }
  },
  clear (state) {
    localStorage.removeItem(LOCAL_STORAGE_NAME)
    localStorage.removeItem(LOCAL_STORAGE_EMAIL)
    state.active = null
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
