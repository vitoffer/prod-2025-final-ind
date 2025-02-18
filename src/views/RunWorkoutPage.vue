<script setup lang="ts">
import ExerciseCardInfo from '@/components/ExerciseCardInfo.vue'
import { useExerciseTimer } from '@/composables/run-workout/exerciseTimer'
import { useRunWorkoutStore } from '@/stores/runWorkoutStore'
import type { ExerciseWithGoal } from '@/types'
import { computed, ref } from 'vue'

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

const { formattedRemainingExerciseTime } = useExerciseTimer(currentExercise)
</script>

<template>
  <p>{{ currentExercise.name }}</p>
  <div class="wrapper h-[250px] w-[450px]">
    <ExerciseCardInfo :exercise="currentExercise" />
  </div>
  <div v-if="currentExercise.units.includes('мин')" class="timer">
    Осталось: {{ formattedRemainingExerciseTime }}
  </div>
  <div v-if="!currentExercise.units.includes('мин')">
    <Button severity="success" @click="completeExercise">Готово</Button>
  </div>
  <p>{{ workoutCompleted ? elapsedWorkoutTime : '' }}</p>
</template>

<style scoped></style>
