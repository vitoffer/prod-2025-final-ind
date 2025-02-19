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

const skippedExercisesIndexes = ref<number[]>([])

const skipExercise = () => {
  skippedExercisesIndexes.value.push(currentExerciseIndex.value)
  completeExercise()
}

const {
  formattedRemainingExerciseTime,
  exerciseTimerId,
  startExerciseTimer,
  remainingExerciseTime,
} = useExerciseTimer(currentExercise)
const { formattedRemainingRestTime, increaseRemainingRestTime, decreaseRemainingRestTime } =
  useRestTimer(currentExercise, completeRest)
const formattedUnitsToComplete = computed<string>(() => {
  if (!currentExercise.value) return ''
  let formattedString = ''
  if (currentExercise.value.unitsList.includes('подходы')) {
    formattedString += `${currentExercise.value.goal.sets} подходов`
  }
  if (currentExercise.value.unitsList.includes('повторения')) {
    formattedString += ` по ${currentExercise.value.goal.repetitions} повторений`
  }
  if (currentExercise.value.unitsList.includes('вес')) {
    formattedString += ` по ${currentExercise.value.goal.weightKg} кг`
  }
  if (currentExercise.value.unitsList.includes('время')) {
    formattedString += ` по ${currentExercise.value.goal.time!.seconds} секунд`
  }
  return formattedString
})

const formattedWorkoutInfo = computed<string>(() => {
  if (!workoutCompleted.value) return ''
  const completedExercises =
    runWorkoutStore.selectedRunWorkout?.exercises.filter((exercise, index) => {
      return !skippedExercisesIndexes.value.includes(index)
    }) || []

  const completedTimeExercises = completedExercises.filter((exercise) =>
    exercise.unitsList.includes('время'),
  )
  const completedRepetitionsExercises = completedExercises.filter((exercise) =>
    exercise.unitsList.includes('повторения'),
  )
  const completedUnits = {
    time: completedTimeExercises.reduce((sum, exercise) => {
      return sum + exercise.goal.time!.seconds
    }, 0),
    repetitions: completedRepetitionsExercises.reduce((sum, exercise) => {
      return sum + exercise.goal.repetitions!
    }, 0),
  }
  return `На упражнения потрачено: ${completedUnits.time} секунд.\n Повторений сделано: ${completedUnits.repetitions}`
})
</script>

<template>
  <div v-if="workoutCompleted">
    <p>Тренировка закончена. Она длилась: {{ formattedElapsedWorkoutTime }}</p>
    <p>Информация о тренировке:</p>
    <p>{{ formattedWorkoutInfo }}</p>
  </div>
  <div v-else-if="currentExercise" class="exercise-container">
    <p>{{ currentExercise.name }}</p>
    <div class="wrapper h-[250px] w-[450px]">
      <ExerciseCardInfo :exercise="currentExercise" />
    </div>
    <div v-if="currentExercise.unitsList.includes('время')" class="timer">
      <Button v-if="!exerciseTimerId && remainingExerciseTime !== 0" @click="startExerciseTimer"
        >Начать упражнение: {{ currentExercise.goal.time }} секунд</Button
      >
      <Button v-else-if="!exerciseTimerId && remainingExerciseTime === 0" @click="completeExercise"
        >Далее</Button
      >
      <p v-else>Осталось: {{ formattedRemainingExerciseTime }}</p>
    </div>
    <div v-if="!currentExercise.unitsList.includes('время')">
      {{ formattedUnitsToComplete }}
      <Button severity="success" @click="completeExercise">Готово</Button>
    </div>
    <Button @click="skipExercise">Пропустить упражнение</Button>
  </div>
  <div v-else class="rest-container">
    <p>Отдых {{ formattedRemainingRestTime }}</p>
    <Button @click="increaseRemainingRestTime">+10 сек</Button>
    <Button @click="decreaseRemainingRestTime">-10 сек</Button>
  </div>
</template>

<style scoped></style>
