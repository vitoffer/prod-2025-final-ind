import { ref } from 'vue'

export function useExerciseValidation() {
  const nameInvalid = ref<boolean>(false)
  const unitsListInvalid = ref<boolean>(false)
  const photoUrlListInvalid = ref<boolean[]>([])
  const videoUrlInvalid = ref<boolean>(false)

  return {
    nameInvalid,
    unitsListInvalid,
    photoUrlListInvalid,
    videoUrlInvalid,
  }
}
