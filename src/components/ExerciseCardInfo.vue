<script setup lang="ts">
import type { Exercise } from '@/types'
import { computed } from 'vue'
import IframeLoader from './IframeLoader.vue'

const props = defineProps<{ exercise: Exercise }>()

interface ExerciseInfoObject {
  type: 'video' | 'iframe' | 'photo' | 'text'
  src?: string
  text?: string
}

const infoComponentsList = computed<ExerciseInfoObject[]>(() => {
  const list: ExerciseInfoObject[] = []
  if (props.exercise.video !== null) {
    list.push({ type: props.exercise.video.type, src: props.exercise.video.url })
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

const activeIndex = computed<number>(() => {
  if (
    infoComponentsList.value.length > 1 &&
    infoComponentsList.value.find((elem) => elem.type === 'iframe') !== undefined
  )
    return 1

  return 0
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
    :active-index="activeIndex"
  >
    <template #item="slotProps">
      <div class="flex min-h-[192px] w-[100%] items-center">
        <IframeLoader
          v-if="slotProps.item.type === 'iframe'"
          class="w-[100%] rounded-xl"
          :src="slotProps.item.src"
        />
        <video v-else-if="slotProps.item.type === 'video'" controls>
          <source :src="slotProps.item.src" />
        </video>
        <img
          v-else-if="slotProps.item.type === 'photo'"
          :src="slotProps.item.src"
          alt="Картинка упражнения"
        />
        <p v-else-if="slotProps.item.type === 'text'" class="m-3 self-start text-center text-lg">
          {{ slotProps.item.text }}
        </p>
      </div>
    </template>
  </Galleria>
</template>

<style scoped>
:deep(.p-galleria-indicator-list) {
  padding: 6px !important;
}

.p-galleria {
  /* border: 0 solid #00000000 !important; */
  width: 100%;
  height: fit-content;
}
</style>
