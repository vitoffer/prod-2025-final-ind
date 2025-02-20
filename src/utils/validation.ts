import type { EditingEntity, Exercise, ExerciseWithGoalValidation, Workout } from '@/types'
import { correctVideoUrl, isCorrectImageUrl } from './media'

export function isNameValid(editingEntity: EditingEntity) {
  return editingEntity.name.trim() !== ''
}

export function isDifficultyValid(editingExercise: Exercise) {
  return editingExercise.difficulty !== null
}

export function isUnitsListValid(editingExercise: Exercise) {
  if (editingExercise.unitsList.length === 0) {
    return false
  }
  return true
}

export async function isPhotoUrlValid(url: string) {
  if (url.trim() === '') {
    return false
  }
  return await isCorrectImageUrl(url)
}

export async function getInvalidPhotoUrlsList(editingExercise: Exercise) {
  const invalidList = await Promise.all(
    editingExercise.photoUrlList.map(async (url) => {
      return !(await isPhotoUrlValid(url))
    }),
  )
  return invalidList
}

export async function isVideoUrlValid(editingExercise: Exercise) {
  if (editingExercise.video!.url.trim() === '') {
    return true
  }
  const { error } = await correctVideoUrl(editingExercise.video!.url)
  return error ? false : true
}

export function getInvalidExercisesList(editingWorkout: Workout): ExerciseWithGoalValidation[] {
  const invalidList = editingWorkout.exercises.map((exercise): ExerciseWithGoalValidation => {
    const repetitionsCountInvalid = 'repetitions' in exercise.goal && !exercise.goal.repetitions
    const setsCountInvalid = 'sets' in exercise.goal && !exercise.goal.sets
    const weightKgCountInvalid = 'weightKg' in exercise.goal && !exercise.goal.weightKg
    const timeInvalid =
      'time' in exercise.goal &&
      ((exercise.goal.time!.minutes === 0 && exercise.goal.time!.seconds === 0) ||
        exercise.goal.time!.seconds > 59)
    return {
      repetitions: repetitionsCountInvalid,
      sets: setsCountInvalid,
      weightKg: weightKgCountInvalid,
      time: timeInvalid,
    }
  })
  return invalidList
}
