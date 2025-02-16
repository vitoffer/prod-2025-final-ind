<script setup lang="ts">
import type { Exercise } from '@/types'
import { computed } from 'vue'

const props = defineProps<{ exercise: Exercise }>()

interface ExerciseInfoObject {
  type: 'video' | 'photo' | 'text'
  src?: string
  text?: string
}

const infoComponentsList = computed<ExerciseInfoObject[]>(() => {
  const list: ExerciseInfoObject[] = []
  if (props.exercise.videoUrl !== null) {
    list.push({ type: 'video', src: props.exercise.videoUrl })
  }
  if (props.exercise.photoUrlList.length !== 0) {
    list.push(
      ...props.exercise.photoUrlList.map((url: string) => {
        return { type: 'photo', src: url } as ExerciseInfoObject
      }),
    )
  }
  if (props.exercise.description !== null) {
    list.push({ type: 'text', text: props.exercise.description })
  }
  return list
})
</script>

<template>
  <Galleria
    :value="infoComponentsList"
    circular
    :showThumbnails="false"
    showItemNavigators
    showItemNavigatorsOnHover
    showIndicators
    showIndicatorsOnItem
  >
    <template #item="slotProps">
      <div class="flex h-[250px] w-[100%] items-center">
        <iframe
          v-if="slotProps.item.type === 'video'"
          class="aspect-video w-[100%] rounded-xl"
          :src="slotProps.item.src"
          frameBorder="0"
          allow="clipboard-write; autoplay"
          allowfullscreen
        ></iframe>
        <img
          v-else-if="slotProps.item.type === 'photo'"
          :src="slotProps.item.src"
          alt="Картинка упражнения"
        />
        <p v-else-if="slotProps.item.type === 'text'" class="self-start text-lg">
          {{ slotProps.item.text }}
        </p>
      </div>
    </template>
  </Galleria>
</template>

<style scoped></style>
