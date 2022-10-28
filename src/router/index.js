import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 路由表
const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue')
  },
  {
    path: '',
    // name: 'layout',
    component: () => import('@/views/layout/index.vue'),
    children: [
      {
        path: '/home',  // 默认子路由，只能有一个
        name: 'home',
        component: () => import('@/views/home/index.vue')
      },
      {
        path: 'qa',
        name: 'qa',
        component: () => import('@/views/qa/index.vue')
      },
      {
        path: 'video',
        name: 'video',
        component: () => import('@/views/video/index.vue')
      },
      {
        path: 'my',
        name: 'my',
        component: () => import('@/views/my/index.vue')
      },
    ]
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/search/index.vue')
  },
  {
    path: '/article/:articleId',
    name: 'article',
    component: () => import('@/views/article/index.vue'),
    props: true  // 将路由动态参数映射到组件的 props 中
  },
  {
    path: '/user/profile',
    name: 'user-profile',
    component: () => import('@/views/user-profile'),
   
  },
]

const router = new VueRouter({
  routes
})

export default router
