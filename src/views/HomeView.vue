<script setup>
import router from '@/router'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const recipes = ref([])

const props = defineProps({
  query: {
    type: String,
    default: null,
  },
})

const route = useRoute()

// Refactor idea: Load the previous state when the user navigates back
watch(() => route.params.query, searchRecipe, { immediate: true })

async function searchRecipe() {
  let url = props.query
    ? `https://api.spoonacular.com/recipes/complexSearch?query=${props.query}&number=5`
    : `https://api.spoonacular.com/recipes/random`

  console.log(url)
  try {
    const response = await fetch(url, {
      headers: {
        'x-api-key': import.meta.env.VITE_API_KEY,
      },
    })

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    const data = await response.json()

    if (data.results) {
      recipes.value = data.results
    } else if (data.recipes) {
      recipes.value = data.recipes
    }
  } catch (error) {
    console.error('Error fetching recipes:', error)
  }
}

const goToDetails = (id) => {
  router.push({
    name: 'recipe-details',
    params: { id },
  })
}
</script>

<template>
  <main>
    <!-- Search Bar -->

    <!-- Recipes -->
    <section class="recipes">
      <h2>Recipes</h2>
      <ul>
        <li v-for="recipe in recipes" :key="recipe.id">
          <img :src="recipe.image" alt="Recipe Image" />
          <h3 @click="goToDetails(recipe.id)">{{ recipe.title }}</h3>
        </li>
      </ul>
    </section>
  </main>
</template>
