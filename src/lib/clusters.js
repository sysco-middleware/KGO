import store from '@/store'
import axios from 'axios'

export function active () {
  let selected = store.getters['clusters/selected']

  if (!selected) {
    store.dispatch('clusters/fetch')
  }

  return selected || store.getters['clusters/selected']
}

export function request (key, {content, accept} = {}) {
  const cluster = active()
  const client = axios.create({
    baseURL: cluster[key],
    headers: {
      'Content-Type': content,
      'Accept': accept
    }
  })

  return client
}
