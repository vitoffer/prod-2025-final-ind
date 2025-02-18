<script setup lang="ts">
import ExerciseCardInfo from '@/components/ExerciseCardInfo.vue'
import { useExerciseTimer } from '@/composables/run-workout/exerciseTimer'
import { useRestTimer } from '@/composables/run-workout/restTimer'
import { useRunWorkoutStore } from '@/stores/runWorkoutStore'
import type { ExerciseWithGoal } from '@/types'
import { computed, ref } from 'vue'

const runWorkoutStore = useRunWorkoutStore()

const currentExerciseIndex = ref<number>(0)

const currentExercise = ref<ExerciseWithGoal | null>(
  runWorkoutStore.selectedRunWorkout!.exercises[currentExerciseIndex.value],
)
const restTime = ref<boolean>(false)

const workoutCompleted = ref<boolean>(false)

const completeExercise = () => {
  if (currentExerciseIndex.value === runWorkoutStore.selectedRunWorkout!.exercises.length - 1) {
    workoutCompleted.value = true
    elapsedWorkoutTime.value = new Date().getTime() - startWorkoutTime
    return
  }
  if (!restTime.value) {
    restTime.value = true
    currentExercise.value = null
    return
  }
}

const completeRest = () => {
  currentExerciseIndex.value++
  currentExercise.value = runWorkoutStore.selectedRunWorkout!.exercises[currentExerciseIndex.value]
  restTime.value = false
}

const startWorkoutTime = new Date().getTime()
const elapsedWorkoutTime = ref<number | null>(null)
const formattedElapsedWorkoutTime = computed<string>(() => {
  return workoutCompleted.value
    ? `${Math.trunc(elapsedWorkoutTime.value! / 1000 / 60)} мин, ${Math.ceil((elapsedWorkoutTime.value! / 1000) % 60)} сек`
    : ''
})

const {
  formattedRemainingExerciseTime,
  exerciseTimerId,
  startExerciseTimer,
  remainingExerciseTime,
} = useExerciseTimer(currentExercise)
const { formattedRemainingRestTime } = useRestTimer(currentExercise, completeRest)
const formattedUnitsToComplete = computed<string>(() => {
  if (!currentExercise.value) return ''
  if (currentExercise.value.units.includes('кг') && currentExercise.value.units.includes('повт')) {
    return `${currentExercise.value.goal.repetitions} повт по ${currentExercise.value.goal.weight} кг`
  }
  if (currentExercise.value.units.includes('кг')) {
    return `1 повт по ${currentExercise.value.goal.weight} кг`
  }
  if (currentExercise.value.units.includes('повт')) {
    return `${currentExercise.value.goal.repetitions} повт`
  }
  return ''
})
</script>

<template>
  <div v-if="workoutCompleted">
    <p>Тренировка закончена. Она длилась: {{ formattedElapsedWorkoutTime }}</p>
  </div>
  <div v-else-if="currentExercise" class="exercise-container">
    <p>{{ currentExercise.name }}</p>
    <div class="wrapper h-[250px] w-[450px]">
      <ExerciseCardInfo :exercise="currentExercise" />
    </div>
    <div v-if="currentExercise.units.includes('мин')" class="timer">
      <Button v-if="!exerciseTimerId && remainingExerciseTime !== 0" @click="startExerciseTimer"
        >Начать упражнение: {{ currentExercise.goal.time }} секунд</Button
      >
      <Button v-else-if="!exerciseTimerId && remainingExerciseTime === 0" @click="completeExercise"
        >Далее</Button
      >
      <p v-else>Осталось: {{ formattedRemainingExerciseTime }}</p>
    </div>
    <div v-if="!currentExercise.units.includes('мин')">
      {{ formattedUnitsToComplete }}
      <Button severity="success" @click="completeExercise">Готово</Button>
    </div>
  </div>
  <div v-else class="rest-container">Отдых {{ formattedRemainingRestTime }}</div>
</template>

<style scoped></style>
