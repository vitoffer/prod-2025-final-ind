<script setup lang="ts">
import { useToast, type ToastMessageOptions } from 'primevue'
import AppNav from './components/AppNav.vue'
import { provide } from 'vue'

const toast = useToast()

function showToast(options: ToastMessageOptions) {
  toast.add(options)
}

provide('showToast', showToast)
</script>

<template>
  <Toast />
  <div class="relative flex flex-col">
    <AppNav />

    <div class="mb-[50px] sm:order-1 sm:mb-0">
      <RouterView></RouterView>
    </div>
  </div>
</template>

<style scoped></style>
