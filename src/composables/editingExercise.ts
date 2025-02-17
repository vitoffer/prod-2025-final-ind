import { useExercisesStore } from '@/stores/exercisesStore'
import type { Exercise } from '@/types'
import { computedAsync } from '@vueuse/core'
import { computed, ref } from 'vue'

export function useEditingExercise() {
  const exercisesStore = useExercisesStore()

  const nullExercise: Omit<Exercise, 'id'> = {
    name: '',
    videoUrl: '',
    photoUrlList: [''],
    description: '',
    difficulty: 'простое',
    sportsItems: [],
    tags: [],
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
        videoUrl: foundExercise.videoUrl ?? '',
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

  const formatExercise = (exercise: Exercise): Exercise => {
    return {
      id: exercise.id,
      name: exercise.name.trim(),
      videoUrl: exercise.videoUrl === '' ? null : exercise.videoUrl,
      photoUrlList: exercise.photoUrlList,
      description: exercise.description == '' ? null : exercise.description,
      difficulty: exercise.difficulty,
      sportsItems: exercise.sportsItems,
      tags: exercise.tags,
    }
  }

  const saveEditingExercise = () => {
    if (
      edExNameInvalid.value ||
      edExDiffInvalid.value ||
      edExPhotoUrlListInvalid.value.includes(true) ||
      edExVideoUrlInvalid.value
    ) {
      return
    }

    const formattedExercise = formatExercise(editingExercise.value)

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

  const isImageUrl = async (url: string) => {
    if (!/https:\/\/.+/.test(url)) {
      return false
    }
    if (/https:\/\/.+\.[(jpg)(jpeg)(png)(webp)(gif)(svg)]/.test(url)) {
      return true
    }
    try {
      const response = await fetch(url, { method: 'HEAD' })
      return response.ok && response.headers.get('Content-Type')?.startsWith('image/')
    } catch (error) {
      console.error('Ошибка при проверке URL:', error)
      return false
    }
  }

  const edExNameInvalid = computed<boolean>(() => {
    return editingExercise.value.name.trim() === ''
  })

  const edExDiffInvalid = computed<boolean>(() => {
    return editingExercise.value.difficulty === null
  })

  const edExPhotoUrlListInvalid = computedAsync(async () => {
    const invalidList = await Promise.all(
      editingExercise.value.photoUrlList.map(async (url) => {
        console.log(url)
        if (url.trim() === '') {
          return true
        }
        return !(await isImageUrl(url))
      }),
    )

    return invalidList
  }, new Array(editingExercise.value.photoUrlList.length).fill(false))

  const edExVideoUrlInvalid = computed<boolean>(() => {
    if (editingExercise.value.videoUrl!.trim() === '') {
      return false
    }
    if (!/https:\/\/www.youtube.com\/embed\/.+/.test(editingExercise.value.videoUrl!)) {
      return true
    }
    return false
  })

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
    edExPhotoUrlListInvalid,
    edExVideoUrlInvalid,
  }
}
