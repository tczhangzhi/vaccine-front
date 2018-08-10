import { $utils } from '@helper'
import types from './types'

const {getter, action, mutation} = $utils.importStoreTypes(types).user

/**
 * initial state
 * @user [object]
 *
 */
const state = {
  user: null
}

/**
 * getters
 */
const getters = {
  [getter.user]: state => state.user
}

/**
 * actions
 */
const actions = {
  async [action.update] ({ commit, state }, user) {
    commit(mutation.update, user)
  }
}

/**
 * mutations
 */
const mutations = {
  [mutation.update] (state, user) {
    state.user = user
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
