<script setup lang="ts">
import EditWorkoutDialog from '@/components/EditWorkoutDialog.vue'
import { useEditingWorkout } from '@/composables/workouts-list/editingWorkout'
import { useWorkoutsStore } from '@/stores/workoutsStore'
import type { Workout } from '@/types'
import { useConfirm, useToast, type ToastMessageOptions } from 'primevue'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const confirm = useConfirm()

const workoutsStore = useWorkoutsStore()
const router = useRouter()
const toast = useToast()

function showToast(options: ToastMessageOptions) {
  toast.add(options)
}

const {
  editingWorkout,
  editWorkoutDialogVisible,
  createWorkout,
  changeWorkout,
  saveEditingWorkout,
  validateAndRunWorkout,
  runWorkout,
  nameInvalid,
} = useEditingWorkout(router, showToast)

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

const dialogHeader = computed<string>(() => {
  if (workoutsStore.list.find((workout) => workout.id === editingWorkout.value.id)) {
    return 'Редактирование тренировки'
  }
  return 'Создание тренировки'
})

const isNewWorkout = computed<boolean>(() => {
  return workoutsStore.list.find((workout) => workout.id === editingWorkout.value.id) === undefined
})
</script>

<template>
  <Toast class="!right-0 !max-w-[100vw] sm:!right-[20px] sm:!max-w-none" />
  <header class="flex flex-col items-center">
    <FloatLabel variant="in" class="mt-4 mb-3 w-[80vw] sm:mt-2 sm:w-[400px]">
      <InputText v-model="filterName" id="filterName" class="w-full" />
      <label for="filterName">Поиск по названию</label>
    </FloatLabel>
    <Button @click="createWorkout" aria-label="Create workout" class="!p-[10px]"
      ><i class="pi pi-plus !text-[1.25rem]"></i
    ></Button>
  </header>
  <main class="mt-4 mr-auto ml-auto w-fit">
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
    <ul class="workouts-list flex w-full flex-col gap-3 sm:w-fit">
      <li
        v-for="workout in filteredWorkoutsList"
        :key="workout.id"
        class="flex w-[80vw] items-center justify-between gap-8 border-t border-gray-400 pt-3 last:border-b last:pb-3 sm:gap-64 md:w-full md:gap-[460px]"
      >
        <span class="text-[1.15rem]">
          {{ workout.name }}
        </span>
        <div class="flex gap-2">
          <Button @click="() => runWorkout(workout)" aria-label="Run workout" class="!p-[10px]">
            <i class="pi pi-play !text-[1.25rem]"></i>
          </Button>
          <Button
            severity="warn"
            @click="() => changeWorkout(workout.id)"
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
        </div>
      </li>
    </ul>
  </main>
</template>

<style scoped></style>
