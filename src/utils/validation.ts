import type { EditingEntity, Exercise } from '@/types'
import { correctVideoUrl, isCorrectImageUrl } from './media'

export function isNameValid(editingEntity: EditingEntity) {
  return editingEntity.name.trim() !== ''
}

export function isDifficultyValid(editingExercise: Exercise) {
  return editingExercise.difficulty !== null
}

export function isUnitsListValid(editingExercise: Exercise) {
  if (editingExercise.units.length === 0) {
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
    return false
  }
  const { error } = await correctVideoUrl(editingExercise.video!.url)
  return error ? true : false
}
