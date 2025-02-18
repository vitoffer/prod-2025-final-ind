<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'

defineProps<{ src: string }>()

const isLoaded = ref(false)
const hasError = ref(false)

const handleIframeLoad = async () => {
  if (!firstLoad.value) return

  clearTimeout(timeoutId.value)

  isLoaded.value = true
  hasError.value = false
}

const handleIframeError = () => {
  clearTimeout(timeoutId.value)

  isLoaded.value = false
  hasError.value = true
}

const iframe = useTemplateRef('iframe')
const firstLoad = ref(true)
const timeoutId = ref(
  setTimeout(() => {
    isLoaded.value = false
    hasError.value = true
    if (!iframe.value) return
    firstLoad.value = false
    iframe.value.src = ''
  }, 3000),
)
</script>

<template>
  <div class="flex items-center justify-center">
    <p v-if="hasError" class="text-center">
      Ошибка загрузки контента. Пожалуйста, проверьте ссылку или попробуйте позже.
    </p>
    <p v-else-if="!isLoaded" class="text-center">Загрузка...</p>
    <iframe
      v-show="isLoaded && !hasError"
      :src="src"
      @load="handleIframeLoad"
      @error="handleIframeError"
      allowfullscreen
      title="Видео плеер"
      :class="$attrs.class"
      ref="iframe"
    />
  </div>
</template>

<style scoped></style>
