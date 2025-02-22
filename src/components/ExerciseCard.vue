<script setup lang="ts">
import type { Exercise } from '@/types'
import ExerciseCardInfo from './ExerciseCardInfo.vue'

defineProps<{ exercise: Exercise }>()
</script>

<template>
  <article
    class="exercise-card flex h-full w-full flex-col rounded-2xl border-3 border-gray-500 pt-3 pr-4 pb-3 pl-4"
  >
    <div class="exercise-name mb-2 text-center text-2xl font-semibold">{{ exercise.name }}</div>
    <div class="wrapper mb-auto flex w-[100%] justify-stretch">
      <ExerciseCardInfo height="200px" :exercise="exercise"></ExerciseCardInfo>
    </div>
    <div class="mt-3">
      <div class="tags-container">
        <ul class="tags-list mb-4 flex flex-nowrap gap-1 overflow-x-auto pb-1">
          <li class="tag tag-difficulty rounded-md border-2 border-sky-400 pr-2 pl-2 text-sky-400">
            {{ exercise.difficulty }}
          </li>
          <li
            v-for="tag in exercise.tags.slice(0, 3)"
            :key="tag"
            class="tag rounded-md border-2 pr-2 pl-2"
          >
            {{ tag }}
          </li>
        </ul>
      </div>
      <ul class="sports-items-list flex flex-wrap gap-1 overflow-x-auto pb-1">
        <li
          v-for="item in exercise.sportsItems.slice(0, 3)"
          :key="item"
          class="sports-item max-w-[100%] rounded-md border-2 pr-2 pl-2"
        >
          {{ item }}
        </li>
      </ul>
    </div>
    <div class="buttons mt-4 flex justify-around">
      <Button
        @click="$emit('changeExercise', exercise.id)"
        severity="warn"
        aria-label="Change exercise"
      >
        <i class="pi pi-pencil" style="font-size: 1.25rem"></i>
      </Button>
      <Button
        @click="$emit('removeExercise', exercise.id)"
        severity="danger"
        aria-label="Remove exercise"
      >
        <i class="pi pi-times-circle" style="font-size: 1.25rem"></i>
      </Button>
    </div>
  </article>
</template>

<style scoped lang="scss">
.exercise-name {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tags-list,
.sports-items-list {
  scrollbar-width: 3px;
  scrollbar-color: var(--color-zinc-700);

  &::-webkit-scrollbar {
    height: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--color-zinc-700);
    border-radius: 2px;
  }
}
</style>
