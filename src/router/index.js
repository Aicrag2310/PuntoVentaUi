/* eslint-disable */
import Vue from 'vue'
import VueRouter from 'vue-router'
import { TokenUtils } from '@/utils/TokenUtils';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'root',
    component: () => {
      if (!TokenUtils.hasToken()) {
        return import('../views/LoginView.vue');
      }

      return null;
    },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../views/Dashboard.vue'),
  },
  {
    path: '/new-product',
    name: 'new-product',
    component: () => import('../views/CreateProduct.vue'),
  },
  {
    path: '/:id/edit-product',
    name: 'edit-product',
    component: () => import('../views/EditProduct.vue'),
  },
  {
    path: '/ventas',
    name: 'ventas',
    component: () => import('../views/VentasView.vue'),
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
