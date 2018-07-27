import Vue from 'vue'
import axios from 'axios'
import * as config from '@/lib/config'

const request = axios.create({
  baseURL: config.get('schema.registry.api')
})

const state = {
  subjects: {},
  configs: {},
  global: {
    config: {}
  }
}

const getters = {
  /**
   * Fetch the latest versions of all subjects.
   * If the given subject has no version set is the latest version set to null.
   * @return {Object}  Latest versions of subjects
   */
  latest (state) {
    let subjects = {}

    for (let subject in state.subjects) {
      const versions = Object.keys(state.subjects[subject])
      const latest = versions.length > 0 ? Math.max(...versions) : null

      subjects[subject] = {
        schema: state.subjects[subject][latest],
        version: latest
      }
    }

    return subjects
  }
}

const actions = {
  /**
   * Fetch all available subjects in the Kafka Schema registry.
   */
  async fetchAvailable ({commit}) {
    const {data: subjects} = await request.get('/subjects')
    commit('setAvailible', subjects)
  },
  /**
   * Fetch all versions of the given subject.
   * @param {String} subject Subject name
   */
  async fetchAllVersions ({dispatch, state}, subject) {
    if (!state.subjects[subject]) {
      throw new Error('the given subject is not found')
    }

    for (let version in state.subjects[subject]) {
      await dispatch('fetchSchemaByVersion', {subject, version})
    }
  },
  /**
   * Fetch all available versions of the given subject.
   * @param  {String} subject Subject name
   */
  async fetchVersions ({commit}, subject) {
    const {data: versions} = await request.get(`/subjects/${subject}/versions`)

    commit('setVersions', {
      subject,
      versions
    })
  },
  /**
   * Fetch the version of a schema in a subject.
   * @param  {String} object.subject Subject name
   * @param  {Number} object.version Schema version number
   */
  async fetchSchemaByVersion ({commit}, {subject, version}) {
    const {data: info} = await request.get(`/subjects/${subject}/versions/${version}`)
    info.schema = JSON.parse(info.schema)

    commit('setSchema', {
      info,
      subject,
      version
    })
  },
  /**
   * Fetch the config for the given subject.
   * If a config is not set or found is a 404 thrown.
   * @param  {String} subject        Subject name
   */
  async fetchConfig ({commit}, subject) {
    try {
      const {data} = await request.get(`/config/${subject}`)
      const config = {
        compatibility: data.compatibilityLevel
      }

      commit('setConfig', {
        subject,
        config
      })
    } catch (error) {
      const {response} = error
      if (response.status !== 404) {
        throw error
      }
    }
  },
  /**
   * Fetch the global config from Kafka Schema Registry
   */
  async fetchGlobalConfig ({commit}) {
    const {data} = await request.get('/config')
    const config = {
      compatibility: data.compatibilityLevel
    }

    commit('setGlobalConfig', config)
  },
  /**
   * Check the compatibility with the given schema and the latest
   * schema version. A Error is thrown if the schema is incompatible
   * @param  {String} options.subject Subject name
   * @param  {Object} options.schema  Schema to be validated
   */
  async checkCompatibility ({state}, {subject, schema}) {
    const info = state.subjects[subject]
    schema = JSON.stringify(schema)

    if (!info) {
      throw new Error(`the subject: ${subject} was not found in the store`)
    }

    const versions = Object.keys(info)

    if (versions.length <= 0) {
      throw new Error(`no versions are found for the given subject: ${subject}`)
    }

    const latest = Math.max(...versions)
    const latestSchema = info[latest].schema

    if (JSON.stringify(latestSchema) === schema) {
      throw new Error('the schema has not been changed')
    }

    const {data} = await request.post(`/compatibility/subjects/${subject}/versions/${latest}`, {
      schema
    })

    if (!data.is_compatible) {
      throw new Error('the given schema is incompatible with the latest version')
    }
  },
  async newSchema ({dispatch}, {subject, schema}) {
    schema = JSON.stringify(schema)

    await request.post(`/subjects/${subject}/versions`, {
      schema
    })

    await dispatch('fetchVersions', subject)
  },
  /**
   * Set the config for the given subject
   * @param {String} options.subject Subject name
   * @param {Object} options.config  Subject config
   */
  async setConfig ({commit}, {subject, config}) {
    await request.put(`/config/${subject}`, config)
  },
  /**
   * Set the global config for Kafka Schema Registry
   * @param {Object} config Global config
   */
  async setGlobalConfig ({commit}, config) {
    await request.put('/config', config)
  }
}

const mutations = {
  /**
   * Clear all subjects from the store
   */
  clearState (state) {
    state.subjects = {}
  },
  /**
   * Set the available subjects.
   * If a subject already exists in the store is it not overridden
   * @param {Array<String>} subjects Array containing all available subjects
   */
  setAvailible (state, subjects) {
    for (let subject of subjects) {
      if (!state.subjects[subject]) {
        Vue.set(state.subjects, subject, {})
      }
    }
  },
  /**
   * Set a version of a schema for the given subject.
   * @param {String} object.subject Subject name
   * @param {Number} object.version Schema version
   * @param {Object} object.info    Schema info
   */
  setSchema (state, {subject, version, info}) {
    if (!state.subjects[subject]) Vue.set(state.subjects, subject, {})
    Vue.set(state.subjects[subject], version, info)
  },
  /**
   * Set a available version to the given subject.
   * This mutation only sets a empty object if the given version is not found.
   * @param {String}        options.subject  Subject name
   * @param {Array<Number>} options.versions Array containing all available versions
   */
  setVersions (state, {subject, versions}) {
    if (!state.subjects[subject]) Vue.set(state.subjects, subject, {})

    for (let version of versions) {
      Vue.set(state.subjects[subject], version, {})
    }
  },
  /**
   * Set the config for the given subject
   * @param {String} object.subject Subject name
   * @param {Object} object.config  Subject config
   */
  setConfig (state, {subject, config}) {
    if (!state.configs[subject]) Vue.set(state.configs, subject, {})

    Vue.set(state.configs, subject, config)
  },
  /**
   * Set the global config in the store
   * @param {Object} config Global config
   */
  setGlobalConfig (state, config) {
    Vue.set(state.global, 'config', config)
  }
}

export default {
  namespaced: true,
  mutations,
  getters,
  actions,
  state
}
