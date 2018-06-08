import Vue from 'vue'
import api from '../../api/schema-registry-api'

const state = {
  subjects: {
    events: {
      1: {
        id: 1,
        schema: {
          type: 'record',
          name: 'events',
          namespace: 'com.sysco',
          doc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam mollis magna nisi. In non ligula lorem. In facilisis at nibh eu posuere. Morbi aliquet magna ac efficitur auctor',
          fields: [
            {
              name: 'name',
              type: 'string'
            },
            {
              name: 'number1',
              type: 'int'
            },
            {
              name: 'number2',
              type: 'float'
            }
          ]}
      }
    },
    commands: {
      1: {
        id: 2,
        schema: {
          type: 'record',
          name: 'events',
          namespace: 'com.sysco',
          doc: 'Praesent ac massa non lacus aliquet venenatis quis sit amet odio. Donec ullamcorper sem nec enim hendrerit interdum.',
          fields: [
            {
              name: 'name',
              type: 'string'
            },
            {
              name: 'number1',
              type: 'int'
            },
            {
              name: 'number2',
              type: 'float'
            }
          ]}
      },
      2: {
        id: 3,
        schema: {
          type: 'record',
          name: 'events',
          namespace: 'com.sysco',
          doc: 'Praesent molestie dui non velit elementum bibendum. Curabitur et fermentum sem. Aliquam ex libero, ornare sed condimentum et, tincidunt vel leo.',
          fields: [
            {
              name: 'name',
              type: 'string'
            },
            {
              name: 'number1',
              type: 'int'
            },
            {
              name: 'number2',
              type: 'float',
              doc: 'A numeric code signifying how the passenger paid for the trip. 1: Credit card 2: Cash 3: No charge 4: Dispute 5: Unknown 6: Voided trip'
            }
          ]}
      }
    }
  }
}

const getters = {
  latest (state) {
    let subjects = {}

    for (let schema in state.subjects) {
      const versions = Object.keys(state.subjects[schema])
      const latest = Math.max(...versions)

      subjects[schema] = {
        schema: state.subjects[schema][latest],
        version: latest
      }
    }

    return subjects
  }
}

const actions = {
  async fetchAvailable ({commit}) {
    // const {data: subjects} = await axios.get('/subjects')
    commit('clearState', state)
    const {data: subjects} = await api.fetchAllSubjects()
    commit('setAvailable', subjects)
  },
  async fetchAllVersions ({dispatch, state}, name) {
    for (let subject in state.subjects) {
      await dispatch('fetchVersions', subject)
    }
  },
  async fetchVersions ({commit}, name) {
    // const {data: versions} = await axios.get(`/subjects/${name}/versions`)
    const {data: versions} = await api.fetchSubjectVersions(name)

    commit('setVersions', {
      name,
      versions
    })
  },
  async fetchSchemaByVersion ({commit}, {name, version}) {
    // const {data: schema} = await axios.get(`/subjets/${name}/versions/${version}`)
    const {data: schema} = await api.fetchSchema(name, version)

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
  setAvailable (state, subjects) {
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
