import $ajax from '../ajax'
import $utils from '../utils'

let serverUrl = $utils.serverUrl

export default {
  // name, password
  login (data) {
    return $ajax.post(serverUrl('user/login'), data)
  }
}
