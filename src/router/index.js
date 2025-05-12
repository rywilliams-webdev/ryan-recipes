import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RecipeDetailsView from '../views/RecipeDetails.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      props: (route) => ({
        query: route.query.query,
        page: route.query.page,
        cuisine: route.query.cuisine,
      }),
      meta: {
        title: 'Home', // Default title
      },
    },
    {
      path: '/recipe-details/:id',
      name: 'recipe-details',
      component: RecipeDetailsView,
      props: true,
      meta: {
        title: 'Recipe Details', // Default title
      },
    },
  ],
})

// Update document title dynamically
router.afterEach((to) => {
  const defaultTitle = 'Ryan Recipes'
  document.title = defaultTitle + ' | ' + to.meta.title
})

export default router
