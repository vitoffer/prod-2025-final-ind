<script setup lang="ts">
import ExerciseCardInfo from '@/components/ExerciseCardInfo.vue'
import { useExerciseTimer } from '@/composables/run-workout/exerciseTimer'
import { useRestTimer } from '@/composables/run-workout/restTimer'
import { useRunWorkoutStore } from '@/stores/runWorkoutStore'
import { useUserStore } from '@/stores/userStore'
import { useWorkoutsStore } from '@/stores/workoutsStore'
import type { FilledExercisesWorkout, FilledExerciseWithGoal } from '@/types'
import {
  formattedReps,
  formattedSets,
  formattedStringTime,
  formattedWorkoutData,
  stringifyTime,
} from '@/utils/formatters'
import { getCompletedExercises, getCompletedExercisesUnits } from '@/utils/functions'
import { computed, ref } from 'vue'

const runWorkoutStore = useRunWorkoutStore()
const userStore = useUserStore()
const workoutsStore = useWorkoutsStore()

const currentExerciseIndex = ref<number>(0)

const currentExercise = ref<FilledExerciseWithGoal | null>(
  runWorkoutStore.selectedRunWorkout!.exercises[currentExerciseIndex.value],
)

const restTime = ref<boolean>(false)

const workoutCompleted = ref<boolean>(false)

const completeExercise = (type?: string) => {
  if (exerciseTimerId.value) {
    stopExerciseTimer()
  }
  if (restTimerId.value) {
    stopRestTimer()
  }

  if (currentExerciseIndex.value === runWorkoutStore.selectedRunWorkout!.exercises.length - 1) {
    elapsedWorkoutTime.value = new Date().getTime() - startWorkoutTime
    workoutCompleted.value = true

    const completedWorkout: FilledExercisesWorkout = {
      ...runWorkoutStore.selectedRunWorkout!,
      exercises: getCompletedExercises(
        runWorkoutStore.selectedRunWorkout!,
        skippedExercisesIndexes.value,
      ),
    }

    userStore.pushWorkoutToHistory(completedWorkout)

    return
  }

  if (type === 'skip') {
    nextExercise()
    return
  }

  if (!restTime.value) {
    restTime.value = true
    currentExercise.value = null
    return
  }
}

const completeRest = () => {
  nextExercise()
  restTime.value = false
}

function nextExercise() {
  elapsedExerciseTime.value = 0
  elapsedRestTime.value = 0
  currentExerciseIndex.value++
  currentExercise.value = workoutsStore.getClearedWorkoutExercises(
    runWorkoutStore.selectedRunWorkout!,
  )[currentExerciseIndex.value]
}

const startWorkoutTime = new Date().getTime()
const elapsedWorkoutTime = ref<number | null>(null)
const formattedElapsedWorkoutTime = computed<string>(() => {
  if (elapsedWorkoutTime.value === null) return ''
  return workoutCompleted.value
    ? formattedStringTime(
        Math.floor(elapsedWorkoutTime.value / 1000 / 60),
        Math.ceil((elapsedWorkoutTime.value / 1000) % 60),
      )
    : ''
})

const skippedExercisesIndexes = ref<number[]>([])

const skipExercise = () => {
  skippedExercisesIndexes.value.push(currentExerciseIndex.value)
  completeExercise('skip')
}

const {
  formattedRemainingExerciseTime,
  exerciseTimerId,
  startExerciseTimer,
  remainingExerciseTime,
  stopTimer: stopExerciseTimer,
  elapsedExerciseTime,
} = useExerciseTimer(currentExercise)

const {
  restTimerId,
  formattedRemainingRestTime,
  increaseRemainingRestTime,
  decreaseRemainingRestTime,
  stopTimer: stopRestTimer,
  elapsedRestTime,
} = useRestTimer(currentExercise, completeRest)

const formattedUnitsToComplete = computed<string>(() => {
  if (!currentExercise.value) return ''

  let formattedString = ''
  let numUnits = 0

  if ('time' in currentExercise.value.goal) {
    formattedString += `${numUnits ? ' по ' : ''}`
    formattedString += stringifyTime(currentExercise.value.goal.time)
    numUnits++
  }

  if ('sets' in currentExercise.value.goal) {
    formattedString += `${numUnits ? ', ' : ''}`
    formattedString += `${currentExercise.value.goal.sets} ${formattedSets(currentExercise.value.goal.sets)}`
    numUnits++
  }
  if ('repetitions' in currentExercise.value.goal) {
    formattedString += `${numUnits ? ', ' : ''}`
    formattedString += `${currentExercise.value.goal.repetitions} ${formattedReps(currentExercise.value.goal.repetitions)}`
    numUnits++
  }
  if ('weightKg' in currentExercise.value.goal) {
    formattedString += `${numUnits ? ', ' : ''}`
    formattedString += `${currentExercise.value.goal.weightKg} кг`
    numUnits++
  }

  return formattedString
})

const formattedWorkoutInfo = computed<string>(() => {
  if (!workoutCompleted.value) return ''

  const { completedReps, completedTimeExercises, completedWeightKgExercises } =
    getCompletedExercisesUnits(runWorkoutStore.selectedRunWorkout!, skippedExercisesIndexes.value)

  let maxWeightKg = 0
  if (completedWeightKgExercises.length) {
    maxWeightKg = Math.max(
      ...completedWeightKgExercises.map((exercise) => exercise.goal.weightKg || 0),
    )
  }

  const elapsedMinutes = completedTimeExercises.reduce((sum, exercise) => {
    return sum + exercise.goal.time!.minutes
  }, 0)

  const elapsedSeconds = completedTimeExercises.reduce((sum, exercise) => {
    return sum + exercise.goal.time!.seconds
  }, 0)

  const elapsedTime = formattedStringTime(elapsedMinutes, elapsedSeconds)

  return formattedWorkoutData(elapsedTime, completedReps, maxWeightKg)
})
</script>

<template>
  <div class="mr-auto mb-4 ml-auto w-fit">
    <h1 class="mb-3 text-center text-3xl font-bold">
      {{ runWorkoutStore.selectedRunWorkout?.name }}
    </h1>
    <div v-if="workoutCompleted" class="flex flex-col items-center">
      <p class="mb-2 text-center text-lg font-semibold">
        Тренировка закончена. <br />
        Она длилась: {{ formattedElapsedWorkoutTime }}
      </p>
      <p class="mb-2 text-lg font-semibold">Информация о тренировке:</p>
      <p class="text-center whitespace-pre">{{ formattedWorkoutInfo }}</p>
    </div>
    <div v-else-if="currentExercise" class="exercise-container flex flex-col items-center">
      <h2 class="mt-2 mb-2 text-center text-xl font-semibold sm:mt-0">
        {{ currentExercise.name }}
      </h2>
      <div
        class="wrapper mb-3 flex h-auto w-[95vw] justify-stretch sm:w-[80vw] md:w-[70vw] lg:w-[60vw] xl:w-[1000px]"
      >
        <ExerciseCardInfo :exercise="currentExercise"></ExerciseCardInfo>
      </div>
      <div v-if="currentExercise.unitsList.includes('время')" class="timer">
        <Button v-if="!exerciseTimerId && remainingExerciseTime !== 0" @click="startExerciseTimer"
          >Запустить таймер</Button
        >
        <Button
          v-else-if="!exerciseTimerId && remainingExerciseTime === 0"
          @click="() => completeExercise()"
          >Далее</Button
        >
        <p v-else>Осталось: {{ formattedRemainingExerciseTime }}</p>
      </div>
      <p
        v-if="
          !currentExercise.unitsList.includes('время') ||
          exerciseTimerId ||
          (!exerciseTimerId && remainingExerciseTime !== 0)
        "
        class="mt-1"
      >
        {{ exerciseTimerId ? 'из' : '' }}
        {{ formattedUnitsToComplete }}
      </p>
      <div class="mt-2 flex gap-4">
        <Button
          @click="skipExercise"
          severity="warn"
          v-if="
            !currentExercise.unitsList.includes('время') ||
            exerciseTimerId ||
            remainingExerciseTime !== 0
          "
          >Пропустить упражнение</Button
        >
        <Button
          severity="success"
          @click="() => completeExercise()"
          v-if="!currentExercise.unitsList.includes('время')"
          >Готово</Button
        >
      </div>
    </div>
    <div v-else class="rest-container flex flex-col items-center">
      <p
        class="mt-[calc(95vw/16*9)] mb-2 sm:mt-[calc(80vw/16*9)] md:mt-[calc(70vw/16*9)] lg:mt-[calc(60vw/16*9)] xl:mt-[calc(1000px/16*9)]"
      >
        Отдых {{ formattedRemainingRestTime }}
      </p>
      <Button @click="increaseRemainingRestTime" class="mb-2" severity="success">+10 сек</Button>
      <Button @click="decreaseRemainingRestTime" severity="danger">-10 сек</Button>
    </div>
  </div>
</template>

<style scoped></style>
