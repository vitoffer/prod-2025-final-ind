import { ref } from 'vue'
import type { EditingEntity } from '@/types'

export function useValidation() {
  const nameInvalid = ref<boolean>(false)

  function validateName(editingEntity: EditingEntity) {
    return editingEntity.name.trim() === ''
  }

  return {
    nameInvalid,
    validateName,
  }
}
