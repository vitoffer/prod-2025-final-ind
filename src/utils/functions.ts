import type { Workout } from '@/types'

export function getCompletedExercisesUnits(runningWorkout: Workout, skippedIndexes: number[]) {
  const completedExercises =
    runningWorkout.exercises.filter((_, index) => {
      return !skippedIndexes.includes(index)
    }) || []

  const completedSetsExercises = completedExercises.filter((exercise) =>
    exercise.unitsList.includes('подходы'),
  )

  const completedRepsExercises = completedExercises.filter((exercise) =>
    exercise.unitsList.includes('повторения'),
  )

  const completedWeightKgExercises = completedExercises.filter((exercise) =>
    exercise.unitsList.includes('вес'),
  )

  const completedTimeExercises = completedExercises.filter((exercise) =>
    exercise.unitsList.includes('время'),
  )

  let completedReps = 0

  const completedSetsOnly = completedSetsExercises.reduce((sum, exercise) => {
    return sum + exercise.goal.sets!
  }, 0)

  const completedRepsOnly = completedRepsExercises.reduce((sum, exercise) => {
    return sum + exercise.goal.repetitions!
  }, 0)

  if (completedSetsOnly || completedRepsOnly) {
    completedReps = (completedSetsOnly || 1) * (completedRepsOnly || 1)
  }

  return { completedWeightKgExercises, completedTimeExercises, completedReps }
}
