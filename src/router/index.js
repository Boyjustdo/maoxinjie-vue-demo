import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Login from '@/views/Login.vue'
import Index from  '@/views/Index.vue'
import User from '@/views/user/index.vue'
import Organization from '@/views/organization/index.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login,
      hidden: true
    },
    {
      path: '/index',
      component: Index,
      name: '系统管理',
      iconCls: 'el-icon-message',//图标样式class
      children: [
        { path: '/user/user-index', component: User, name: '用户管理' },
        { path: '/org/user-index', component: Organization, name: '组织机构管理' }
      ]
    },
    {
      path: '/hello',
      name: 'HelloWorld',
      component: HelloWorld,
      hidden: true
    }
  ]
})
