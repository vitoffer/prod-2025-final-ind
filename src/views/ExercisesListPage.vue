<script setup lang="ts">
import ExerciseCard from '@/components/ExerciseCard.vue'
import { useExercisesStore } from '@/stores/exercisesStore'
import type { Exercise, ExerciseDifficulty } from '@/types'
import { FloatLabel } from 'primevue'
import { useConfirm } from 'primevue/useconfirm'
import { ref } from 'vue'

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

const saveEditingExercise = () => {
  const formattedExercise: Exercise = {
    ...editingExercise.value,
    videoUrl: editingExercise.value.videoUrl === '' ? null : editingExercise.value.videoUrl,
    description:
      editingExercise.value.description === '' ? null : editingExercise.value.description,
  }

  const existingExercise = exercisesStore.list.find(
    (exercise) => exercise.id === editingExercise.value.id,
  )

  if (existingExercise) {
    exercisesStore.updateExercise(existingExercise.id, formattedExercise)
  } else {
    exercisesStore.createExercise(formattedExercise)
  }

  editExerciseDialogVisible.value = false
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

const difficultyOptions = ref<ExerciseDifficulty[]>(['простое', 'среднее', 'сложное'])
const sportsItemsOptions = ref<{ name: string }[]>([
  { name: 'гантели' },
  { name: 'штанга' },
  { name: 'скакалка' },
])
const tagsOptions = ref<{ name: string }[]>([
  { name: 'на ноги' },
  { name: 'на бицепс' },
  { name: 'на спину' },
  { name: '12222' },
  { name: '22222' },
  { name: '22223' },
  { name: '42222' },
  { name: '522222222' },
  { name: '6' },
  { name: '7' },
  { name: '8' },
  { name: '0' },
])
</script>

<template>
  <header class="header flex justify-around">
    <div class="filters"></div>
    <Button @click="createExercise"><i class="pi pi-plus"></i></Button>
  </header>
  <div class="exercises-list-container flex justify-evenly">
    <ConfirmDialog></ConfirmDialog>
    <Dialog v-model:visible="editExerciseDialogVisible" modal header="Редактирование упражнения">
      <div class="flex flex-col">
        <FloatLabel variant="in" class="mb-2">
          <InputText id="edExName" v-model="editingExercise.name" />
          <label for="edExName">Название</label>
        </FloatLabel>
        <span class="mb-1">Сложность</span>
        <SelectButton
          v-model="editingExercise.difficulty"
          :options="difficultyOptions"
          class="mb-2"
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
        />
        <Button @click="addExercisePhotoUrl"><i class="pi pi-plus"></i></Button>
        <InputText v-model="editingExercise.videoUrl" type="text" placeholder="Ссылка на видео" />
        <Button @click="saveEditingExercise" severity="success">Сохранить</Button>
        <Button @click="editExerciseDialogVisible = false" severity="danger">Отменить</Button>
      </div>
    </Dialog>
    <ExerciseCard
      v-for="exercise in exercisesStore.list"
      :key="exercise.id"
      :exercise="exercise"
      @remove-exercise="confirmRemove"
      @change-exercise="changeExercise"
    />
  </div>
</template>

<style scoped lang="scss"></style>
