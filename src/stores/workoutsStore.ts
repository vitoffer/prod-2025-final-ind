import { ref, toRaw } from 'vue'
import { defineStore } from 'pinia'
import type {
  Exercise,
  FilledExercisesWorkout,
  FilledExerciseWithGoal,
  Workout,
  WorkoutExercise,
} from '@/types'
import baseWorkoutsList from '@/base-data/workouts'
import { useExercisesStore } from './exercisesStore'
import { nullExercise } from '@/constants'
import { getRecommendedGoal } from '@/utils/recommendations'
import { useUserStore } from './userStore'

export const useWorkoutsStore = defineStore('workouts', () => {
  const list = ref<Workout[]>([])

  const exercisesStore = useExercisesStore()
  const userStore = useUserStore()

  if (localStorage.getItem('workoutsList') === null) {
    list.value = baseWorkoutsList
    localStorage.setItem('workoutsList', JSON.stringify(list.value))
  } else {
    list.value = JSON.parse(localStorage.getItem('workoutsList')!)
  }

  function removeWorkout(id: number) {
    list.value = list.value.filter((workout) => workout.id !== id)

    localStorage.setItem('workoutsList', JSON.stringify(list.value))
  }

  function updateWorkout(id: number, updatedWorkout: Workout) {
    const index = list.value.findIndex((workout) => workout.id === id)
    if (index !== -1) {
      list.value[index] = { ...list.value[index], ...updatedWorkout }
    }

    localStorage.setItem('workoutsList', JSON.stringify(list.value))
  }

  function createWorkout(newWorkout: Workout) {
    list.value.push(newWorkout)

    localStorage.setItem('workoutsList', JSON.stringify(list.value))
  }

  const findWorkout = (id: number): Workout =>
    JSON.parse(JSON.stringify(list.value.find((workout: Workout) => workout.id === id)))

  function clearWorkoutsByExercise(exercise: Exercise) {
    const affectedWorkoutsList = list.value.filter(
      (workout) =>
        !!workout.exercises.find((workoutExercise) => workoutExercise.id === exercise.id),
    )

    const clearedWorkoutsList = affectedWorkoutsList.map((workout) => ({
      id: workout.id,
      name: workout.name,
      exercises: getClearedWorkoutExercises(workout),
    }))

    clearedWorkoutsList.forEach((workout) => {
      updateWorkout(workout.id, workout)
    })
  }

  function getClearedWorkoutExercises(workout: Workout): FilledExerciseWithGoal[] {
    const exercises = workout.exercises.map((workoutExercise: WorkoutExercise) => {
      const fullExercise =
        exercisesStore.list.find((fullExercise) => fullExercise.id === workoutExercise.id) ||
        nullExercise

      const updatedExercise = { ...workoutExercise, ...fullExercise }

      updatedExercise.goal = updatedExercise.goal || {}

      if (fullExercise.unitsList.includes('время')) {
        updatedExercise.goal.time = workoutExercise.goal.time || { minutes: 0, seconds: 0 }
      }
      if (fullExercise.unitsList.includes('подходы')) {
        updatedExercise.goal.sets = workoutExercise.goal.sets || 0
      }
      if (fullExercise.unitsList.includes('повторения')) {
        updatedExercise.goal.repetitions = workoutExercise.goal.repetitions || 0
      }
      if (fullExercise.unitsList.includes('вес')) {
        updatedExercise.goal.weightKg = workoutExercise.goal.weightKg || 0
      }

      const recommendedGoal = getRecommendedGoal(userStore.user, updatedExercise)

      console.log(toRaw(updatedExercise.goal))

      if (
        'time' in updatedExercise.goal &&
        updatedExercise.goal.time!.minutes === 0 &&
        updatedExercise.goal.time!.seconds === 0
      ) {
        updatedExercise.goal.time = recommendedGoal.time
      }
      if ('sets' in updatedExercise.goal && updatedExercise.goal.sets === 0) {
        updatedExercise.goal.sets = recommendedGoal.sets
      }
      if ('repetitions' in updatedExercise.goal && updatedExercise.goal.repetitions === 0) {
        updatedExercise.goal.repetitions = recommendedGoal.repetitions
      }
      if ('weightKg' in updatedExercise.goal && updatedExercise.goal.weightKg === 0) {
        updatedExercise.goal.weightKg = recommendedGoal.weightKg
      }

      console.log(toRaw(updatedExercise.goal))

      if (!fullExercise.unitsList.includes('время')) {
        delete updatedExercise.goal.time
      }
      if (!fullExercise.unitsList.includes('подходы')) {
        delete updatedExercise.goal.sets
      }
      if (!fullExercise.unitsList.includes('повторения')) {
        delete updatedExercise.goal.repetitions
      }
      if (!fullExercise.unitsList.includes('вес')) {
        delete updatedExercise.goal.weightKg
      }

      return updatedExercise
    })

    return exercises
  }

  function getFilledExercisesWorkout(workoutId: number) {
    const foundWorkout = findWorkout(workoutId)
    const clearedWorkoutExercises = getClearedWorkoutExercises(foundWorkout)
    const filledExercisesWorkout: FilledExercisesWorkout = {
      ...foundWorkout,
      exercises: clearedWorkoutExercises,
    }

    return filledExercisesWorkout
  }

  return {
    list,
    removeWorkout,
    updateWorkout,
    createWorkout,
    findWorkout,
    clearWorkoutsByExercise,
    getClearedWorkoutExercises,
    getFilledExercisesWorkout,
  }
})
