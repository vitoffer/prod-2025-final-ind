import type { ExerciseWithGoal } from '@/types'
import { computed, ref, watch, type Ref } from 'vue'

export const useRestTimer = (
  currentExercise: Ref<ExerciseWithGoal | null>,
  completeRest: () => void,
) => {
  const restTimerId = ref<number | null>(null)
  const elapsedRestTime = ref<number>(0)
  const totalRestTime = 2
  const remainingRestTime = computed<number>(() => {
    return totalRestTime - elapsedRestTime.value
  })
  const formattedRemainingRestTime = computed<string>(() => {
    return `${remainingRestTime.value} сек`
  })

  const startTimer = () => {
    elapsedRestTime.value = 0
    restTimerId.value = setInterval(() => {
      elapsedRestTime.value += 1

      if (remainingRestTime.value === 0) {
        stopTimer()
        completeRest()
      }
    }, 1000)
  }

  const stopTimer = () => {
    clearInterval(restTimerId.value!)
    restTimerId.value = null
  }

  watch(
    () => currentExercise.value,
    () => {
      if (currentExercise.value) {
        return
      }
      startTimer()
    },
    { immediate: true },
  )
  return { formattedRemainingRestTime }
}
