import $ajax from '../ajax'
import $utils from '../utils'

let serverUrl = $utils.serverUrl

export default {
  // scheduling
  create (data) {
    return $ajax.post(serverUrl('config'), data)
  },
  // scheduling
  destroy ({ id }) {
    return $ajax.delete(serverUrl(`config/${id}`))
  },
  // pageIndex, pageSize, times
  index (params) {
    return $ajax.get(serverUrl('config'), { params })
  },
  // id
  show ({ id }) {
    return $ajax.get(serverUrl(`config/${id}`))
  },
  // scheduling, id
  update ({ id, ...data }) {
    return $ajax.put(serverUrl(`config/${id}`), data)
  },
  // id
  list (params) {
    return $ajax.get(serverUrl('config/list'), { params })
  }
}
