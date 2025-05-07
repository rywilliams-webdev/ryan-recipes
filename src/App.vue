<script setup>
import { RouterLink, RouterView } from 'vue-router'
import SearchBar from './components/SearchBar.vue'
</script>

<template>
  <header>
    <RouterLink to="/" class="logo-link">
      <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="50" height="50" />
      <p class="logo-text">Recipe Finder</p>
    </RouterLink>
    <SearchBar />
  </header>

  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
  display: flex;
  place-items: center;
  padding-right: calc(var(--section-gap) / 2);
  justify-content: space-between;
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

@media (min-width: 1024px) {
}
</style>
