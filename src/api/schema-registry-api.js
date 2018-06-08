import axios from 'axios'

const ROOT_URL = 'http://localhost:8081'
const defaultHeaders = {
  headers: {
    Accept: 'application/vnd.schemaregistry.v1+json'
  }
}

export default {
  fetchAllSubjects () {
    return axios.get(`${ROOT_URL}/subjects`, defaultHeaders)
  },
  deleteSubject (subjectName) {
    return axios.delete(`${ROOT_URL}/subjects/${subjectName}`, defaultHeaders)
  },
  checkIsSchemaRegisteredUnderSubject (subjectName, schema) {
    return axios.post(`${ROOT_URL}/subjects/${subjectName}`, {
      headers: defaultHeaders.headers,
      body: schema
    })
  },
  fetchSubjectVersions (subjectName) {
    return axios.get(`${ROOT_URL}/subjects/${subjectName}/versions`,
        defaultHeaders)
  },
  registerNewSchemaVersion (subjectName, schema) {
    return axios.post(`${ROOT_URL}/subjects/${subjectName}/versions`, {
      headers: defaultHeaders.headers,
      body: schema
    })
  },
  fetchSchema (subjectName, versionId) {
    return axios.get(
        `${ROOT_URL}/subjects/${subjectName}/versions/${versionId}`,
        defaultHeaders)
  },
  // TODO: only dev
  deleteSchemaVersion (subjectName, versiondId) {
    return axios.delete(
        `${ROOT_URL}/subjects/${subjectName}/versions/${versiondId}`,
        defaultHeaders)
  },
  fetchAvroSchema (subjectName, versionId) {
    return axios.get(
        `${ROOT_URL}/subjects/${subjectName}/versions/${versionId}/schema`,
        defaultHeaders)
  },
  testSchema (subjectName, versionId, schema) {
    return axios.post(`${ROOT_URL}/compatibility/subjects/${subjectName}/versions/${versionId}`, {
          headers: defaultHeaders.headers,
          body: schema
        }
    )
  },
  /**
   * NONE, FULL, FORWARD, BACKWARD, FULL_TRANSITIVE, FORWARD_TRANSITIVE, BACKWARD_TRANSITIVE
   */
  updateCompatibility (compatibilityLevel) {
    return axios.put(`${ROOT_URL}/config`, {
      headers: defaultHeaders.headers,
      body: {
        'compatibility': `\"${compatibilityLevel}\"`
      }
    })
  },
  fetchGlobalCompatibility () {
    return axios.get(`${ROOT_URL}/config`, defaultHeaders)
  },
  /**
   * NONE, FULL, FORWARD, BACKWARD, FULL_TRANSITIVE, FORWARD_TRANSITIVE, BACKWARD_TRANSITIVE
   */
  updateCompatibilityForSubject (subjectName, compatibilityLevel) {
    return axios.put(`${ROOT_URL}/config/${subjectName}`, {
      headers: defaultHeaders.headers,
      body: {
        'compatibility': `\"${compatibilityLevel}\"`
      }
    })
  },
  fetchSubjectCompatibility (subjectName) {
    return axios.get(`${ROOT_URL}/config/${subjectName}`, defaultHeaders)
  }
}
