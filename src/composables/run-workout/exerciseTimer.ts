import type { ExerciseWithGoal } from '@/types'
import { computed, onUnmounted, ref, type Ref } from 'vue'

export const useExerciseTimer = (currentExercise: Ref<ExerciseWithGoal | null>) => {
  const exerciseTimerId = ref<number | null>(null)
  const elapsedExerciseTime = ref<number>(0)
  const totalExerciseTime = computed<number | null>(() => {
    if (!currentExercise.value!.unitsList.includes('время')) return null
    return currentExercise.value!.goal.time!.seconds
  })
  const remainingExerciseTime = computed<number>(() => {
    if (totalExerciseTime.value === null) return 0
    return totalExerciseTime.value - elapsedExerciseTime.value
  })
  const formattedRemainingExerciseTime = computed<string>(() => {
    let resultString = ''
    resultString += String(Math.floor(remainingExerciseTime.value / 60)).padStart(2, '0')
    resultString += ':'
    resultString += String(remainingExerciseTime.value % 60).padStart(2, '0')
    return resultString
  })

  const startTimer = () => {
    elapsedExerciseTime.value = 0
    exerciseTimerId.value = setInterval(() => {
      elapsedExerciseTime.value += 1

      if (remainingExerciseTime.value === 0) {
        stopTimer()
      }
    }, 1000)
  }

  const stopTimer = () => {
    clearInterval(exerciseTimerId.value!)
    exerciseTimerId.value = null
  }

  onUnmounted(() => {
    if (exerciseTimerId.value) clearInterval(exerciseTimerId.value)
  })

  return {
    formattedRemainingExerciseTime,
    exerciseTimerId,
    startExerciseTimer: startTimer,
    remainingExerciseTime,
  }
}
