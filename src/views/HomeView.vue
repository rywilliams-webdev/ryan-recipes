<template>
  <main class="recipes page-container">
    <h2>Recipes {{ errorMessage }}</h2>
    <PaginatedList
      :itemsPerPage="itemsPerPage"
      :items="recipeData.results || recipeData.recipes"
      :totalItems="recipeData.totalResults"
      :currentPage="route.query.page ? parseInt(route.query.page) : 1"
      @changePage="changePage($event)"
      class="recipe-list"
    >
      <template #default="{ item }">
        <article class="recipe-card" @click="goToDetails(item.id)" :key="item.id">
          <img :src="item.image" alt="Recipe Image" @error="placeholderImage" />
          <div class="recipe-content">
            <h3>{{ characterLengthFilter(item.title) }}</h3>
          </div>
        </article>
      </template>
    </PaginatedList>
  </main>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PaginatedList from '@/components/PaginatedList.vue'
import { usePlaceholderImage } from '@/composables/usePlaceholderImage.js'
import { API_HEADER } from '@/constants/apiHeader.js'

const CHARACTER_LIMIT = ref(77)

const route = useRoute()
const router = useRouter()
const recipeData = ref({})
const itemsPerPage = ref(5)
const errorMessage = ref('')
const { placeholderImage } = usePlaceholderImage()

defineProps({
  query: {
    type: String,
    required: false,
    default: '',
  },
})

// Refactor idea: Save results in local storage to reduce API calls. Cache must be cleared after 1 hour as per https://spoonacular.com/food-api/faq
const searchRecipe = async (query = '', page = 1, cuisine = '') => {
  let offset = calculateOffset(page)

  // Bug: Searches with over 900 results are not accessible
  // According to the API documentation, offset has a max value limit of 900.
  let url = buildURL(query, cuisine, offset)

  await fetch(url, { headers: API_HEADER })
    .then((res) => res.json())
    .then((json) => {
      recipeData.value = json
      clearErrorMessage()
    })
    .catch((err) => {
      errorMessage.value = err
      setMockData()
    })

  return true
}

const calculateOffset = (page) => {
  let offset = 0
  if (page > 1) {
    offset = (page - 1) * itemsPerPage.value
  }

  return offset
}

// Clear error message
const clearErrorMessage = () => {
  errorMessage.value = ''
}

const setMockData = () => {
  recipeData.value = {
    results: [
      {
        id: 660185,
        title: 'Singapore Curry',
        image: 'https://img.spoonacular.com/recipes/660185-312x231.jpg',
        imageType: 'jpg',
      },
      {
        id: 660913,
        title: 'Special Vegetable Biryani',
        image: 'https://img.spoonacular.com/recipes/660913-312x231.jpg',
        imageType: 'jpg',
      },
      {
        id: 1096211,
        title: 'The Easiest Beef Pho',
        image: 'https://img.spoonacular.com/recipes/1096211-312x231.jpg',
        imageType: 'jpg',
      },
      {
        id: 663150,
        title: 'Thai Savory Brown Fried Rice',
        image: 'https://img.spoonacular.com/recipes/663150-312x231.jpg',
        imageType: 'jpg',
      },
      {
        id: 632812,
        title: 'Asian Chicken and Broccoli With Chili Garlic Sauce',
        image: 'https://img.spoonacular.com/recipes/632812-312x231.jpg',
        imageType: 'jpg',
      },
    ],
    offset: 0,
    number: 5,
    totalResults: 100,
  }
}

const buildURL = (query, cuisine, offset) => {
  const params = []

  if (query) {
    params.push(`query=${query}`)
  }

  if (cuisine) {
    params.push(`cuisine=${cuisine}`)
  }

  if (offset) {
    params.push(`offset=${offset}`)
  }

  params.push(`number=${itemsPerPage.value}`)

  const url = `https://api.spoonacular.com/recipes/complexSearch?${params.join('&')}`
  return url
}

const goToDetails = (id) => {
  router.push({
    name: 'recipe-details',
    params: { id },
  })
}

const changePage = (event) => {
  let cuisine = route.query.cuisine
  let query = route.query.query
  router.push({
    name: 'home',
    query: { query: query, page: event, cuisine: cuisine },
  })
}

const characterLengthFilter = (value) => {
  if (value.length > CHARACTER_LIMIT.value) {
    return value.substring(0, 77) + '...'
  }
  return value
}

// Refactor idea: Load the previous state when the user navigates back
watch(
  () => ({ query: route.query.query, page: route.query.page, cuisine: route.query.cuisine }),
  ({ query, page, cuisine }) => {
    searchRecipe(query, page, cuisine)
  },
  { immediate: true },
)
</script>

<style scoped>
.recipe-list {
  display: flex;
  flex-direction: col;
  gap: 1rem;
}

.recipe-card {
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  margin-bottom: 8px;
  height: 250px;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.recipe-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
}

.recipe-card img {
  /* some of the images from the api are smaller so upscaling them helps them fit within the card */
  width: 110%;
  height: 164px;
  object-fit: cover;
  margin-left: -20px;
}

.recipe-content {
  padding: 1rem;
  text-align: center;
  margin: auto;
}
</style>
