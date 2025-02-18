import { ref } from 'vue'
import type { Exercise } from '@/types'
import { correctVideoUrl, isCorrectImageUrl } from '@/utils/media'

export function useExerciseValidation() {
  const diffInvalid = ref<boolean>(false)
  const unitsInvalid = ref<boolean>(false)
  const photoUrlListInvalid = ref<boolean[]>([])
  const videoUrlInvalid = ref<boolean>(false)

  function validateDiff(editingExercise: Exercise) {
    return editingExercise.difficulty === null
  }

  function validateUnits(editingExercise: Exercise) {
    if (editingExercise.units.length === 0) {
      return true
    }
    if (
      editingExercise.units.includes('мин') &&
      (editingExercise.units.includes('кг') || editingExercise.units.includes('повт'))
    ) {
      return true
    }
    return false
  }

  async function validatePhotoUrlList(editingExercise: Exercise) {
    const invalidList = await Promise.all(
      editingExercise.photoUrlList.map(async (url) => {
        if (url.trim() === '') {
          return true
        }
        return !(await isCorrectImageUrl(url))
      }),
    )
    return invalidList
  }

  async function validateVideoUrl(editingExercise: Exercise) {
    if (editingExercise.video!.url.trim() === '') {
      return false
    }
    const { error } = await correctVideoUrl(editingExercise.video!.url)
    return error ? true : false
  }

  return {
    diffInvalid,
    unitsInvalid,
    photoUrlListInvalid,
    videoUrlInvalid,
    validateDiff,
    validateUnits,
    validatePhotoUrlList,
    validateVideoUrl,
  }
}
