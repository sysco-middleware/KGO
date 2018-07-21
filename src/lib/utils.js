/**
 * Generate a GUID
 * @return {String} generated GUID
 */
export function GUID () {
  function _p8 (s) {
    var p = (Math.random().toString(16) + '000000000').substr(2, 8)
    return s ? '-' + p.substr(0, 4) + '-' + p.substr(4, 4) : p
  }
  return _p8() + _p8(true) + _p8(true) + _p8()
}

/**
 * Download the file from the given url with the given name.
 * @param  {String} url   Location/URL of download
 * @param  {String} name  Name of the document
 */
export function download (url, name) {
  const link = document.createElement('a')
  link.href = url
  link.download = name
  link.click()
  link.remove()
}

export function getFormatHeaders (format) {
  switch (format) {
    case 'binary':
      return {
        'Accept': 'application/vnd.kafka.binary.v1+json'
      }
    case 'json':
      return {
        'Accept': 'application/vnd.kafka.json.v1+json'
      }
    case 'avro':
      return {
        'Accept': 'application/vnd.kafka.avro.v1+json'
      }
  }
}
