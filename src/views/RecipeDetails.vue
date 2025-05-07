<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const props = defineProps({
  id: String,
})

const recipe = ref({})

const fetchRecipeDetails = async (id) => {
  try {
    const response = await fetch(`https://api.spoonacular.com/recipes/${id}/information`, {
      headers: {
        'x-api-key': import.meta.env.VITE_API_KEY,
      },
    })
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    const data = await response.json()
    recipe.value = data
  } catch (error) {
    console.error('Error fetching recipe details:', error)
  }
}

// Fetch recipe details when the component is mounted
onMounted(() => {
  fetchRecipeDetails(props.id)
})
</script>

<template>
  <main>
    <!-- Details -->
    <section class="details">
      <p @click="router.go(-1)">Back</p>
      <h1>Recipe Details</h1>
      <div class="recipe-info">
        <img :src="recipe.image" alt="Recipe Image" />
        <h2>{{ recipe.title }}</h2>
        <!-- Health Details -->
        <div class="health-details">
          <h3>Health Details</h3>
          <ul>
            <!-- dairyFree, glutenFree, vegan, vegetarian -->
            <li :class="{ strikethrough: !recipe.dairyFree }">Dairy Free</li>
            <li :class="{ strikethrough: !recipe.glutenFree }">Gluten Free</li>
            <li :class="{ strikethrough: !recipe.vegan }">Vegan</li>
            <li :class="{ strikethrough: !recipe.vegetarian }">Vegetarian</li>
          </ul>
        </div>
      </div>
    </section>

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

    <section class="instructions">
      <h3>Cooking Instructions</h3>
      <div v-html="recipe.instructions"></div>
    </section>
  </main>
</template>

<style scoped>
.strikethrough {
  text-decoration: line-through;
}
</style>
