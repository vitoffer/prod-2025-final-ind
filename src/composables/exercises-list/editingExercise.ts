import { useExercisesStore } from '@/stores/exercisesStore'
import type { Exercise, ExerciseVideo } from '@/types'
import { correctVideoUrl } from '@/utils'
import { useEditingEntity } from '../editingEntity'
import { useValidation } from '../validation'
import { useExerciseValidation } from './exerciseValidation'

export function useEditingExercise() {
  const exercisesStore = useExercisesStore()
  const { nameInvalid, validateName } = useValidation()
  const {
    diffInvalid,
    unitsInvalid,
    photoUrlListInvalid,
    videoUrlInvalid,
    validateDiff,
    validateUnits,
    validatePhotoUrlList,
    validateVideoUrl,
  } = useExerciseValidation()

  const nullExercise: Omit<Exercise, 'id'> = {
    name: '',
    video: {
      type: 'video',
      url: '',
    },
    photoUrlList: [''],
    description: '',
    difficulty: 'простое',
    sportsItems: [],
    tags: [],
    units: [],
  }

  const getNextId = () => exercisesStore.list[exercisesStore.list.length - 1].id + 1
  const findExercise = (id: number) =>
    JSON.parse(JSON.stringify(exercisesStore.list.find((exercise) => exercise.id === id)))

  const {
    changeEntity,
    createEntity,
    editDialogVisible: editExerciseDialogVisible,
    editingEntity: editingExercise,
  } = useEditingEntity<Exercise>(nullExercise, getNextId)

  function createExercise(...args: Parameters<typeof createEntity>) {
    nameInvalid.value = false
    diffInvalid.value = false
    unitsInvalid.value = false
    photoUrlListInvalid.value = new Array(editingExercise.value.photoUrlList.length).fill(false)
    videoUrlInvalid.value = false

    createEntity(...args)
  }

  function changeExercise(...args: Parameters<typeof changeEntity>) {
    nameInvalid.value = false
    diffInvalid.value = false
    unitsInvalid.value = false
    photoUrlListInvalid.value = new Array(editingExercise.value.photoUrlList.length).fill(false)
    videoUrlInvalid.value = false

    changeEntity(...args)

    editingExercise.value = {
      ...editingExercise.value,
      video:
        editingExercise.value.video === null
          ? { type: 'video', url: '' }
          : editingExercise.value.video,
      description:
        editingExercise.value.description === null ? '' : editingExercise.value.description,
    }
  }

  const addExercisePhotoUrl = () => {
    editingExercise.value.photoUrlList.push('')
    photoUrlListInvalid.value = new Array(editingExercise.value.photoUrlList.length).fill(false)
  }

  const removeExercisePhotoUrl = () => {
    editingExercise.value.photoUrlList = editingExercise.value.photoUrlList.slice(
      0,
      editingExercise.value.photoUrlList.length - 1,
    )
  }

  const formatExercise = async (exercise: Exercise): Promise<Exercise> => {
    const { error, type, url } = await correctVideoUrl(exercise.video!.url)
    return {
      id: exercise.id,
      name: exercise.name.trim(),
      video: error || exercise.video!.url === '' ? null : ({ type, url } as ExerciseVideo),
      photoUrlList: exercise.photoUrlList,
      description: exercise.description == '' ? null : exercise.description,
      difficulty: exercise.difficulty,
      sportsItems: exercise.sportsItems,
      tags: exercise.tags,
      units: exercise.units,
    }
  }

  const saveEditingExercise = async () => {
    nameInvalid.value = validateName(editingExercise.value)
    diffInvalid.value = validateDiff(editingExercise.value)
    unitsInvalid.value = validateUnits(editingExercise.value)
    photoUrlListInvalid.value = await validatePhotoUrlList(editingExercise.value)
    videoUrlInvalid.value = await validateVideoUrl(editingExercise.value)

    if (
      nameInvalid.value ||
      diffInvalid.value ||
      unitsInvalid.value ||
      photoUrlListInvalid.value.includes(true) ||
      videoUrlInvalid.value
    ) {
      return
    }

    const formattedExercise = await formatExercise(editingExercise.value)

    const existingExercise = exercisesStore.list.find(
      (exercise) => exercise.id === formattedExercise.id,
    )

    if (existingExercise) {
      exercisesStore.updateExercise(existingExercise.id, formattedExercise)
    } else {
      exercisesStore.createExercise(formattedExercise)
    }

    editExerciseDialogVisible.value = false
  }

  return {
    editingExercise,
    editExerciseDialogVisible,
    findExercise,
    changeExercise,
    createExercise,
    addExercisePhotoUrl,
    removeExercisePhotoUrl,
    saveEditingExercise,
    nameInvalid,
    validateName,
    diffInvalid,
    validateDiff,
    unitsInvalid,
    validateUnits,
    photoUrlListInvalid,
    validatePhotoUrlList,
    videoUrlInvalid,
    validateVideoUrl,
  }
}
