import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RecipeDetailsView from '../views/RecipeDetails.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:query?',
      name: 'home',
      component: HomeView,
      props: true,
    },
    {
      path: '/recipe-details/:id',
      name: 'recipe-details',
      component: RecipeDetailsView,
      props: true,
    },
  ],
})

export default router
