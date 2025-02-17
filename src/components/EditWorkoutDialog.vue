<script setup lang="ts">
import type { Workout } from '@/types'

defineProps<{
  dialogHeader: string
  validateName: (workout: Workout) => boolean
  saveEditingWorkout: () => void
}>()

const editWorkoutDialogVisible = defineModel<boolean>('editWorkoutDialogVisible')
const editingWorkout = defineModel<Workout>('editingWorkout')
const nameInvalid = defineModel<boolean>('nameInvalid')
</script>

<template>
  <Dialog v-model:visible="editWorkoutDialogVisible" modal :header="dialogHeader">
    <FloatLabel>
      <InputText
        v-model="editingWorkout!.name"
        :invalid="nameInvalid"
        @input="() => (nameInvalid = validateName(editingWorkout!))"
        id="edWoName"
      />
      <label for="edWoName">Название</label>
    </FloatLabel>
    <div class="flex w-full justify-evenly">
      <Button @click="editWorkoutDialogVisible = false" severity="danger">Отменить</Button>
      <Button @click="saveEditingWorkout" severity="success">Сохранить</Button>
    </div>
  </Dialog>
</template>

<style scoped></style>
