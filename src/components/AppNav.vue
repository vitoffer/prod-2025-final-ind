<script setup lang="ts">
const navItems = [
  {
    to: 'ExercisesListPage',
    text: 'Упражнения',
  },
  {
    to: 'WorkoutsListPage',
    text: 'Тренировки',
  },
  {
    to: 'ProfilePage',
    text: 'Профиль',
  },
]
</script>

<template>
  <nav
    class="fixed bottom-0 z-10 order-1 w-full justify-self-end border-t border-t-gray-600 bg-[#121212] p-2 sm:static sm:border-none"
  >
    <ul class="flex justify-center gap-4">
      <li v-for="(item, index) in navItems" :key="index">
        <RouterLink
          :to="{ name: item.to }"
          class="p-button p-button-info p-button mx-auto !block w-fit !pt-1 !pb-1"
          >{{ item.text }}</RouterLink
        >
      </li>
    </ul>
  </nav>
</template>

<style scoped></style>
