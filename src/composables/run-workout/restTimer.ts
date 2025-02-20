import type { ExerciseWithGoal } from '@/types'
import { computed, onUnmounted, ref, watch, type Ref } from 'vue'

export const useRestTimer = (
  currentExercise: Ref<ExerciseWithGoal | null>,
  completeRest: () => void,
) => {
  const restTimerId = ref<number | null>(null)
  const elapsedRestTime = ref<number>(0)
  const totalRestTime = 10
  const remainingRestTime = ref<number>(0)
  const formattedRemainingRestTime = computed<string>(() => {
    return `${remainingRestTime.value} сек`
  })

  const startTimer = () => {
    elapsedRestTime.value = 0
    remainingRestTime.value = totalRestTime - elapsedRestTime.value
    restTimerId.value = setInterval(() => {
      if (remainingRestTime.value === 0) {
        stopTimer()
        completeRest()
      }

      elapsedRestTime.value += 1
      remainingRestTime.value -= 1
    }, 1000)
  }

  const stopTimer = () => {
    clearInterval(restTimerId.value!)
    restTimerId.value = null
  }

  const increaseRemainingRestTime = () => {
    remainingRestTime.value += 10
  }

  const decreaseRemainingRestTime = () => {
    remainingRestTime.value = Math.max(0, remainingRestTime.value - 10)
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

  onUnmounted(() => {
    if (restTimerId.value) clearInterval(restTimerId.value)
  })

  return {
    restTimerId,
    formattedRemainingRestTime,
    increaseRemainingRestTime,
    decreaseRemainingRestTime,
  }
}
