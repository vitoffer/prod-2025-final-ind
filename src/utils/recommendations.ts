import type { FilledExerciseWithGoal, User, WorkoutExerciseGoal } from '@/types'

type GoalType = 'weightKg' | 'repetitions' | 'sets' | 'time'

function calculateGoal(
  user: User,
  exercise: FilledExerciseWithGoal,
  type: 'max' | 'recommended',
): WorkoutExerciseGoal {
  const getTime = type === 'max' ? getMaxTime : getRecommendedTime
  const getLiftWeight = type === 'max' ? getMaxLiftWeight : getRecommendedLiftWeight
  const getReps = type === 'max' ? getMaxReps : getRecommendedReps
  const getSets = type === 'max' ? getMaxSets : getRecommendedSets

  const seconds = getTime(user, exercise)
  const time = { minutes: Math.floor(seconds / 60), seconds: Math.ceil(seconds % 60) }

  const liftWeight = getLiftWeight(user, exercise)
  const reps = getReps(user, exercise, liftWeight, getLiftWeight(user, exercise))
  const sets = getSets(exercise, reps, reps)

  return Object.fromEntries(
    (Object.keys(exercise.goal) as GoalType[]).map((key) => [
      key,
      ({ weightKg: liftWeight, repetitions: reps, sets, time } as WorkoutExerciseGoal)[key],
    ]),
  )
}

export const getMaxGoal = (user: User, exercise: FilledExerciseWithGoal) =>
  calculateGoal(user, exercise, 'max')

export const getRecommendedGoal = (user: User, exercise: FilledExerciseWithGoal) =>
  calculateGoal(user, exercise, 'recommended')

export function getMaxTime(user: User, exercise: FilledExerciseWithGoal) {
  const difficultyCoefficient =
    exercise.difficulty === 'простое' ? 2 : exercise.difficulty === 'среднее' ? 1.5 : 1

  return Math.floor(
    ((100 - user.age) / 100) *
      (1 - (user.heightCm / 100 - 1.7) * 0.1) *
      (1 - (user.weightKg - 80) * 0.005) *
      difficultyCoefficient *
      60 *
      60,
  )
}

export function getRecommendedTime(user: User, exercise: FilledExerciseWithGoal) {
  return Math.round(getMaxTime(user, exercise) * 0.8)
}

export function getMaxLiftWeight(user: User, exercise: FilledExerciseWithGoal) {
  const coefficient =
    exercise.difficulty === 'простое' ? 1.3 : exercise.difficulty === 'среднее' ? 1 : 0.7

  return Math.floor((0.8 + (100 - user.age) / 150) * user.weightKg * coefficient)
}

export function getRecommendedLiftWeight(user: User, exercise: FilledExerciseWithGoal) {
  const maxLiftWeightKg = getMaxLiftWeight(user, exercise)

  return Math.round(0.65 * maxLiftWeightKg)
}

export function getMaxReps(user: User, exercise: FilledExerciseWithGoal, maxLiftWeight: number) {
  const coefficient =
    exercise.difficulty === 'простое' ? 1.5 : exercise.difficulty === 'среднее' ? 1 : 0.7

  return Math.floor((30 / (1 + maxLiftWeight / user.weightKg)) * coefficient)
}

export function getRecommendedReps(
  user: User,
  exercise: FilledExerciseWithGoal,
  maxLiftWeight: number,
  recommendedLiftWeight: number,
) {
  const maxReps = getMaxReps(user, exercise, maxLiftWeight)

  return Math.min(Math.round((maxReps * maxLiftWeight) / recommendedLiftWeight), maxReps)
}

export function getMaxSets(exercise: FilledExerciseWithGoal, maxReps: number) {
  const coefficient =
    exercise.difficulty === 'простое' ? 0.2 : exercise.difficulty === 'среднее' ? 1 : 1.8

  const result = Math.floor(6 - (maxReps / 10) * coefficient)

  if (result < 3) {
    return 3
  }
  if (result > 6) {
    return 6
  }

  return result
}

export function getRecommendedSets(
  exercise: FilledExerciseWithGoal,
  maxReps: number,
  recommendedReps: number,
) {
  const maxSets = getMaxSets(exercise, maxReps)
  let result = Math.round((maxSets * maxReps) / recommendedReps)
  result = Math.min(result, maxSets)

  if (result < 3) {
    return 3
  }
  if (result > 6) {
    return 6
  }

  return result
}
