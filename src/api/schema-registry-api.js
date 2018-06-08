import axios from 'axios'

export default {
  fetchAllSubjects () {
    return axios.get(`/subjects`)
  },
  deleteSubject (subjectName) {
    return axios.delete(`/subjects/${subjectName}`)
  },
  checkIsSchemaRegisteredUnderSubject (subjectName, schema) {
    return axios.post(`/subjects/${subjectName}`, {
      body: schema
    })
  },
  fetchSubjectVersions (subjectName) {
    return axios.get(`/subjects/${subjectName}/versions`)
  },
  registerNewSchemaVersion (subjectName, schema) {
    return axios.post(`/subjects/${subjectName}/versions`, {
      body: schema
    })
  },
  fetchSchema (subjectName, versionId) {
    return axios.get(`/subjects/${subjectName}/versions/${versionId}`)
  },
  // TODO: only dev
  deleteSchemaVersion (subjectName, versiondId) {
    return axios.delete(`/subjects/${subjectName}/versions/${versiondId}`)
  },
  fetchAvroSchema (subjectName, versionId) {
    return axios.get(`/subjects/${subjectName}/versions/${versionId}/schema`)
  },
  testSchema (subjectName, versionId, schema) {
    return axios.post(`/compatibility/subjects/${subjectName}/versions/${versionId}`, {
      body: schema
    })
  },
  /**
   * NONE, FULL, FORWARD, BACKWARD, FULL_TRANSITIVE, FORWARD_TRANSITIVE, BACKWARD_TRANSITIVE
   */
  updateCompatibility (compatibilityLevel) {
    return axios.put(`/config`, {
      body: {
        'compatibility': `"${compatibilityLevel}"`
      }
    })
  },
  fetchGlobalCompatibility () {
    return axios.get(`/config`)
  },
  /**
   * NONE, FULL, FORWARD, BACKWARD, FULL_TRANSITIVE, FORWARD_TRANSITIVE, BACKWARD_TRANSITIVE
   */
  updateCompatibilityForSubject (subjectName, compatibilityLevel) {
    return axios.put(`/config/${subjectName}`, {
      body: {
        'compatibility': `"${compatibilityLevel}"`
      }
    })
  },
  fetchSubjectCompatibility (subjectName) {
    return axios.get(`/config/${subjectName}`)
  }
}
