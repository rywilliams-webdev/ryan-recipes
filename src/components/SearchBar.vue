<template>
  <form @submit.prevent="searchRecipe(query)">
    <input v-model="query" type="text" placeholder="Enter recipe name..." />
    <button type="submit">Search</button>
  </form>
</template>

<script setup>
import router from '@/router'
import { ref } from 'vue'

const query = ref('')

const searchRecipe = (query) => {
  if (query) {
    router.push({
      name: 'home',
      params: { query },
    })
  }
}
</script>
