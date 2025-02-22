import type { FilledExercisesWorkout } from '@/types'

// export function markCompletedExercises(
// 	runningWorkout: FilledExercisesWorkout,
//   skippedIndexes: number[],
// ) {
// 	return runningWorkout.exercises.map((exercise, index) => {
// 		return skippedIndexes.includes(index) ?
// 	})
// }

export function getCompletedExercises(
  runningWorkout: FilledExercisesWorkout,
  skippedIndexes: number[],
) {
  return (
    runningWorkout.exercises.filter((_, index) => {
      return !skippedIndexes.includes(index)
    }) || []
  )
}

export function getCompletedExercisesUnits(
  runningWorkout: FilledExercisesWorkout,
  skippedIndexes: number[],
) {
  const completedExercises = getCompletedExercises(runningWorkout, skippedIndexes)

  const completedSetsExercises = completedExercises.filter((exercise) => 'sets' in exercise.goal)

  const completedRepsExercises = completedExercises.filter(
    (exercise) => 'repetitions' in exercise.goal,
  )

  const completedWeightKgExercises = completedExercises.filter(
    (exercise) => 'weightKg' in exercise.goal,
  )

  const completedTimeExercises = completedExercises.filter((exercise) => 'time' in exercise.goal)

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
