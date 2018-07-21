import axios from 'axios'

let config = null

export function get (key) {
  if (!config) {
    return null
  }

  return config[key]
}

export function active () {
  return config
}

export async function fetch () {
  const {data} = await axios.get('/config.json')
  config = data
}
