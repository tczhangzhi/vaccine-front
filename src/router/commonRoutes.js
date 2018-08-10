export default [
  {
    path: '/login',
    name: 'Login',
    meta: {
      title: '登录',
      ignoreAuth: true
    },
    component: resolve => require(['@page/Login'], resolve)
  }
]
