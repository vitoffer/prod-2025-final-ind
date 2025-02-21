import { useWorkoutsStore } from '@/stores/workoutsStore'
import type { FilledExercisesWorkout, FilledExerciseWithGoal, Workout } from '@/types'
import type { Router } from 'vue-router'
import { getInvalidExercisesList, isNameValid } from '@/utils/validation'
import { useWorkoutValidation } from './workoutValidation'
import type { ToastMessageOptions } from 'primevue'
import { ref } from 'vue'
import { useRunWorkoutStore } from '@/stores/runWorkoutStore'

export const useEditingWorkout = (
  router: Router,
  showToast: (options: ToastMessageOptions) => void,
) => {
  const workoutsStore = useWorkoutsStore()

  const { nameInvalid } = useWorkoutValidation()

  const nullWorkout: Omit<FilledExercisesWorkout, 'id'> = {
    name: '',
    exercises: [],
  }

  const getNextId: () => number = () => workoutsStore.list[workoutsStore.list.length - 1].id + 1
  const findWorkout = (id: number): Workout =>
    JSON.parse(JSON.stringify(workoutsStore.list.find((workout: Workout) => workout.id === id)))

  const editingWorkout = ref<FilledExercisesWorkout>({
    ...nullWorkout,
    id: getNextId(),
  })

  const editWorkoutDialogVisible = ref<boolean>(false)

  const createWorkout = () => {
    editWorkoutDialogVisible.value = true
    editingWorkout.value = {
      ...nullWorkout,
      id: getNextId(),
    }

    setAllFieldsValid()
  }

  const changeWorkout = (id: number) => {
    const foundWorkout = findWorkout(id)
    if (foundWorkout) {
      const filledExercisesWorkout = workoutsStore.getFilledExercisesWorkout(id)

      editingWorkout.value = filledExercisesWorkout
    } else {
      editingWorkout.value = {
        ...nullWorkout,
        id: getNextId(),
      }
    }

    setAllFieldsValid()
    editWorkoutDialogVisible.value = true
  }

  function setAllFieldsValid() {
    nameInvalid.value = false
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

    if (editingWorkout.value.exercises.length === 0) {
      showToast({ severity: 'error', summary: `Добавьте хотя бы одно упражнение`, life: 3000 })

      return false
    }

    return true
  }

  const saveEditingWorkout = () => {
    if (!isWorkoutValid()) return

    const formattedExercises = editingWorkout.value.exercises.map(
      (exercise: FilledExerciseWithGoal) => {
        const { id, goal } = exercise
        return { id, goal }
      },
    )

    const formattedWorkout = {
      ...editingWorkout.value,
      exercises: formattedExercises,
    }

    const existingWorkout = workoutsStore.list.find(
      (workout: Workout) => workout.id === formattedWorkout.id,
    )

    if (existingWorkout) {
      workoutsStore.updateWorkout(existingWorkout.id, formattedWorkout)
    } else {
      workoutsStore.createWorkout(formattedWorkout)
    }

    editWorkoutDialogVisible.value = false
  }

  const validateAndRunWorkout = () => {
    if (!isWorkoutValid()) return

    editWorkoutDialogVisible.value = false

    // const runWorkoutStore = useRunWorkoutStore()

    runWorkout(editingWorkout.value)
  }

  const runWorkout = (workout: FilledExercisesWorkout) => {
    const runWorkoutStore = useRunWorkoutStore()

    runWorkoutStore.updateWorkout(workout)
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
    saveEditingWorkout,
    validateAndRunWorkout,
    runWorkout,
    nameInvalid,
  }
}
