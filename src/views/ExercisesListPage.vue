<script setup lang="ts">
import ExerciseCard from '@/components/ExerciseCard.vue'
import { useEditingExercise } from '@/composables/exercises-list/editingExercise'
import { useExercisesStore } from '@/stores/exercisesStore'
import type { ExerciseUnit } from '@/types'
import { useConfirm } from 'primevue/useconfirm'
import { computed } from 'vue'
import ExercisesListFilters from '@/components/ExercisesListFilters.vue'
import { difficultyOptions } from '@/constants'
import { useExercisesListSuggestions } from '@/composables/exercises-list/suggestions'
import { useExercisesListFilter } from '@/composables/exercises-list/filter'

const confirm = useConfirm()

const exercisesStore = useExercisesStore()

const {
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
} = useEditingExercise()

const { filteredExercisesList, filtersObject } = useExercisesListFilter()
const {
  showSportsItemsSuggestions: showSISuggestionsFilter,
  showTagsSuggestions: showTSuggestionsFilter,
  sportsItemsSuggestions: SISuggestionsFilter,
  tagsSuggestions: TSuggestionsFilter,
} = useExercisesListSuggestions('filter')

const {
  showSportsItemsSuggestions: showSISuggestionsEditing,
  showTagsSuggestions: showTSuggestionsEditing,
  sportsItemsSuggestions: SISuggestionsEditing,
  tagsSuggestions: TSuggestionsEditing,
} = useExercisesListSuggestions('editing')

const unitsOptions: ExerciseUnit[] = ['кг', 'мин', 'повт']

function confirmRemove(id: number) {
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

const dialogHeader = computed<string>(() => {
  if (exercisesStore.list.find((exercise) => exercise.id === editingExercise.value.id)) {
    return 'Редактирование упражнения'
  }
  return 'Создание упражнения'
})
</script>

<template>
  <header class="header flex flex-col justify-around lg:flex-row lg:items-center">
    <ExercisesListFilters
      v-model:filters-object="filtersObject"
      :sports-items-select-suggestions="SISuggestionsFilter"
      :tags-select-suggestions="TSuggestionsFilter"
      @search-sports-items-select="showSISuggestionsFilter"
      @search-tags-select="showTSuggestionsFilter"
    />
    <Button @click="createExercise" class=""><i class="pi pi-plus"></i></Button>
  </header>
  <main class="exercises-list-container flex flex-wrap justify-evenly">
    <ConfirmDialog></ConfirmDialog>
    <Dialog v-model:visible="editExerciseDialogVisible" modal :header="dialogHeader">
      <div class="flex flex-col">
        <FloatLabel variant="in" class="mb-2">
          <InputText
            v-model="editingExercise.name"
            :invalid="nameInvalid"
            @input="() => (nameInvalid = validateName(editingExercise))"
            id="edExName"
          />
          <label for="edExName">Название</label>
        </FloatLabel>
        <span class="mb-1">Сложность</span>
        <SelectButton
          v-model="editingExercise.difficulty"
          :options="difficultyOptions"
          class="mb-2"
          :invalid="diffInvalid"
          @change="() => (diffInvalid = validateDiff(editingExercise))"
        />
        <FloatLabel variant="in" class="mb-2">
          <Textarea v-model="editingExercise.description" id="edExDesc" rows="5" cols="30" />
          <label for="edExDesc">Описание</label>
        </FloatLabel>
        <AutoComplete
          v-model="editingExercise.sportsItems"
          multiple
          :suggestions="SISuggestionsEditing"
          @complete="showSISuggestionsEditing"
          id="editingSportsItems"
          placeholder="Инвентарь"
        />
        <AutoComplete
          v-model="editingExercise.tags"
          multiple
          :suggestions="TSuggestionsEditing"
          @complete="showTSuggestionsEditing"
          id="editingTags"
          placeholder="Теги"
        />
        <SelectButton
          v-model="editingExercise.units"
          :options="unitsOptions"
          class="mb-2"
          :invalid="unitsInvalid"
          multiple
          @change="() => (unitsInvalid = validateUnits(editingExercise))"
        />
        <InputText
          v-for="(input, index) in editingExercise.photoUrlList"
          :key="index"
          v-model="editingExercise.photoUrlList[index]"
          type="text"
          placeholder="Ссылка на фото"
          :invalid="photoUrlListInvalid[index]"
          @input="async () => (photoUrlListInvalid = await validatePhotoUrlList(editingExercise))"
        />
        <div class="flex justify-center">
          <Button @click="removeExercisePhotoUrl" severity="danger">
            <i class="pi pi-minus"></i>
          </Button>
          <Button @click="addExercisePhotoUrl" severity="success">
            <i class="pi pi-plus"></i>
          </Button>
        </div>
        <InputText
          v-model="editingExercise.video!.url"
          type="text"
          placeholder="Ссылка на видео-файл или на видео youtube или rutube"
          :invalid="videoUrlInvalid"
          @input="async () => (videoUrlInvalid = await validateVideoUrl(editingExercise))"
          class="w-[500px]"
        />
        <div class="flex w-full justify-evenly">
          <Button @click="editExerciseDialogVisible = false" severity="danger">Отменить</Button>
          <Button @click="saveEditingExercise" severity="success">Сохранить</Button>
        </div>
      </div>
    </Dialog>
    <ExerciseCard
      v-for="exercise in filteredExercisesList"
      :key="exercise.id"
      :exercise="exercise"
      @remove-exercise="confirmRemove"
      @change-exercise="(id) => changeExercise(id, findExercise)"
    />
  </main>
</template>

<style scoped lang="scss"></style>
