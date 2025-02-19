<script setup lang="ts">
import EditWorkoutDialog from '@/components/EditWorkoutDialog.vue'
import { useEditingWorkout } from '@/composables/workouts-list/editingWorkout'
import { useWorkoutsStore } from '@/stores/workoutsStore'
import type { Workout } from '@/types'
import { useConfirm } from 'primevue'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const confirm = useConfirm()

const workoutsStore = useWorkoutsStore()
const router = useRouter()

const {
  editingWorkout,
  editWorkoutDialogVisible,
  createWorkout,
  changeWorkout,
  findWorkout,
  nameInvalid,
  saveEditingWorkout,
  validateAndRunWorkout,
  runWorkout,
} = useEditingWorkout(router)

const confirmRemove = (id: number) => {
  confirm.require({
    message: 'Вы уверены, что хотите удалить эту тренировку?',
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
      workoutsStore.removeWorkout(id)
    },
  })
}

const filterName = ref<string>('')

const filteredWorkoutsList = computed<Workout[]>(() => {
  return workoutsStore.list.filter((workout) => {
    const matchesName =
      filterName.value === '' || workout.name.toLowerCase().includes(filterName.value.toLowerCase())
    return matchesName
  })
})

const dialogHeader = ref<string>('Редактирование тренировки')

const isNewWorkout = computed<boolean>(() => {
  return workoutsStore.list.find((workout) => workout.id === editingWorkout.value.id) === undefined
})
</script>

<template>
  <header class="flex flex-col items-center">
    <p class="mb-2">Фильтры</p>
    <FloatLabel variant="in" class="mb-3">
      <InputText v-model="filterName" id="filterName" />
      <label for="filterName">Название</label>
    </FloatLabel>
    <Button @click="createWorkout" aria-label="Create workout" class="!p-3"
      ><i class="pi pi-plus"></i
    ></Button>
  </header>
  <main class="mt-4">
    <ConfirmDialog />
    <EditWorkoutDialog
      v-model:edit-workout-dialog-visible="editWorkoutDialogVisible"
      v-model:editing-workout="editingWorkout"
      v-model:name-invalid="nameInvalid"
      :dialog-header="dialogHeader"
      :save-editing-workout="saveEditingWorkout"
      :run-workout="validateAndRunWorkout"
      :new-workout="isNewWorkout"
      class="!max-h-[95%] max-w-full"
    />
    <ul class="workouts-list mr-auto ml-auto flex w-fit flex-col gap-3">
      <li
        v-for="workout in filteredWorkoutsList"
        :key="workout.id"
        class="flex items-center gap-2 border-b-gray-400 not-last:border-b not-last:pb-3"
      >
        <span class="text-[1.15rem]">
          {{ workout.name }}
        </span>
        <Button @click="() => runWorkout(workout)" aria-label="Run workout" class="!p-[10px]">
          <i class="pi pi-play !text-[1.25rem]"></i>
        </Button>
        <Button
          severity="warn"
          @click="() => changeWorkout(workout.id, findWorkout)"
          aria-label="Change workout"
          class="!p-[10px]"
        >
          <i class="pi pi-pencil !text-[1.25rem]"></i>
        </Button>
        <Button
          severity="danger"
          @click="() => confirmRemove(workout.id)"
          aria-label="Remove workout"
          class="!p-[10px]"
        >
          <i class="pi pi-times-circle !text-[1.25rem]"></i>
        </Button>
      </li>
    </ul>
  </main>
</template>

<style scoped></style>
