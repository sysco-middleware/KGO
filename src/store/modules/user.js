import {LOCAL_STORAGE_EMAIL, LOCAL_STORAGE_NAME} from '@/lib/constants'

const state = {
  active: null
}

const getters = {
  /**
   * Get the active user's profile
   * @return {Object} Object containing the users profile
   */
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
  /**
   * Fetch locally stored information about the user if found
   */
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
  /**
   * Register a new user with the given name and email
   * @param  {String} options.name   Name of the user
   * @param  {String} options.email  Email of the user
   */
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
  /**
   * Clear the information about the active user
   * from the state and local storage.
   */
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
