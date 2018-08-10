import $ajax from '../ajax'
import $utils from '../utils'

let serverUrl = $utils.serverUrl

export default {
  // name, days
  create (data) {
    return $ajax.post(serverUrl('child'), data)
  },
  // id
  destroy ({ id }) {
    return $ajax.delete(serverUrl(`child/${id}`))
  },
  // pageIndex, pageSize, name, days
  index (params) {
    return $ajax.get(serverUrl('child'), { params })
  },
  // id
  show ({ id }) {
    return $ajax.get(serverUrl(`child/${id}`))
  },
  // name, days, id
  update ({ id, ...data }) {
    return $ajax.put(serverUrl(`child/${id}`), data)
  },
  // name
  list (params) {
    return $ajax.get(serverUrl('child/list'), { params })
  },
  random (params) {
    return $ajax({
      url: serverUrl('child/random'),
      params,
      timeout: 0
    })
  },
  init () {
    return $ajax.get(serverUrl('child/init'))
  },
  clean () {
    return $ajax.get(serverUrl('child/clean'))
  },
  // download data
  download (params) {
    return $ajax({
      url: serverUrl('child/download'),
      params,
      timeout: 0
    })
  },
  // download data
  data (params) {
    // return $ajax.get(serverUrl('child/data'), { params })
    return $ajax({
      url: serverUrl('child/data'),
      params,
      timeout: 0
    })
  }
}
