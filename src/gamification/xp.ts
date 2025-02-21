import type { FilledExercisesWorkout, FilledExerciseWithGoal } from '@/types'
import { baseXP, XPGrowthRate } from './constants'

export function XPForLevel(currentLevel: number) {
  return Math.ceil(baseXP * XPGrowthRate ** (currentLevel - 1))
}

export function XPForCompletedWorkout(completedWorkout: FilledExercisesWorkout) {
  return completedWorkout.exercises.reduce((prev, exercise: FilledExerciseWithGoal) => {
    let computedXP = 0

    if (exercise.goal.repetitions) {
      computedXP += exercise.goal.repetitions
    }
    if (exercise.goal.sets) {
      computedXP += exercise.goal.sets * 10
    }
    if (exercise.goal.time) {
      if (exercise.goal.time.minutes) {
        computedXP += exercise.goal.time.minutes * 10
      }
      if (exercise.goal.time.seconds) {
        computedXP += exercise.goal.time.seconds * 10
      }
    }
    if (exercise.goal.weightKg) {
      computedXP += exercise.goal.weightKg * 10
    }
    return prev + computedXP
  }, 0)
}
