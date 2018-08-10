import $ajax from '../ajax'
import $utils from '../utils'

let serverUrl = $utils.serverUrl

export default {
  // start, end, num, childId
  create (data) {
    return $ajax.post(serverUrl('vaccine'), data)
  },
  // id
  destroy ({ id }) {
    return $ajax.delete(serverUrl(`vaccine/${id}`))
  },
  // pageIndex, pageSize, start, end, num, childId
  index (params) {
    return $ajax.get(serverUrl('vaccine'), { params })
  },
  // id
  show ({ id }) {
    return $ajax.get(serverUrl(`vaccine/${id}`))
  },
  // start, end, num, childId, id
  update ({ id, ...data }) {
    return $ajax.put(serverUrl(`vaccine/${id}`), data)
  }
}
