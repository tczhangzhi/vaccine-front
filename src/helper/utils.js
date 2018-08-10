import _ from 'lodash'

function serverUrl (path) {
  return `/api/${path}`
}

function setPath (obj, path = [], value) {
  if (!path || !path.length) {
    return obj
  }

  if (!obj) {
    obj = {}
  }

  let child = obj
  let leafPathName = path.pop()

  path.forEach((pathName) => {
    if (!child[pathName]) {
      child[pathName] = {}
    }

    child = child[pathName]
  })
  child[leafPathName] = value
}

function namespacesLeafType (result, types, ancestors = [], sep = '.') {
  for (let key in types) {
    let value = types[key]
    let newAncestors = ancestors.slice()

    newAncestors.push(key)

    if (!value) {
      continue
    }

    if (typeof value === 'string') {
      let path = newAncestors.slice()
      newAncestors.push(value)
      let namespaceValue = newAncestors.join(sep)

      setPath(result, path, namespaceValue)
    } else {
      namespacesLeafType(result, value, newAncestors)
    }
  }
}

function importStoreTypes (types) {
  var result = _.cloneDeep(types)
  namespacesLeafType(result, types)
  Object.freeze(result)
  return result
}

export default {
  serverUrl,
  importStoreTypes
}
