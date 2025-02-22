<script setup lang="ts">
import { useToast } from 'primevue'
import AppNav from './components/AppNav.vue'
import { watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useGlobalStore } from './stores/globalStore'

const globalStore = useGlobalStore()
const { toasts } = storeToRefs(globalStore)
const toast = useToast()

watch(
  toasts,
  (newToasts) => {
    newToasts.forEach((toastMessage) => {
      toast.add(toastMessage)
      globalStore.deleteToast(toastMessage.id)
    })
  },
  { deep: true },
)
</script>

<template>
  <Toast class="!right-0 !max-w-[100vw] sm:!right-[20px] sm:!max-w-none" />
  <div class="relative flex flex-col">
    <AppNav />

    <div class="mb-[50px] sm:order-1 sm:mb-0">
      <RouterView></RouterView>
    </div>
  </div>
</template>

<style scoped></style>
