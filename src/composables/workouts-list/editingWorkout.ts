import { useWorkoutsStore } from '@/stores/workoutsStore'
import type { Workout } from '@/types'
import { useEditingEntity } from '../editingEntity'
import { useRunWorkoutStore } from '@/stores/runWorkoutStore'
import type { Router } from 'vue-router'
import { ref } from 'vue'
import { isNameValid } from '@/utils/validation'

export const useEditingWorkout = (router: Router) => {
  const workoutsStore = useWorkoutsStore()
  const runWorkoutStore = useRunWorkoutStore()
  const nameInvalid = ref<boolean>()

  const nullWorkout: Omit<Workout, 'id'> = {
    name: '',
    exercises: [],
  }

  const getNextId = () => workoutsStore.list[workoutsStore.list.length - 1].id + 1
  const findWorkout = (id: number) =>
    JSON.parse(JSON.stringify(workoutsStore.list.find((workout) => workout.id === id)))

  const {
    changeEntity,
    createEntity,
    editDialogVisible: editWorkoutDialogVisible,
    editingEntity: editingWorkout,
  } = useEditingEntity<Workout>(nullWorkout, getNextId)

  function createWorkout(...args: Parameters<typeof createEntity>) {
    nameInvalid.value = false

    createEntity(...args)
  }

  function changeWorkout(...args: Parameters<typeof changeEntity>) {
    nameInvalid.value = false

    changeEntity(...args)
  }

  const saveEditingWorkout = async () => {
    nameInvalid.value = !isNameValid(editingWorkout.value)

    if (nameInvalid.value) {
      return
    }

    const existingWorkout = workoutsStore.list.find(
      (workout) => workout.id === editingWorkout.value.id,
    )

    if (existingWorkout) {
      workoutsStore.updateWorkout(existingWorkout.id, editingWorkout.value)
    } else {
      workoutsStore.createWorkout(editingWorkout.value)
    }

    editWorkoutDialogVisible.value = false
  }

  const validateAndRunWorkout = async () => {
    nameInvalid.value = !isNameValid(editingWorkout.value)

    if (nameInvalid.value) {
      return
    }

    editWorkoutDialogVisible.value = false

    runWorkout(editingWorkout.value)
  }

  const runWorkout = (workout: Workout) => {
    runWorkoutStore.changeRunWorkout(workout)
    router.push({ name: 'RunWorkoutPage' })
  }

  return {
    editingWorkout,
    editWorkoutDialogVisible,
    createWorkout,
    changeWorkout,
    findWorkout,
    nameInvalid,
    saveEditingWorkout,
    validateAndRunWorkout,
    runWorkout,
  }
}
