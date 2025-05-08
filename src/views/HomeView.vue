<template>
  <section class="recipes">
    <h2>Recipes {{ getRecipeError }}</h2>
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
  </section>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PaginatedList from '@/components/PaginatedList.vue'
import { usePlaceholderImage } from '@/composables/usePlaceholderImage.js'

const route = useRoute()
const router = useRouter()
const characterLimit = ref(77)
const recipeData = ref({})
const itemsPerPage = ref(5)
const getRecipeError = ref('')
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
  let offset = 0
  if (page > 1) {
    offset = (page - 1) * itemsPerPage.value
  }

  // Bug: Searches with over 900 results are not accessible
  // According to the API documentation, offset has a max value limit of 900.

  let url = buildURL(query, cuisine, offset)

  try {
    const response = await fetch(url, {
      headers: {
        'x-api-key': '7dd2f4965dbc42eb8f70a57ef71b8e36',
      },
    })

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    const data = await response.json()

    if (data.results) {
      recipeData.value = data
    } else if (data.recipes) {
      recipeData.value = data
    }
  } catch (error) {
    console.error('Error fetching recipes:', error)
    console.log('Using mock data instead')
    getRecipeError.value = 'Failed to fetch recipes. Using mock data instead.'
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
}

const buildURL = (query, cuisine, offset) => {
  let count = 0
  let url = `https://api.spoonacular.com/recipes/complexSearch?`

  if (query) {
    url += `query=${query}`
    count++
  }

  if (cuisine) {
    if (count > 0) {
      url += `&`
    }
    url += `cuisine=${cuisine}`
    count++
  }

  if (offset) {
    if (count > 0) {
      url += `&`
    }
    url += `offset=${offset}`
    count++
  }

  if (count > 0) {
    url += `&`
  }
  url += `number=${itemsPerPage.value}`
  count++

  return url
}

const goToDetails = (id) => {
  console.log(id)
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
  if (value.length > characterLimit.value) {
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
