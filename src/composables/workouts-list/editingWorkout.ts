import { useWorkoutsStore } from '@/stores/workoutsStore'
import type {
  FilledExercisesWorkout,
  FilledExercisesWorkoutValidation,
  FilledExerciseWithGoal,
  InvalidWorkoutField,
  Workout,
} from '@/types'
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
      name: nullWorkout.name,
      exercises: nullWorkout.exercises,
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

  const saveEditingWorkout = () => {
    const invalidatedWorkout = getInvalidatedWorkout(editingWorkout.value)
    const invalidWorkoutField = getInvalidWorkoutField(invalidatedWorkout)

    if (invalidWorkoutField) {
      validateWorkout(invalidWorkoutField)
      return
    }

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

  function getInvalidWorkoutField(
    invalidatedWorkout: FilledExercisesWorkoutValidation,
  ): InvalidWorkoutField | null {
    if (invalidatedWorkout.name) {
      return { field: 'name', detail: 'пустое значение' }
    }

    if (invalidatedWorkout.exercises.length === 0) {
      return { field: 'exercises', detail: 'пустое значение' }
    }

    if (
      invalidatedWorkout.exercises.some((exercise) => Object.values(exercise.goal).includes(true))
    ) {
      return { field: 'exercises', detail: 'некорректное значение' }
    }

    return null
  }

  function getInvalidatedWorkout(
    workout: FilledExercisesWorkout,
  ): FilledExercisesWorkoutValidation {
    const invalidatedWorkout: FilledExercisesWorkoutValidation = {
      name: !isNameValid(workout),
      exercises: getInvalidExercisesList(workout),
    }

    return invalidatedWorkout
  }

  function validateWorkout(invalidWorkoutField: InvalidWorkoutField) {
    if (invalidWorkoutField.field === 'name') {
      nameInvalid.value = true
      showToast({ severity: 'error', summary: `Введите название тренировки`, life: 3000 })
    }

    if (
      invalidWorkoutField.field === 'exercises' &&
      invalidWorkoutField.detail === 'пустое значение'
    ) {
      showToast({ severity: 'error', summary: `Добавьте хотя бы одно упражнение`, life: 3000 })
    }

    if (
      invalidWorkoutField.field === 'exercises' &&
      invalidWorkoutField.detail === 'некорректное значение'
    ) {
      showToast({ severity: 'error', summary: `Введите корректную цель упражнения`, life: 3000 })
    }
  }

  const validateAndRunWorkout = (workout: FilledExercisesWorkout) => {
    const invalidatedWorkout = getInvalidatedWorkout(workout)
    const invalidWorkoutField = getInvalidWorkoutField(invalidatedWorkout)

    if (invalidWorkoutField && editWorkoutDialogVisible.value) {
      validateWorkout(invalidWorkoutField)
      return
    }
    if (invalidWorkoutField && !editWorkoutDialogVisible.value) {
      showToast({
        severity: 'error',
        summary: `Что-то пошло не так. Проверьте данные тренировки`,
        life: 3000,
      })
      return
    }

    editWorkoutDialogVisible.value = false

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
    nameInvalid,
  }
}
