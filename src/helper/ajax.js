import axios from 'axios'
import Cookies from 'js-cookie'

axios.defaults.timeout = 1000 * 60 * 60
axios.defaults.headers['x-csrf-token'] = Cookies.get('csrfToken')

// Add a request interceptor
axios.interceptors.request.use(config => {
  // Do something before request is sent
  if (process.env.NODE_ENV !== 'production') {
    console.log(`${config.method}: ${config.url}, 参数(config): ${JSON.stringify(config)}`)
  }
  return config
}, error => {
  // Do something with request error
  return Promise.reject(error.response.data)
})

// download url
const downloadPost = (config) => {
  const url = config.url
  const data = JSON.parse(config.data)
  const form = document.createElement('form')
  form.action = url
  form.method = 'post'
  form.style.display = 'none'
  Object.keys(data).forEach(key => {
    const input = document.createElement('input')
    input.name = key
    input.value = data[key]
    form.appendChild(input)
  })
  const button = document.createElement('input')
  button.type = 'submit'
  form.appendChild(button)
  document.body.appendChild(form)
  form.submit()
  document.body.removeChild(form)
}
const downloadGet = (config) => {
  const params = []
  for (const item in config.params) {
    params.push(`${item}=${config.params[item]}`)
  }
  const url = params.length ? `${config.url}?${params.join('&')}` : `${config.url}`
  let iframe = document.createElement('iframe')
  iframe.style.display = 'none'
  iframe.src = url
  iframe.onload = function () {
    document.body.removeChild(iframe)
  }
  document.body.appendChild(iframe)
}

// Add a response interceptor
axios.interceptors.response.use(res => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`${res.config.method}: ${res.config.url}, 返回(data): ${JSON.stringify(res.data)}`)
  }
  // Do something with response data
  if (res.headers && res.headers['content-type'] === 'application/octet-stream') {
    const config = res.config
    if (config.method === 'post') {
      downloadPost(config)
    } else if (config.method === 'get') {
      downloadGet(config)
    }
    return
  }
  return res.data
}, error => {
  // Do something with response error
  return Promise.reject(error || error.error)
})

export default axios
