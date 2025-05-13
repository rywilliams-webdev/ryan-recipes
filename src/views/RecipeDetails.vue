<template>
  <main class="page-container" v-if="!errorMessage">
    <!-- Details -->
    <section class="header">
      <!-- Refactor idea: Add breadcrumbs to the main header for clarity + extra navigation -->

      <a class="btn-back" @click="router.go(-1)">Back</a>
      <h1 class="recipe-title">{{ recipe.title }}</h1>
    </section>

    <img class="recipe-image" :src="recipe.image" alt="Recipe Image" @error="placeholderImage" />
    <!-- Health Details -->
    <article class="health-details">
      <h3>Health Details</h3>
      <ul>
        <li :class="{ 'not-included': !recipe.dairyFree }">Dairy Free</li>
        <li :class="{ 'not-included': !recipe.glutenFree }">Gluten Free</li>
        <li :class="{ 'not-included': !recipe.vegan }">Vegan</li>
        <li :class="{ 'not-included': !recipe.vegetarian }">Vegetarian</li>
      </ul>
    </article>

    <!-- Ingredients -->
    <article class="ingredients">
      <h3>Ingredients</h3>
      <ul>
        <li v-for="ingredient in recipe.extendedIngredients" :key="ingredient.id">
          {{ ingredient.original }}
        </li>
      </ul>
    </article>

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
import { API_HEADER } from '@/constants/apiHeader'

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
  let url = `https://api.spoonacular.com/recipes/${id}/information`

  fetch(url, { headers: API_HEADER })
    .then((res) => res.json())
    .then((json) => {
      recipe.value = json
      clearErrorMessage()
    })
    .catch((err) => (errorMessage.value = err))
}

// Clear error message
const clearErrorMessage = () => {
  errorMessage.value = ''
}
</script>

<style scoped>
img {
  width: 100%;
  height: auto;
}

h1 {
  font-size: 1.7rem;
}

h2 {
  font-size: 1.3rem;
  margin: 0;
}

h3 {
  color: hsl(160, 100%, 37%);
}

article {
  margin-bottom: 15px;
}
.btn-back {
  cursor: pointer;
  font-size: 0.8rem;
  margin-right: 4px;
  color: black;
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
    grid-template-rows: auto 60px auto;
    grid-template-areas:
      'header header'
      'image health'
      'image ingredients'
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
    background-color: hsla(160, 100%, 37%, 0.164);
    padding: 1rem;
    border-radius: 4px;
  }
  .health-details {
    grid-area: health;
    padding: 0 1rem;
  }
  .health-details h3 {
    line-height: 1;
    margin-bottom: 10px;
  }

  .instructions {
    grid-area: instructions;
    padding: 1rem;
  }
}
</style>
