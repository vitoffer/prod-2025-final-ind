<script setup lang="ts">
import { useEditingWorkout } from '@/composables/workouts-list/editingWorkout'
import { useRunWorkoutStore } from '@/stores/runWorkoutStore'
import { useWorkoutsStore } from '@/stores/workoutsStore'
import type { Workout } from '@/types'
import { useConfirm } from 'primevue'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const confirm = useConfirm()

const workoutsStore = useWorkoutsStore()
const runWorkoutStore = useRunWorkoutStore()
const router = useRouter()

function runWorkout(workout: Workout) {
  runWorkoutStore.changeRunWorkout(workout)
  router.push({ name: 'RunWorkoutPage' })
}

const {
  editingWorkout,
  editWorkoutDialogVisible,
  createWorkout,
  changeWorkout,
  findWorkout,
  nameInvalid,
  validateName,
  saveEditingWorkout,
} = useEditingWorkout()

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
    return (
      filterName.value === '' || workout.name.toLowerCase().includes(filterName.value.toLowerCase())
    )
  })
})

const dialogHeader = ref<string>('Редактирование тренировки')
</script>

<template>
  <header class="flex flex-col items-center">
    <p>Фильтры</p>
    <FloatLabel variant="in">
      <InputText v-model="filterName" id="filterName" />
      <label for="filterName">Название</label>
    </FloatLabel>
    <Button @click="createWorkout"><i class="pi pi-plus"></i></Button>
  </header>
  <main>
    <ConfirmDialog />
    <Dialog v-model:visible="editWorkoutDialogVisible" modal :header="dialogHeader">
      <FloatLabel>
        <InputText
          v-model="editingWorkout.name"
          :invalid="nameInvalid"
          @input="() => (nameInvalid = validateName(editingWorkout))"
          id="edWoName"
        />
        <label for="edWoName">Название</label>
      </FloatLabel>
      <div class="flex w-full justify-evenly">
        <Button @click="editWorkoutDialogVisible = false" severity="danger">Отменить</Button>
        <Button @click="saveEditingWorkout" severity="success">Сохранить</Button>
      </div>
    </Dialog>
    <ul class="workouts-list mt-6 mr-auto ml-auto flex w-fit flex-col gap-4">
      <li v-for="workout in filteredWorkoutsList" :key="workout.id">
        {{ workout.name }}
        <Button aria-label="Run Workout" @click="() => runWorkout(workout)"
          ><i class="pi pi-play"></i
        ></Button>
        <Button severity="warn" @click="() => changeWorkout(workout.id, findWorkout)"
          ><i class="pi pi-pencil"></i
        ></Button>
        <Button severity="danger" @click="() => confirmRemove(workout.id)"
          ><i class="pi pi-times-circle"></i
        ></Button>
      </li>
    </ul>
  </main>
</template>

<style scoped></style>
