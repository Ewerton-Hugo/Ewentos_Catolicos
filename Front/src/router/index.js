/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router/auto'

const routes = [
  {
    path: "/",
    redirect: { path: "index" }, // redirect property
    component: () => import('@/layouts/default/View.vue'),
    children: [
      {
        path: 'index',
        name: 'index',
        component: () => import('@/pages/index.vue'),
      },
      {
        path: 'eventos',
        name: 'eventos',
        component: () => import('@/pages/Eventos.vue'),
      },
      {
        path: 'missas',
        name: 'missas',
        component: () => import('@/pages/Missas.vue'),
      },
      {
        path: 'confissoes',
        name: 'confissoes',
        component: () => import('@/pages/Confissoes.vue'),
      },
    ],
  },
]


const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
