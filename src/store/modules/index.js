const files = require.context('.', true, /\/index\.js$/)
const modules = {}

function checkDirModule (path) {
  let sections = path.split('/')
  return sections.length === 3 && sections[sections.length - 1] === 'index.js'
}

files.keys().forEach((key) => {
  if (checkDirModule(key)) {
    modules[key.split('/')[1]] = files(key).default
  }
})

export default modules
