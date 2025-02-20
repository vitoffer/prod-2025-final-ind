import { useWorkoutsStore } from '@/stores/workoutsStore'
import type { Workout } from '@/types'
import { useEditingEntity } from '../editingEntity'
import type { Router } from 'vue-router'
import { getInvalidExercisesList, isNameValid } from '@/utils/validation'
import { useWorkoutValidation } from './workoutValidation'
import type { ToastMessageOptions } from 'primevue'

export const useEditingWorkout = (
  router: Router,
  showToast: (options: ToastMessageOptions) => void,
) => {
  const workoutsStore = useWorkoutsStore()

  const { nameInvalid } = useWorkoutValidation()

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

  function setAllFieldsValid() {
    nameInvalid.value = false
  }

  function createWorkout(...args: Parameters<typeof createEntity>) {
    createEntity(...args)

    setAllFieldsValid()
  }

  function changeWorkout(...args: Parameters<typeof changeEntity>) {
    changeEntity(...args)

    setAllFieldsValid()
  }

  function isWorkoutValid() {
    nameInvalid.value = !isNameValid(editingWorkout.value)

    if (nameInvalid.value) {
      return false
    }

    if (
      getInvalidExercisesList(editingWorkout.value).some((exerciseInvalid) =>
        Object.values(exerciseInvalid).includes(true),
      )
    ) {
      showToast({ severity: 'error', summary: `Введите корректную цель упражнения`, life: 3000 })
      return false
    }

    return true
  }

  const saveEditingWorkout = async () => {
    if (!isWorkoutValid()) return

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
    if (!isWorkoutValid()) return

    editWorkoutDialogVisible.value = false

    runWorkout(editingWorkout.value)
  }

  const runWorkout = (workout: Workout) => {
    router.push({
      name: 'RunWorkoutPage',
      params: {
        id: workout.id,
      },
    })
  }

  return {
    editingWorkout,
    editWorkoutDialogVisible,
    createWorkout,
    changeWorkout,
    findWorkout,
    saveEditingWorkout,
    validateAndRunWorkout,
    runWorkout,
    nameInvalid,
  }
}
