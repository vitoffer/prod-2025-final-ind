import type { ExerciseWithGoal } from '@/types'
import { computed, ref, watch, type Ref } from 'vue'

export const useExerciseTimer = (
  currentExercise: Ref<ExerciseWithGoal | null>,
  completeExercise: () => void,
) => {
  const exerciseTimerId = ref<number | null>(null)
  const elapsedExerciseTime = ref<number>(0)
  const totalExerciseTime = computed<number | null>(() => {
    if (!currentExercise.value!.units.includes('мин')) return null
    return currentExercise.value!.goal.time!
  })
  const remainingExerciseTime = computed<number>(() => {
    if (totalExerciseTime.value === null) return 0
    return totalExerciseTime.value - elapsedExerciseTime.value
  })
  const formattedRemainingExerciseTime = computed<string>(() => {
    const minutes = Math.trunc(remainingExerciseTime.value / 60)
    const seconds = remainingExerciseTime.value % 60
    return `${minutes} мин, ${seconds} сек`
  })

  const startTimer = () => {
    elapsedExerciseTime.value = 0
    exerciseTimerId.value = setInterval(() => {
      elapsedExerciseTime.value += 1

      if (remainingExerciseTime.value === 0) {
        stopTimer()
        completeExercise()
      }
    }, 1000)
  }

  const stopTimer = () => {
    clearInterval(exerciseTimerId.value!)
    exerciseTimerId.value = null
  }

  watch(
    () => currentExercise.value,
    () => {
      if (!currentExercise.value) return
      if (!currentExercise.value.units.includes('мин')) {
        return
      }
      startTimer()
    },
    { immediate: true },
  )
  return { formattedRemainingExerciseTime }
}
