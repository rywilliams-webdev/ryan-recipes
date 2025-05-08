<template>
  <form @submit.prevent="searchRecipe(query)">
    <div class="dropdown-toggle btn-primary" @click.stop="toggleDropdown">Select Cuisines</div>
    <section class="search-bar-container">
      <!-- Cuisine Selector -->
      <!-- Refactor Idea: Improve the UX by adding pills to the page to show which cuisines are selected when the dropdown is closed -->
      <ul v-if="isOpen" class="dropdown-menu">
        <li v-for="cuisine in cuisines" :key="cuisine">
          <label>
            <input
              type="checkbox"
              :value="cuisine"
              v-model="selectedCuisines"
              @change="errorMessage = null"
            />
            {{ cuisine }}
          </label>
        </li>
        <div class="dropdown-buttons">
          <button type="button" class="btn-secondary" @click="clearSelection">Clear</button>
          <button type="button" class="btn-primary" @click="saveSelection">Close</button>
        </div>
      </ul>
      <!-- Search Bar -->
      <div class="search-bar">
        <input
          v-model="query"
          class="recipe-input"
          type="text"
          placeholder="Enter recipe name..."
          @input="errorMessage = null"
        />
        <button type="submit" class="search-button btn-primary">Search</button>
        <p v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </p>
      </div>
    </section>
  </form>
</template>

<script setup>
import router from '@/router'
import { onMounted } from 'vue'
import { ref } from 'vue'

const isOpen = ref(false)
const selectedCuisines = ref([])
const errorMessage = ref('')
const query = ref('')

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

onMounted(() => {
  // On refershes, set the selected cuisines and query from the URL params
  // Refactor idea: Use Pinia to manage state and persist it across components
  const params = new URLSearchParams(window.location.search)
  const cuisine = params.get('cuisine')
  const search = params.get('query')
  if (cuisine) {
    selectedCuisines.value = cuisine.split(',')
  }
  if (search) {
    query.value = search
  }
})

const cuisines = ref([
  'African',
  'Asian',
  'American',
  'British',
  'Cajun',
  'Caribbean',
  'Chinese',
  'Eastern European',
  'European',
  'French',
  'German',
  'Greek',
  'Indian',
  'Irish',
  'Italian',
  'Japanese',
  'Jewish',
  'Korean',
  'Latin American',
  'Mediterranean',
  'Mexican',
  'Middle Eastern',
  'Nordic',
  'Southern',
  'Spanish',
  'Thai',
  'Vietnamese',
])

const searchRecipe = (query) => {
  // Note: Hitting search button without entering a recipe name or selecting a cuisine feels fine
  // if (!query && selectedCuisines.value.length === 0) {
  //   errorMessage.value = 'Please enter a recipe name and/or select a cuisine.'
  //   return
  // }

  const cuisines = selectedCuisines.value.join(',')
  const queryObject = constructQueryObject(query, cuisines)

  router.push({
    name: 'home',
    query: queryObject,
  })
}

const constructQueryObject = (query, cuisines) => {
  let queryObject = {}

  if (query) {
    queryObject.query = query
  }
  if (cuisines) {
    queryObject.cuisine = cuisines
  }

  return queryObject
}

const clearSelection = () => {
  selectedCuisines.value = []
}

const saveSelection = () => {
  isOpen.value = false
}
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
}

.search-bar-container {
  display: flex;
  align-items: center;
  width: 100%;
}

.dropdown-toggle {
  min-width: 132px;
  margin-bottom: 4px;
  cursor: pointer;
  display: inline-block;
  text-align: center;
}

.dropdown-menu {
  list-style: none;
  padding: 1rem;
  margin: 0;
  position: absolute;
  top: 15%;
  width: 100%;
  right: 0;
  z-index: 1000;
  display: grid;
  grid-template-columns: 1fr 1fr;
  background-color: hsl(160, 100%, 37%);
  color: white;
  border-radius: 4px;
}

.dropdown-menu li {
  margin: 0;
}

.dropdown-menu label {
  display: block;
  cursor: pointer;
}

.dropdown-buttons {
  display: flex;
  justify-content: end;
  gap: 10px;
  margin-top: 1rem;
}

.btn-secondary,
.btn-primary {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.158);
  cursor: pointer;
}
.btn-primary {
  background-color: hsl(160, 100%, 37%);
  color: white;
  border: 1px solid hsla(160, 83%, 28%, 0.377);
}
.btn-secondary {
  background-color: white;
  color: hsl(160, 100%, 37%);
  border: 1px solid hsl(160, 100%, 37%);
}

.search-bar {
  position: relative;
}

.recipe-input {
  border-radius: 4px;
  border: 1px solid hsl(160, 100%, 37%);
  width: auto;
}
.recipe-input:focus {
  outline-color: hsl(160, 83%, 28%);
}

.search-button {
  padding: 1px;
  width: 65px;
  margin: 0;
  margin-left: -5px;
}

.recipe-input,
.search-button,
.dropdown-toggle {
  height: 33px;
  padding: 3px 8px;
}

.error-message {
  position: absolute;
  top: 100%;
  left: 0;
  color: red;
  font-size: 0.75rem;
  margin: 0;
  padding-top: 0.25rem;
  width: 110%;
}

@media (min-width: 650px) {
  form {
    flex-direction: row;
  }

  .dropdown-menu {
    top: 10%;
    left: auto;
    width: 515px;
  }

  .dropdown-toggle {
    margin-right: 1rem;
    margin-bottom: 0;
  }
}
</style>
