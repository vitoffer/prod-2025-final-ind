<script setup lang="ts">
import { useExercisesStore } from '@/stores/exercisesStore'
import { useConfirm } from 'primevue/useconfirm'

const confirm = useConfirm()

const confirmRemove = (id: string) => {
  confirm.require({
    message: 'Вы уверены, что хотите удалить это упражнение?',
    header: 'Подтверждение',
    icon: 'pi pi-exclamation-triangle !text-red-400',
    rejectProps: {
      label: 'Отмена',
      severity: 'secondary',
      outlined: true,
    },
    acceptProps: {
      label: 'Удалить',
      severity: 'danger',
    },
    accept: () => {
      exercisesStore.remove(id)
    },
  })
}

const exercisesStore = useExercisesStore()
</script>

<template>
  <div class="exercises-list-container flex justify-evenly">
    <ConfirmDialog></ConfirmDialog>
    <ExerciseCard
      v-for="exercise in exercisesStore.list"
      :key="exercise.id"
      :exercise="exercise"
      @remove-exercise="confirmRemove"
    />
  </div>
</template>

<style scoped lang="scss"></style>
