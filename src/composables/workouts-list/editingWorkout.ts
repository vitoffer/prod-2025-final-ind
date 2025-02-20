import { useWorkoutsStore } from '@/stores/workoutsStore'
import type { ExerciseWithGoal, Workout } from '@/types'
import type { Router } from 'vue-router'
import { getInvalidExercisesList, isNameValid } from '@/utils/validation'
import { useWorkoutValidation } from './workoutValidation'
import type { ToastMessageOptions } from 'primevue'
import { ref } from 'vue'
import { useExercisesStore } from '@/stores/exercisesStore'

export const useEditingWorkout = (
  router: Router,
  showToast: (options: ToastMessageOptions) => void,
) => {
  const workoutsStore = useWorkoutsStore()
  const exercisesStore = useExercisesStore()

  const { nameInvalid } = useWorkoutValidation()

  const nullWorkout: Omit<Workout, 'id'> = {
    name: '',
    exercises: [],
  }

  const getNextId = () => workoutsStore.list[workoutsStore.list.length - 1].id + 1
  const findWorkout = (id: number): Workout =>
    JSON.parse(JSON.stringify(workoutsStore.list.find((workout) => workout.id === id)))

  const editWorkoutDialogVisible = ref<boolean>(false)

  const editingWorkout = ref<Workout>({
    ...nullWorkout,
    id: getNextId(),
  })

  const editDialogVisible = ref<boolean>(false)

  const createWorkout = () => {
    editDialogVisible.value = true
    editingWorkout.value = {
      ...nullWorkout,
      id: getNextId(),
    }

    setAllFieldsValid()
  }

  const changeWorkout = (id: number) => {
    editDialogVisible.value = true
    const foundWorkout = findWorkout(id)
    if (foundWorkout) {
      const exercises = foundWorkout.exercises.map((workoutExercise: ExerciseWithGoal) => ({
        ...workoutExercise,
        ...exercisesStore.list.find((fullExercise) => fullExercise.id === workoutExercise.id),
      }))
      foundWorkout.exercises = exercises
      editingWorkout.value = foundWorkout
    } else {
      editingWorkout.value = {
        ...nullWorkout,
        id: getNextId(),
      }
    }

    setAllFieldsValid()
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
    saveEditingWorkout,
    validateAndRunWorkout,
    runWorkout,
    nameInvalid,
  }
}
