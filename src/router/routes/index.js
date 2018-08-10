const files = require.context('.', true, /\.js$/)

var routesMap = []

files.keys().forEach((key) => {
  if (key === './index.js') return
  routesMap = routesMap.concat(files(key).default)
})
export default routesMap
