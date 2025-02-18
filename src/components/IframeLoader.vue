<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ src: string }>()

const isLoaded = ref<boolean>(false)
const hasError = ref<boolean>(false)

const handleIframeLoad = async () => {
  isLoaded.value = true
  hasError.value = false
}

const handleIframeError = () => {
  isLoaded.value = false
  hasError.value = true
}
</script>

<template>
  <div class="flex items-center justify-center">
    <div v-if="hasError">
      Ошибка загрузки контента. Пожалуйста, проверьте ссылку или попробуйте позже.
    </div>
    <div v-else-if="!isLoaded">Загрузка...</div>
    <iframe
      v-show="isLoaded && !hasError"
      :src="src"
      @load="handleIframeLoad"
      @error="handleIframeError"
      allowfullscreen
      title="Видео плеер"
      :class="$attrs.class"
    />
  </div>
</template>

<style scoped></style>
