import Frame from '@page/Frame'

export default [
  {
    path: '/',
    component: Frame,
    redirect: '/child',
    children: [{
      path: '/child',
      name: 'Child',
      meta: {
        title: '儿童管理',
        ignoreAuth: true
      },
      component: resolve => require(['@page/child/Index'], resolve)
    },
    {
      path: '/inoculation',
      name: 'Inoculation',
      meta: {
        title: '接种管理',
        ignoreAuth: true
      },
      component: resolve => require(['@page/inoculation/Index'], resolve)
    },
    {
      path: '/algorithm',
      name: 'Algorithm',
      meta: {
        title: '算法可视化',
        ignoreAuth: true
      },
      component: resolve => require(['@page/algorithm/Index'], resolve)
    },
    {
      path: '/vaccine',
      name: 'Vaccine',
      meta: {
        title: '疫苗管理',
        ignoreAuth: false
      },
      component: resolve => require(['@page/vaccine/Index'], resolve)
    },
    {
      path: '/config',
      name: 'Config',
      meta: {
        title: '设置管理',
        ignoreAuth: true
      },
      component: resolve => require(['@page/config/Index'], resolve)
    }]
  }
]
