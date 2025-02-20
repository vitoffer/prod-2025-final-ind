import { useWorkoutsStore } from '@/stores/workoutsStore'
import type { Workout } from '@/types'
import { useEditingEntity } from '../editingEntity'
import { useRunWorkoutStore } from '@/stores/runWorkoutStore'
import type { Router } from 'vue-router'
import { getInvalidExercisesList, isNameValid } from '@/utils/validation'
import { useWorkoutValidation } from './workoutValidation'

export const useEditingWorkout = (router: Router) => {
  const workoutsStore = useWorkoutsStore()
  const runWorkoutStore = useRunWorkoutStore()

  const { nameInvalid, exercisesListInvalid } = useWorkoutValidation()

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
    exercisesListInvalid.value = new Array(editingWorkout.value.exercises.length).fill({
      time: false,
      sets: false,
      repetitions: false,
      weightKg: false,
    })
  }

  function createWorkout(...args: Parameters<typeof createEntity>) {
    createEntity(...args)

    setAllFieldsValid()
  }

  function changeWorkout(...args: Parameters<typeof changeEntity>) {
    changeEntity(...args)

    setAllFieldsValid()
  }

  const saveEditingWorkout = async () => {
    nameInvalid.value = !isNameValid(editingWorkout.value)
    exercisesListInvalid.value = getInvalidExercisesList(editingWorkout.value)

    if (
      nameInvalid.value ||
      exercisesListInvalid.value.some((exerciseInvalid) =>
        Object.values(exerciseInvalid).includes(true),
      )
    ) {
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
    saveEditingWorkout,
    validateAndRunWorkout,
    runWorkout,
    nameInvalid,
    exercisesListInvalid,
  }
}
