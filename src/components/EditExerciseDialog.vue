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
    <div class="flex flex-col gap-2">
      <FloatLabel variant="in">
        <InputText
          v-model="editingExercise!.name"
          :invalid="nameInvalid"
          @input="() => (nameInvalid = !isNameValid(editingExercise!))"
          id="edExName"
          class="w-full"
        />
        <label for="edExName">Название</label>
      </FloatLabel>
      <div class="mr-auto ml-auto md:mr-0 md:ml-0">
        <p class="mb-1 text-center md:text-start">Сложность</p>
        <SelectButton
          v-model="editingExercise!.difficulty"
          :options="difficultyOptions"
          :invalid="difficultyInvalid"
          @change="() => (difficultyInvalid = !isDifficultyValid(editingExercise!))"
        />
      </div>
      <FloatLabel variant="in">
        <Textarea v-model="editingExercise!.description" id="edExDesc" rows="5" class="w-full" />
        <label for="edExDesc">Описание</label>
      </FloatLabel>
      <FloatLabel variant="in">
        <AutoComplete
          v-model="editingExercise!.sportsItems"
          multiple
          :suggestions="sportsItemsSuggestions"
          @complete="showSportsItemsSuggestions"
          id="editingSportsItems"
          class="w-full"
        />
        <label for="editingSportsItems">Инвентарь</label>
      </FloatLabel>
      <FloatLabel variant="in">
        <AutoComplete
          v-model="editingExercise!.tags"
          multiple
          :suggestions="tagsSuggestions"
          @complete="showTagsSuggestions"
          id="editingTags"
          class="w-full"
        />
        <label for="editingTags">Теги</label>
      </FloatLabel>
      <SelectButton
        v-model="editingExercise!.units"
        :options="unitsOptions"
        :invalid="unitsListInvalid"
        multiple
        @change="() => (unitsListInvalid = !isUnitsListValid(editingExercise!))"
        class="mr-auto ml-auto md:mr-0 md:ml-0"
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
      <div class="flex justify-center gap-4">
        <Button @click="$emit('removeExercisePhotoUrl')" severity="danger">
          <i class="pi pi-minus"></i>
        </Button>
        <Button @click="$emit('addExercisePhotoUrl')" severity="success">
          <i class="pi pi-plus"></i>
        </Button>
      </div>
      <FloatLabel variant="in" class="w-[500px] max-w-full">
        <InputText
          v-model="editingExercise!.video!.url"
          type="text"
          :invalid="videoUrlInvalid"
          @input="async () => (videoUrlInvalid = !(await isVideoUrlValid(editingExercise!)))"
          id="editingVideoUrl"
          class="w-full"
        />
        <label
          for="editingVideoUrl"
          class="w-full overflow-hidden pr-8 text-ellipsis whitespace-nowrap"
          >Ссылка на видео-файл или на видео youtube или rutube</label
        >
      </FloatLabel>
      <div class="flex w-full justify-evenly">
        <Button @click="editExerciseDialogVisible = false" severity="danger">Отменить</Button>
        <Button @click="saveEditingExercise" severity="success">Сохранить</Button>
      </div>
    </div>
  </Dialog>
</template>

<style scoped></style>
