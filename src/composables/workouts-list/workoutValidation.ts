import type { ExerciseWithGoalValidation } from '@/types'
import { ref } from 'vue'

export function useWorkoutValidation() {
  const nameInvalid = ref<boolean>(false)
  const exercisesListInvalid = ref<ExerciseWithGoalValidation[]>([])

  return {
    nameInvalid,
    exercisesListInvalid,
  }
}
