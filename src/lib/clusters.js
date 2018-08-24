import store from '@/store'
import axios from 'axios'
import {CONTENT_JSON_KAFKA} from '@/lib/constants'

export function active () {
  let selected = store.getters['clusters/selected']

  if (!selected) {
    store.dispatch('clusters/fetch')
  }

  return selected || store.getters['clusters/selected']
}

export function request (key) {
  const cluster = active()
  const client = axios.create({
    baseURL: cluster[key],
    headers: {
      'Content-Type': CONTENT_JSON_KAFKA,
      'Accept': CONTENT_JSON_KAFKA
    }
  })

  return client
}
