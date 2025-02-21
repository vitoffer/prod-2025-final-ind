import { useExercisesStore } from '@/stores/exercisesStore'
import type { Exercise, ExerciseVideo } from '@/types'
import { useExerciseValidation } from './exerciseValidation'
import { correctVideoUrl } from '@/utils/media'
import {
  getInvalidPhotoUrlsList,
  isNameValid,
  isUnitsListValid,
  isVideoUrlValid,
} from '@/utils/validation'
import type { ToastMessageOptions } from 'primevue'
import { ref } from 'vue'
import { nullExercise } from '@/constants'
import { useWorkoutsStore } from '@/stores/workoutsStore'

export function useEditingExercise(showToast: (options: ToastMessageOptions) => void) {
  const exercisesStore = useExercisesStore()
  const workoutsStore = useWorkoutsStore()
  const { nameInvalid, unitsListInvalid, photoUrlListInvalid, videoUrlInvalid } =
    useExerciseValidation()

  const getNextId = () => exercisesStore.list[exercisesStore.list.length - 1].id + 1
  const findExercise = (id: number) =>
    JSON.parse(JSON.stringify(exercisesStore.list.find((exercise) => exercise.id === id)))

  const editingExercise = ref<Exercise>({
    ...nullExercise,
    id: getNextId(),
  })

  const editExerciseDialogVisible = ref<boolean>(false)

  const createExercise = () => {
    editExerciseDialogVisible.value = true
    editingExercise.value = {
      ...nullExercise,
      id: getNextId(),
    }

    setAllFieldsValid()
  }

  const changeExercise = (id: number) => {
    editExerciseDialogVisible.value = true

    const foundExercise = findExercise(id)
    editingExercise.value = foundExercise || {
      ...nullExercise,
      id: getNextId(),
    }

    editingExercise.value = {
      ...editingExercise.value,
      video:
        editingExercise.value.video === null
          ? { type: 'video', url: '' }
          : editingExercise.value.video,
      description:
        editingExercise.value.description === null ? '' : editingExercise.value.description,
    }

    setAllFieldsValid()
  }

  function setAllFieldsValid() {
    nameInvalid.value = false
    unitsListInvalid.value = false
    photoUrlListInvalid.value = new Array(editingExercise.value.photoUrlList.length).fill(false)
    videoUrlInvalid.value = false
  }

  const addExercisePhotoUrl = () => {
    editingExercise.value.photoUrlList.push('')
    photoUrlListInvalid.value = new Array(editingExercise.value.photoUrlList.length).fill(false)
  }

  const removeExercisePhotoUrl = () => {
    if (editingExercise.value.photoUrlList.length === 0) return

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
      unitsList: exercise.unitsList,
    }
  }

  const saveEditingExercise = async () => {
    nameInvalid.value = !isNameValid(editingExercise.value)
    unitsListInvalid.value = !isUnitsListValid(editingExercise.value)
    photoUrlListInvalid.value = await getInvalidPhotoUrlsList(editingExercise.value)
    videoUrlInvalid.value = !(await isVideoUrlValid(editingExercise.value))

    if (nameInvalid.value) {
      showToast({
        summary: 'Некорректное название',
        severity: 'error',
        detail: 'Введите название',
        life: 3000,
      })
      return
    }

    if (unitsListInvalid.value) {
      showToast({
        summary: 'Некорректный список единиц измерения',
        severity: 'error',
        detail: 'Введите хотя бы одну, причем при выборе времени, остальные выбрать нельзя',
        life: 5000,
      })
      return
    }

    if (photoUrlListInvalid.value.includes(true)) {
      showToast({
        summary: 'Некорректный список ссылок на картинки',
        severity: 'error',
        detail: 'Проверьте введенные ссылки и не оставляйте поля пустыми',
        life: 3000,
      })
      return
    }

    if (videoUrlInvalid.value) {
      showToast({
        summary: 'Некорректная ссылка на видео',
        severity: 'error',
        detail: 'Проверьте введенную ссылку',
        life: 3000,
      })
      return
    }

    if (
      !editingExercise.value.description &&
      editingExercise.value.photoUrlList.length === 0 &&
      (!editingExercise.value.video || !editingExercise.value.video.url)
    ) {
      showToast({
        summary: 'Введите хотя бы одно из элементов: описание, изображение(-я), видео',
        severity: 'error',
        life: 3000,
      })
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

    workoutsStore.clearWorkoutsByExercise(formattedExercise)

    editExerciseDialogVisible.value = false
  }

  return {
    editingExercise,
    editExerciseDialogVisible,
    changeExercise,
    createExercise,
    addExercisePhotoUrl,
    removeExercisePhotoUrl,
    saveEditingExercise,
    nameInvalid,
    unitsListInvalid,
    photoUrlListInvalid,
    videoUrlInvalid,
  }
}
