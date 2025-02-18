<script setup lang="ts">
import ExerciseCardInfo from '@/components/ExerciseCardInfo.vue'
import { useRunWorkoutStore } from '@/stores/runWorkoutStore'
import type { ExerciseWithGoal } from '@/types'
import { computed, ref, watch, watchEffect } from 'vue'

const runWorkoutStore = useRunWorkoutStore()

const currentExerciseIndex = ref<number>(0)
const currentExercise = computed<ExerciseWithGoal>(() => {
  return runWorkoutStore.selectedRunWorkout!.exercises[currentExerciseIndex.value]
})

const workoutCompleted = ref<boolean>(false)

const completeExercise = () => {
  if (currentExerciseIndex.value === runWorkoutStore.selectedRunWorkout!.exercises.length - 1) {
    workoutCompleted.value = true
    elapsedWorkoutTime.value = new Date().getTime() - startWorkoutTime
  } else {
    currentExerciseIndex.value++
  }
}

const startWorkoutTime = new Date().getTime()
const elapsedWorkoutTime = ref<number | null>(null)

const startExerciseTime = ref<number | null>(null)
const endExerciseTime = ref<number | null>(null)

const exercisesListInfo = ref<any>([])

watch(
  () => currentExercise.value,
  () => {
    if (startExerciseTime.value) {
      exercisesListInfo.value[currentExerciseIndex.value] =
        new Date().getTime() - startExerciseTime.value
    }
    if (currentExercise.value.units.includes('мин')) {
      startExerciseTime.value = new Date().getTime()
    } else {
      startExerciseTime.value = null
    }
  },
  { immediate: true },
)

setTimeout(() => {
  completeExercise()
  setTimeout(() => {
    completeExercise()
    // setTimeout(completeExercise, 0)
  }, 2000)
}, 1000)
</script>

<template>
  <p>{{ currentExercise.name }}</p>
  <div class="wrapper h-[250px] w-[450px]">
    <ExerciseCardInfo :exercise="currentExercise" />
  </div>
  <div v-if="currentExercise.units.includes('мин')" class="timer">
    Затраченное время на упражнение:
    {{ Math.ceil((new Date().getTime() - startExerciseTime!) / 1000) }} секунд
  </div>
  <div v-if="!currentExercise.units.includes('мин')">
    <Button severity="success" @click="completeExercise">Готово</Button>
  </div>
  <p>{{ workoutCompleted ? elapsedWorkoutTime : '' }}</p>
</template>

<style scoped></style>
