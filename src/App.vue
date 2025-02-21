<script setup lang="ts">
import AppNav from './components/AppNav.vue'
</script>

<template>
  <div class="relative flex flex-col">
    <AppNav />

    <div class="mb-[50px] sm:order-1 sm:mb-0">
      <RouterView></RouterView>
    </div>
  </div>
</template>

<style scoped></style>
