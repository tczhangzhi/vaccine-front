import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import getters from './getters'
import createLogger from 'vuex/dist/logger'
import createPersistedState from 'vuex-persistedstate'

// modules
import modules from './modules/index'
// install
Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  actions,
  getters,
  modules,
  strict: debug,
  plugins: debug ? [createLogger(), createPersistedState({
    key: 'vaccine_store'
  })] : [createPersistedState()]
})
