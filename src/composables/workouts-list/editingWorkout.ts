import { ref } from 'vue'
import { useWorkoutsStore } from '@/stores/workoutsStore'
import { useRunWorkoutStore } from '@/stores/runWorkoutStore'
import { useUserStore } from '@/stores/userStore'
import { useWorkoutValidation } from './workoutValidation'
import { getInvalidExercisesList, isNameValid } from '@/utils/validation'
import { getMaxGoal, getRecommendedGoal } from '@/utils/recommendations'
import type {
  FilledExercisesWorkout,
  FilledExercisesWorkoutValidation,
  InvalidWorkoutField,
  Workout,
} from '@/types'
import type { Router } from 'vue-router'
import { useGlobalStore } from '@/stores/globalStore'

export const useEditingWorkout = (router: Router) => {
  const globalStore = useGlobalStore()
  const workoutsStore = useWorkoutsStore()
  const userStore = useUserStore()
  const { nameInvalid } = useWorkoutValidation()

  const editWorkoutDialogVisible = ref(false)
  const editingWorkout = ref<FilledExercisesWorkout>({
    name: '',
    exercises: [],
    id: getNextId(),
  })

  function getNextId() {
    return (workoutsStore.list.slice(-1)[0]?.id || 0) + 1
  }

  function findWorkout(id: number): Workout | null {
    return workoutsStore.list.find((workout) => workout.id === id) || null
  }

  function createWorkout() {
    editingWorkout.value = { name: '', exercises: [], id: getNextId() }
    openEditDialog()
  }

  function changeWorkout(id: number) {
    const foundWorkout = findWorkout(id)
    editingWorkout.value = foundWorkout
      ? workoutsStore.getFilledExercisesWorkout(id)
      : { name: '', exercises: [], id: getNextId() }
    openEditDialog()
  }

  function openEditDialog() {
    nameInvalid.value = false
    editWorkoutDialogVisible.value = true
  }

  function getExceededMaxGoals(workout: FilledExercisesWorkout): string[] {
    const user = userStore.user
    return workout.exercises.flatMap((exercise) => {
      const maxGoal = getMaxGoal(user, exercise)
      const recommendedGoal = getRecommendedGoal(user, exercise)
      const exceededMessages: string[] = []

      const isExceeded = (value: number, max: number, recommended: number, type: string) => {
        if (value > max && value > recommended) {
          exceededMessages.push(
            `${type} для "${exercise.name}" превышает максимальное (${max}) и рекомендованное (${recommended})`,
          )
          return true
        }
        return false
      }

      if (exercise.goal.time && maxGoal.time && recommendedGoal.time) {
        const time = exercise.goal.time.minutes * 60 + exercise.goal.time.seconds
        const maxTime = maxGoal.time.minutes * 60 + maxGoal.time.seconds
        const recommendedTime = recommendedGoal.time.minutes * 60 + recommendedGoal.time.seconds
        isExceeded(time, maxTime, recommendedTime, 'Время')
      }
      if (exercise.goal.weightKg && maxGoal.weightKg && recommendedGoal.weightKg)
        isExceeded(exercise.goal.weightKg, maxGoal.weightKg, recommendedGoal.weightKg, 'Вес')
      if (exercise.goal.repetitions && maxGoal.repetitions && recommendedGoal.repetitions)
        isExceeded(
          exercise.goal.repetitions,
          maxGoal.repetitions,
          recommendedGoal.repetitions,
          'Повторения',
        )
      if (exercise.goal.sets && maxGoal.sets && recommendedGoal.sets)
        isExceeded(exercise.goal.sets, maxGoal.sets, recommendedGoal.sets, 'Подходы')

      if (exceededMessages.length > 0) {
        exceededMessages.push(`Все равно продолжить? Нажмите еще раз`)
      }

      return exceededMessages
    })
  }

  function getInvalidWorkoutField(
    invalidatedWorkout: FilledExercisesWorkoutValidation,
  ): InvalidWorkoutField | null {
    if (invalidatedWorkout.name) return { field: 'name', detail: 'пустое значение' }
    if (!invalidatedWorkout.exercises.length)
      return { field: 'exercises', detail: 'пустое значение' }
    if (invalidatedWorkout.exercises.some((ex) => Object.values(ex.goal).includes(true)))
      return { field: 'exercises', detail: 'некорректное значение' }
    return null
  }

  function getInvalidatedWorkout(
    workout: FilledExercisesWorkout,
  ): FilledExercisesWorkoutValidation {
    return {
      name: !isNameValid(workout),
      exercises: getInvalidExercisesList(workout),
    }
  }

  function isWorkoutValid(workout: FilledExercisesWorkout, isEditing: boolean): boolean {
    const invalidatedWorkout = getInvalidatedWorkout(workout)
    const invalidWorkoutField = getInvalidWorkoutField(invalidatedWorkout)

    if (invalidWorkoutField) {
      if (isEditing) {
        showValidationErrors(invalidWorkoutField)
      } else {
        globalStore.addToast({
          severity: 'error',
          summary: 'Ошибка в тренировке',
          detail: 'Проверьте введённые данные.',
          life: 3000,
        })
      }
      return false
    }

    return true
  }

  function showValidationErrors(invalidWorkoutField: InvalidWorkoutField) {
    if (invalidWorkoutField.field === 'name') {
      nameInvalid.value = true
      globalStore.addToast({
        severity: 'error',
        summary: 'Введите название тренировки',
        life: 3000,
      })
    } else if (invalidWorkoutField.field === 'exercises') {
      globalStore.addToast({
        severity: 'error',
        summary:
          invalidWorkoutField.detail === 'пустое значение'
            ? 'Добавьте хотя бы одно упражнение'
            : 'Введите корректную цель упражнения',
        life: 3000,
      })
    }
  }

  function saveEditingWorkout() {
    if (!isWorkoutValid(editingWorkout.value, true)) return

    const formattedWorkout = {
      ...editingWorkout.value,
      exercises: editingWorkout.value.exercises.map(({ id, goal }) => ({ id, goal })),
    }

    const existingWorkout = workoutsStore.list.find((w) => w.id === formattedWorkout.id)

    if (existingWorkout) {
      workoutsStore.updateWorkout(existingWorkout.id, formattedWorkout)
    } else {
      workoutsStore.createWorkout(formattedWorkout)
    }

    editWorkoutDialogVisible.value = false
  }

  function validateAndRunWorkout(workout: FilledExercisesWorkout) {
    if (!isWorkoutValid(workout, false)) return

    editWorkoutDialogVisible.value = false
    useRunWorkoutStore().updateWorkout(workout)
    router.push({ name: 'RunWorkoutPage', params: { id: workout.id } })
  }

  return {
    editingWorkout,
    editWorkoutDialogVisible,
    createWorkout,
    changeWorkout,
    saveEditingWorkout,
    validateAndRunWorkout,
    nameInvalid,
    getExceededMaxGoals,
  }
}
