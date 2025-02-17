import { useExercisesStore } from '@/stores/exercisesStore'
import type { Exercise, ExerciseVideo } from '@/types'
import { correctVideoUrl, isCorrectImageUrl } from '@/utils'
import { computedAsync } from '@vueuse/core'
import { computed, ref } from 'vue'

export function useEditingExercise() {
  const exercisesStore = useExercisesStore()

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

  const editingExercise = ref<Exercise>({
    ...nullExercise,
    id: exercisesStore.list[exercisesStore.list.length - 1].id + 1,
  })
  const editExerciseDialogVisible = ref<boolean>(false)

  const changeExercise = (id: number) => {
    editExerciseDialogVisible.value = true

    const foundExercise = JSON.parse(
      JSON.stringify(exercisesStore.list.find((exercise) => exercise.id === id)),
    )

    if (foundExercise === undefined) {
      editingExercise.value = {
        ...nullExercise,
        id: exercisesStore.list[exercisesStore.list.length - 1].id + 1,
      }
    } else {
      editingExercise.value = {
        ...foundExercise,
        video: foundExercise.video ?? { type: 'video', url: '' },
        description: foundExercise.description ?? '',
      }
    }
  }

  const createExercise = () => {
    editExerciseDialogVisible.value = true
    editingExercise.value = {
      ...nullExercise,
      id: exercisesStore.list[exercisesStore.list.length - 1].id + 1,
    }
  }

  const addExercisePhotoUrl = () => {
    editingExercise.value.photoUrlList.push('')
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
    if (
      edExNameInvalid.value ||
      edExDiffInvalid.value ||
      edExUnitsInvalid.value ||
      edExPhotoUrlListInvalid.value.includes(true) ||
      edExVideoUrlInvalid.value
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

  const edExNameInvalid = computed<boolean>(() => {
    return editingExercise.value.name.trim() === ''
  })

  const edExDiffInvalid = computed<boolean>(() => {
    return editingExercise.value.difficulty === null
  })

  const edExUnitsInvalid = computed<boolean>(() => {
    if (editingExercise.value.units.length === 0) {
      return true
    }
    if (
      editingExercise.value.units.includes('мин') &&
      (editingExercise.value.units.includes('кг') || editingExercise.value.units.includes('повт'))
    ) {
      return true
    }
    return false
  })

  const edExPhotoUrlListInvalid = computedAsync(async () => {
    const invalidList = await Promise.all(
      editingExercise.value.photoUrlList.map(async (url) => {
        if (url.trim() === '') {
          return true
        }
        return !(await isCorrectImageUrl(url))
      }),
    )

    return invalidList
  }, new Array(editingExercise.value.photoUrlList.length).fill(false))

  const edExVideoUrlInvalid = computedAsync(async () => {
    if (editingExercise.value.video!.url.trim() === '') {
      return false
    }

    const { error } = await correctVideoUrl(editingExercise.value.video!.url)
    if (error) {
      return true
    }

    return false
  }, false)

  return {
    editingExercise,
    editExerciseDialogVisible,
    changeExercise,
    createExercise,
    addExercisePhotoUrl,
    removeExercisePhotoUrl,
    saveEditingExercise,
    edExNameInvalid,
    edExDiffInvalid,
    edExUnitsInvalid,
    edExPhotoUrlListInvalid,
    edExVideoUrlInvalid,
  }
}
