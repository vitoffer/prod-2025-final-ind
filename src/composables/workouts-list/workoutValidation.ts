import { ref } from 'vue'

export function useWorkoutValidation() {
  const nameInvalid = ref<boolean>(false)

  return {
    nameInvalid,
  }
}
