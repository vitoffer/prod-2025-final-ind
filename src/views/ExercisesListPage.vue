<script setup lang="ts">
import ExerciseCard from '@/components/ExerciseCard.vue'
import { formatExercise } from '@/modules/exercises-list/form-validators'
import { useExercisesStore } from '@/stores/exercisesStore'
import type { Exercise, ExerciseDifficulty } from '@/types'
import { computedAsync } from '@vueuse/core'
import { FloatLabel, type AutoCompleteCompleteEvent } from 'primevue'
import { useConfirm } from 'primevue/useconfirm'
import { computed, ref } from 'vue'

const confirm = useConfirm()

const confirmRemove = (id: number) => {
  confirm.require({
    message: 'Вы уверены, что хотите удалить это упражнение?',
    header: 'Подтверждение',
    icon: 'pi pi-exclamation-triangle !text-red-400',
    rejectProps: {
      label: 'Отмена',
      severity: 'secondary',
      outlined: true,
    },
    acceptProps: {
      label: 'Удалить',
      severity: 'danger',
    },
    accept: () => {
      exercisesStore.removeExercise(id)
    },
  })
}

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

const searchSportsItemsSelect = (event: AutoCompleteCompleteEvent) => {
  sportsItemsSelectSuggestions.value = sportsItemsOptions.value
    .filter((option) => option.name.toLowerCase().includes(event.query.toLowerCase()))
    .map((option) => option.name)
}

const searchTagsSelect = (event: AutoCompleteCompleteEvent) => {
  tagsSelectSuggestions.value = tagsOptions.value
    .filter((option) => option.name.toLowerCase().includes(event.query.toLowerCase()))
    .map((option) => option.name)
}

const filterExerciseList = () => {
  filteredExercisesList.value = exercisesStore.list.filter((exercise) => {
    const matchesName =
      filtersObj.value.name === '' ||
      exercise.name.toLowerCase().includes(filtersObj.value.name.toLowerCase())
    const matchesDescription =
      filtersObj.value.description === '' ||
      exercise.description?.toLowerCase().includes(filtersObj.value.description.toLowerCase())
    const matchesDifficulty =
      filtersObj.value.difficulty === null || exercise.difficulty === filtersObj.value.difficulty
    const matchesSportsItems =
      filtersObj.value.sportsItems.length === 0 ||
      filtersObj.value.sportsItems.some((item) => exercise.sportsItems.includes(item))
    const matchesTags =
      filtersObj.value.tags.length === 0 ||
      filtersObj.value.tags.some((tag) => exercise.tags.includes(tag))

    return (
      matchesName && matchesDescription && matchesDifficulty && matchesSportsItems && matchesTags
    )
  })
}

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

const editExerciseDialogVisible = ref<boolean>(false)
const editingExercise = ref<Exercise>({
  ...nullExercise,
  id: exercisesStore.list[exercisesStore.list.length - 1].id + 1,
})

const filteredExercisesList = ref<Exercise[]>(exercisesStore.list)

const difficultyOptions = ref<ExerciseDifficulty[]>(['простое', 'среднее', 'сложное'])
const sportsItemsOptions = computed<{ name: string }[]>(() => {
  const list: { name: string }[] = []

  for (const exercise of exercisesStore.list) {
    for (const sportsItem of exercise.sportsItems) {
      if (!list.find((elem) => elem.name === sportsItem)) {
        list.push({ name: sportsItem })
      }
    }
  }

  return list
})
const tagsOptions = computed<{ name: string }[]>(() => {
  const list: { name: string }[] = []

  for (const exercise of exercisesStore.list) {
    for (const tag of exercise.tags) {
      if (!list.find((elem) => elem.name === tag)) {
        list.push({ name: tag })
      }
    }
  }

  return list
})
const sportsItemsSelectSuggestions = ref<string[]>([])
const tagsSelectSuggestions = ref<string[]>([])

interface FiltersObject {
  name: string
  description: string
  difficulty: string
  sportsItems: string[]
  tags: string[]
}

const filtersObj = ref<FiltersObject>({
  name: '',
  description: '',
  difficulty: '',
  sportsItems: [],
  tags: [],
})

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
</script>

<template>
  <header class="header flex justify-around">
    <div>
      <p>Фильтры</p>
      <ul class="filters flex">
        <li>
          <FloatLabel variant="in" class="mb-2">
            <InputText id="filterName" v-model="filtersObj.name" @input="filterExerciseList" />
            <label for="filterName">Название</label>
          </FloatLabel>
        </li>
        <li>
          <FloatLabel variant="in" class="mb-2">
            <InputText
              id="filterName"
              v-model="filtersObj.description"
              @input="filterExerciseList"
            />
            <label for="filterName">Описание</label>
          </FloatLabel>
        </li>
        <li>
          <p>Сложность</p>
          <SelectButton
            v-model="filtersObj.difficulty"
            :options="difficultyOptions"
            @change="filterExerciseList"
          ></SelectButton>
        </li>
        <li>
          <FloatLabel variant="in" class="mb-2">
            <AutoComplete
              v-model="filtersObj.sportsItems"
              multiple
              :suggestions="sportsItemsSelectSuggestions"
              @complete="searchSportsItemsSelect"
              id="filterSportsItems"
              @change="filterExerciseList"
            ></AutoComplete>
            <label for="filterSportsItems">Инвентарь</label>
          </FloatLabel>
        </li>
        <li>
          <FloatLabel variant="in" class="mb-2">
            <AutoComplete
              v-model="filtersObj.tags"
              multiple
              :suggestions="tagsSelectSuggestions"
              @complete="searchTagsSelect"
              id="filterTags"
              @change="filterExerciseList"
            ></AutoComplete>
            <label for="filterTags">Теги</label>
          </FloatLabel>
        </li>
      </ul>
    </div>
    <Button @click="createExercise"><i class="pi pi-plus"></i></Button>
  </header>
  <div class="exercises-list-container flex justify-evenly">
    <ConfirmDialog></ConfirmDialog>
    <Dialog v-model:visible="editExerciseDialogVisible" modal header="Редактирование упражнения">
      <div class="flex flex-col">
        <FloatLabel variant="in" class="mb-2">
          <InputText id="edExName" v-model="editingExercise.name" :invalid="edExNameInvalid" />
          <label for="edExName">Название</label>
        </FloatLabel>
        <span class="mb-1">Сложность</span>
        <SelectButton
          v-model="editingExercise.difficulty"
          :options="difficultyOptions"
          class="mb-2"
          :invalid="edExDiffInvalid"
        />
        <FloatLabel variant="in" class="mb-2">
          <Textarea v-model="editingExercise.description" id="edExDesc" rows="5" cols="30" />
          <label for="edExDesc">Описание</label>
        </FloatLabel>
        <MultiSelect
          v-model="editingExercise.sportsItems"
          :options="sportsItemsOptions"
          option-label="name"
          option-value="name"
          filter
          placeholder="Инвентарь"
        ></MultiSelect>
        <MultiSelect
          v-model="editingExercise.tags"
          :options="tagsOptions"
          option-label="name"
          option-value="name"
          filter
          placeholder="Теги"
        ></MultiSelect>
        <InputText
          v-for="(input, index) in editingExercise.photoUrlList"
          :key="index"
          v-model="editingExercise.photoUrlList[index]"
          type="text"
          placeholder="Ссылка на фото"
          :invalid="edExPhotoUrlListInvalid[index]"
        />
        <div class="flex justify-center">
          <Button @click="addExercisePhotoUrl" severity="success">
            <i class="pi pi-plus"></i>
          </Button>
          <Button @click="removeExercisePhotoUrl" severity="danger">
            <i class="pi pi-minus"></i>
          </Button>
        </div>
        <InputText
          v-model="editingExercise.videoUrl"
          type="text"
          placeholder="Ссылка на видео"
          :invalid="edExVideoUrlInvalid"
        />
        <div class="flex w-full justify-evenly">
          <Button @click="saveEditingExercise" severity="success">Сохранить</Button>
          <Button @click="editExerciseDialogVisible = false" severity="danger">Отменить</Button>
        </div>
      </div>
    </Dialog>
    <ExerciseCard
      v-for="exercise in filteredExercisesList"
      :key="exercise.id"
      :exercise="exercise"
      @remove-exercise="confirmRemove"
      @change-exercise="changeExercise"
    />
  </div>
</template>

<style scoped lang="scss"></style>
