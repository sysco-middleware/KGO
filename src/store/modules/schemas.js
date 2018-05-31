import Vue from 'vue'
import axios from 'axios'

const state = {
  subjects: {
    events: {
      1: {
        id: 1,
        schema: '{\n  "type": "record",\n  "name": "events",\n  "namespace": "com.sysco",\n  "doc": "This is a sample Avro schema to get you started. Please edit",\n  "fields": [\n    {\n      "name": "name",\n      "type": "string"\n    },\n    {\n      "name": "number1",\n      "type": "int"\n    },\n    {\n      "name": "number2",\n      "type": "float"\n    }\n  ]\n}'
      }
    },
    commands: {
      1: {
        id: 2,
        schema: '{\n  "type": "record",\n  "name": "commands",\n  "namespace": "com.sysco.v1",\n  "doc": "This is a sample Avro schema to get you started. Please edit",\n  "fields": [\n    {\n      "name": "name",\n      "type": "string"\n    },\n    {\n      "name": "number1",\n      "type": "int"\n    },\n    {\n      "name": "number2",\n      "type": "float"\n    }\n  ]\n}'
      },
      2: {
        id: 3,
        schema: '{\n  "type": "record",\n  "name": "commands",\n  "namespace": "com.sysco.v2",\n  "doc": "This is a sample Avro schema to get you started. Please edit",\n  "fields": [\n    {\n      "name": "name",\n      "type": "string"\n    },\n    {\n      "name": "number1",\n      "type": "int"\n    },\n    {\n      "name": "number2",\n      "type": "float"\n    }\n  ]\n}'
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
