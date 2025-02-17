import { useWorkoutsStore } from '@/stores/workoutsStore'
import type { Workout } from '@/types'
import { useEditingEntity } from '../editingEntity'

export const useEditingWorkout = () => {
  const workoutsStore = useWorkoutsStore()

  const nullWorkout: Omit<Workout, 'id'> = {
    name: '',
    exercises: [],
  }

  const getNextId = () => workoutsStore.list[workoutsStore.list.length - 1].id + 1

  const {
    changeEntity: changeWorkout,
    createEntity: createWorkout,
    editDialogVisible: editWorkoutDialogVisible,
    editingEntity: editingWorkout,
  } = useEditingEntity<Workout>(nullWorkout, getNextId)

  return { editingWorkout, editWorkoutDialogVisible, createWorkout, changeWorkout }
}
