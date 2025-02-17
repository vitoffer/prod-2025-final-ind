// src/composables/validation.ts
import { ref } from 'vue'
import { isCorrectImageUrl, correctVideoUrl } from '@/utils'
import type { Exercise } from '@/types'

export function useValidation() {
  const edExNameInvalid = ref<boolean>(false)
  const edExDiffInvalid = ref<boolean>(false)
  const edExUnitsInvalid = ref<boolean>(false)
  const edExPhotoUrlListInvalid = ref<boolean[]>([])
  const edExVideoUrlInvalid = ref<boolean>(false)

  function validateName(editingExercise: Exercise) {
    return editingExercise.name.trim() === ''
  }

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
    edExNameInvalid,
    edExDiffInvalid,
    edExUnitsInvalid,
    edExPhotoUrlListInvalid,
    edExVideoUrlInvalid,
    validateName,
    validateDiff,
    validateUnits,
    validatePhotoUrlList,
    validateVideoUrl,
  }
}
