<script setup lang="ts">
import { useExercisesListSuggestions } from '@/composables/exercises-list/suggestions'
import { difficultyOptions, unitsOptions } from '@/constants'
import type { Exercise } from '@/types'
import {
  getInvalidPhotoUrlsList,
  isDifficultyValid,
  isNameValid,
  isUnitsListValid,
  isVideoUrlValid,
} from '@/utils/validation'

defineProps<{
  dialogHeader: string
  saveEditingExercise: () => void
}>()

defineEmits<{ removeExercisePhotoUrl: []; addExercisePhotoUrl: [] }>()

const editExerciseDialogVisible = defineModel<boolean>('editExerciseDialogVisible')
const editingExercise = defineModel<Exercise>('editingExercise')
const nameInvalid = defineModel<boolean>('nameInvalid')
const difficultyInvalid = defineModel<boolean>('difficultyInvalid')
const unitsListInvalid = defineModel<boolean>('unitsListInvalid')
const photoUrlListInvalid = defineModel<boolean[]>('photoUrlListInvalid')
const videoUrlInvalid = defineModel<boolean>('videoUrlInvalid')

const {
  showSportsItemsSuggestions: showSportsItemsSuggestions,
  showTagsSuggestions: showTagsSuggestions,
  sportsItemsSuggestions: sportsItemsSuggestions,
  tagsSuggestions: tagsSuggestions,
} = useExercisesListSuggestions('editing')
</script>

<template>
  <Dialog v-model:visible="editExerciseDialogVisible" modal :header="dialogHeader">
    <div class="flex flex-col">
      <FloatLabel variant="in" class="mb-2">
        <InputText
          v-model="editingExercise!.name"
          :invalid="nameInvalid"
          @input="() => (nameInvalid = !isNameValid(editingExercise!))"
          id="edExName"
        />
        <label for="edExName">Название</label>
      </FloatLabel>
      <span class="mb-1">Сложность</span>
      <SelectButton
        v-model="editingExercise!.difficulty"
        :options="difficultyOptions"
        class="mb-2"
        :invalid="difficultyInvalid"
        @change="() => (difficultyInvalid = !isDifficultyValid(editingExercise!))"
      />
      <FloatLabel variant="in" class="mb-2">
        <Textarea v-model="editingExercise!.description" id="edExDesc" rows="5" cols="30" />
        <label for="edExDesc">Описание</label>
      </FloatLabel>
      <AutoComplete
        v-model="editingExercise!.sportsItems"
        multiple
        :suggestions="sportsItemsSuggestions"
        @complete="showSportsItemsSuggestions"
        id="editingSportsItems"
        placeholder="Инвентарь"
      />
      <AutoComplete
        v-model="editingExercise!.tags"
        multiple
        :suggestions="tagsSuggestions"
        @complete="showTagsSuggestions"
        id="editingTags"
        placeholder="Теги"
      />
      <SelectButton
        v-model="editingExercise!.units"
        :options="unitsOptions"
        class="mb-2"
        :invalid="unitsListInvalid"
        multiple
        @change="() => (unitsListInvalid = !isUnitsListValid(editingExercise!))"
      />
      <InputText
        v-for="(input, index) in editingExercise!.photoUrlList"
        :key="index"
        v-model="editingExercise!.photoUrlList[index]"
        type="text"
        placeholder="Ссылка на фото"
        :invalid="photoUrlListInvalid![index]"
        @input="async () => (photoUrlListInvalid = await getInvalidPhotoUrlsList(editingExercise!))"
      />
      <div class="flex justify-center">
        <Button @click="$emit('removeExercisePhotoUrl')" severity="danger">
          <i class="pi pi-minus"></i>
        </Button>
        <Button @click="$emit('addExercisePhotoUrl')" severity="success">
          <i class="pi pi-plus"></i>
        </Button>
      </div>
      <InputText
        v-model="editingExercise!.video!.url"
        type="text"
        placeholder="Ссылка на видео-файл или на видео youtube или rutube"
        :invalid="videoUrlInvalid"
        @input="async () => (videoUrlInvalid = !(await isVideoUrlValid(editingExercise!)))"
        class="w-[500px]"
      />
      <div class="flex w-full justify-evenly">
        <Button @click="editExerciseDialogVisible = false" severity="danger">Отменить</Button>
        <Button @click="saveEditingExercise" severity="success">Сохранить</Button>
      </div>
    </div>
  </Dialog>
</template>

<style scoped></style>
