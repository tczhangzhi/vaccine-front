import { $utils } from '@helper'

const files = require.context('.', true, /^\.\/modules.*\.json$/)

var allTypesMap = {}

files.keys().forEach((key) => {
  if (key.split('/').length === 4) {
    var moduleName = Object.keys(files(key))[0]
    allTypesMap[moduleName] = $utils.importStoreTypes(files(key))[moduleName]
  }
})

export default allTypesMap
