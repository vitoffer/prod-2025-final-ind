import { ref } from 'vue'

export function useEditingEntity<T extends { id: number }>(
  defaultEntity: Omit<T, 'id'>,
  getNextId: () => number,
) {
  const editingEntity = ref<T>({
    ...defaultEntity,
    id: getNextId(),
  } as T)
  const editDialogVisible = ref<boolean>(false)

  const createEntity = () => {
    editDialogVisible.value = true
    editingEntity.value = {
      ...defaultEntity,
      id: getNextId(),
    } as T
  }

  const changeEntity = (id: number, findEntity: (id: number) => T | undefined) => {
    editDialogVisible.value = true
    const foundEntity = findEntity(id)
    editingEntity.value = foundEntity || {
      ...defaultEntity,
      id: getNextId(),
    }
  }

  return {
    editingEntity,
    editDialogVisible,
    createEntity,
    changeEntity,
  }
}
