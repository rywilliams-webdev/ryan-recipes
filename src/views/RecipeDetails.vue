<template>
  <main v-if="!errorMessage">
    <!-- Details -->
    <section class="header">
      <!-- Refactor idea: Add breadcrumbs to the main header for clarity + extra navigation -->

      <h1><span class="btn-back" @click="router.go(-1)">Back</span>Recipe Details</h1>
      <h2 class="recipe-title">{{ recipe.title }}</h2>
    </section>

    <img class="recipe-image" :src="recipe.image" alt="Recipe Image" @error="placeholderImage" />
    <!-- Health Details -->
    <div class="health-details">
      <h3>Health Details</h3>
      <ul>
        <li :class="{ 'not-included': !recipe.dairyFree }">Dairy Free</li>
        <li :class="{ 'not-included': !recipe.glutenFree }">Gluten Free</li>
        <li :class="{ 'not-included': !recipe.vegan }">Vegan</li>
        <li :class="{ 'not-included': !recipe.vegetarian }">Vegetarian</li>
      </ul>
    </div>

    <!-- Ingredients -->
    <section class="ingredients">
      <h3>Ingredients</h3>
      <ul>
        <li v-for="ingredient in recipe.extendedIngredients" :key="ingredient.id">
          {{ ingredient.original }}
        </li>
      </ul>
    </section>

    <!-- Cooking Instructions -->
    <article class="instructions">
      <h3>Cooking Instructions</h3>
      <!-- Bug: Some of the recipes are causing the lists to have double numbers -->
      <!-- Need to sanitize the data -->
      <div v-html="recipe.instructions"></div>
    </article>
  </main>
  <p v-else class="error-message">{{ errorMessage }}</p>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePlaceholderImage } from '@/composables/usePlaceholderImage.js'

const props = defineProps({
  id: String,
})

const router = useRouter()
const recipe = ref({})
const errorMessage = ref('')
const { placeholderImage } = usePlaceholderImage()

// Fetch recipe details when the component is mounted
onMounted(() => {
  fetchRecipeDetails(props.id)
})

const fetchRecipeDetails = async (id) => {
  try {
    const response = await fetch(`https://api.spoonacular.com/recipes/${id}/information`, {
      headers: {
        // Not secure... Should be stored in .env file and managed in the backend
        'x-api-key': '7dd2f4965dbc42eb8f70a57ef71b8e36',
      },
    })

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    const data = await response.json()
    recipe.value = data
    errorMessage.value = ''
  } catch (error) {
    console.error('Error fetching recipe details:', error)
    errorMessage.value = 'Failed to fetch recipe details. Please try again later.'
  }
}
</script>

<style scoped>
img {
  width: 100%;
  height: auto;
}
.btn-back {
  cursor: pointer;
  font-size: 1.2rem;
  margin-right: 4px;
}
.recipe-title {
  color: hsl(160, 100%, 37%);
}

.health-details ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  gap: 3px;
}

.health-details li {
  background-color: hsl(160, 100%, 37%);
  color: white;
  padding: 4px;
  border-radius: 4px;
}

.health-details li.not-included {
  text-decoration: line-through;
  background-color: hsl(0, 70%, 74%);
  color: white;
}

@media (min-width: 875px) {
  main {
    display: grid;
    grid-template-columns: 2fr 1fr;
    grid-template-rows: auto;
    grid-template-areas:
      'header header'
      'image ingredients'
      'health ingredients'
      'instructions instructions';
    gap: 1rem;
  }

  .header {
    grid-area: header;
  }
  .recipe-image {
    grid-area: image;
    width: 100%;
    height: auto;
  }
  .ingredients {
    grid-area: ingredients;
    background-color: hsl(160, 100%, 37%);
    color: white;
    padding: 1rem;
    border-radius: 4px;
  }
  .health-details {
    grid-area: health;
    padding: 1rem;
  }
  .instructions {
    grid-area: instructions;
    padding: 1rem;
  }
}
</style>
