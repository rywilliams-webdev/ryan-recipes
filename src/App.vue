<script setup>
import { RouterLink, RouterView } from 'vue-router'
import SearchBar from './components/SearchBar.vue'
</script>

<template>
  <header>
    <RouterLink to="/" class="logo-link">
      <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="50" height="50" />
      <h3 class="logo-text">Recipe Finder</h3>
    </RouterLink>
    <SearchBar />
  </header>

  <RouterView />
</template>

<style scoped>
header {
  max-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  place-items: center;
  justify-content: center;
}

.logo {
  display: block;
}

.logo-link {
  display: flex;
  align-items: center;
}

.logo-text {
  margin: 0;
  padding-left: 0.5rem;
}

nav {
  display: flex;
  align-items: center;
}

@media (min-width: 650px) {
  header {
    flex-direction: row;
    place-items: center;
    justify-content: space-between;
  }
}
</style>
