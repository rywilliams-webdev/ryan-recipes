<template>
  <section class="paginated-list-container">
    <ul class="paginated-list">
      <li class="paginated-item" v-for="(item, index) in items" :key="index">
        <slot :item="item" :index="index"></slot>
      </li>
    </ul>
    <ul class="pagination-buttons">
      <!-- Back to first -->
      <li @click="changePage(1)" :disabled="currentPage === 1" class="prev">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5"
          />
        </svg>
      </li>
      <!-- Previous -->
      <li @click="changePage(currentPage - 1)" :disabled="currentPage === 1" class="prev">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        </svg>
      </li>
      <!-- Visible Page Numbers -->
      <li
        v-for="page in visiblePages"
        :key="page"
        :class="{ active: page === currentPage }"
        @click="changePage(page)"
      >
        {{ page }}
      </li>
      <!-- Next -->
      <li
        @click="changePage(currentPage + 1)"
        :disabled="currentPage === pageIndex.length"
        class="next"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
      </li>
      <!-- Go to Last -->
      <li
        @click="changePage(pageIndex.length)"
        :disabled="currentPage === pageIndex.length"
        class="next"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5"
          />
        </svg>
      </li>
    </ul>
    <p>Page {{ currentPage }} of {{ pageCount }}</p>
  </section>
</template>

<style scoped>
.paginated-list-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

ul {
  list-style: none;
  padding: 0;
}

.pagination-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}
.pagination-buttons li {
  cursor: pointer;
  width: 1.75rem;
  height: 1.75rem;
  font-size: 0.9rem;
  border-radius: 50%;
  border: 1px solid transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease;
}
svg {
  width: 15px;
}
.active {
  background-color: hsl(160, 100%, 47%);
}
.pagination-buttons li:hover {
  border: 1px solid hsl(160, 100%, 47%);
}

@media (min-width: 650px) {
  .paginated-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  .paginated-item {
    width: 45%;
  }
}

@media (min-width: 1155px) {
  .paginated-item {
    width: 30%;
  }
}
</style>

<script setup>
import { computed, defineEmits } from 'vue'

const props = defineProps({
  itemsPerPage: {
    type: Number,
  },
  items: {
    type: Array,
    default: () => [],
  },
  totalItems: {
    type: Number,
  },
  currentPage: {
    type: Number,
    default: 1,
  },
  maxVisible: {
    type: Number,
    default: 3,
  },
})

const emit = defineEmits(['changePage'])

const pageIndex = computed(() => {
  const totalPages = Math.ceil(props.totalItems / props.itemsPerPage)
  return Array.from({ length: totalPages }, (_, i) => i + 1)
})

// Returns an array of page numbers to be displayed
const visiblePages = computed(() => {
  const totalPages = pageIndex.value.length
  const start = Math.max(1, props.currentPage - Math.floor(props.maxVisible / 2))
  const end = Math.min(totalPages, start + props.maxVisible - 1)

  // Adjust start if near the end
  const adjustedStart = Math.max(1, end - props.maxVisible + 1)

  return Array.from({ length: end - adjustedStart + 1 }, (_, i) => adjustedStart + i)
})

const pageCount = computed(() => {
  return pageIndex.value.length > 0 ? pageIndex.value.length : 1
})

const changePage = (page) => {
  if (page < 1 || page > pageIndex.value.length) return

  //send the page number to the parent component
  emit('changePage', page)
}
</script>
