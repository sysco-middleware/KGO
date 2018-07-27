const config = window.config

export function get (key) {
  if (!config) {
    return null
  }

  return config[key]
}

export function active () {
  return config
}
