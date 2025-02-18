<script setup lang="ts">
import ExerciseCard from '@/components/ExerciseCard.vue'
import { useEditingExercise } from '@/composables/exercises-list/editingExercise'
import { useExercisesStore } from '@/stores/exercisesStore'
import { useConfirm } from 'primevue/useconfirm'
import { computed } from 'vue'
import ExercisesListFilters from '@/components/ExercisesListFilters.vue'
import { difficultyOptions, unitsOptions } from '@/constants'
import { useExercisesListSuggestions } from '@/composables/exercises-list/suggestions'
import { useExercisesListFilter } from '@/composables/exercises-list/filter'
import {
  getInvalidPhotoUrlsList,
  isDifficultyValid,
  isNameValid,
  isUnitsListValid,
  isVideoUrlValid,
} from '@/utils/validation'
import EditExerciseDialog from '@/components/EditExerciseDialog.vue'

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
  difficultyInvalid,
  unitsListInvalid,
  photoUrlListInvalid,
  videoUrlInvalid,
} = useEditingExercise()

const { filteredExercisesList, filtersObject } = useExercisesListFilter()

const {
  showSportsItemsSuggestions: showSISuggestionsFilter,
  showTagsSuggestions: showTSuggestionsFilter,
  sportsItemsSuggestions: SISuggestionsFilter,
  tagsSuggestions: TSuggestionsFilter,
} = useExercisesListSuggestions('filter')

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
    <EditExerciseDialog
      v-model:edit-exercise-dialog-visible="editExerciseDialogVisible"
      v-model:editing-exercise="editingExercise"
      v-model:name-invalid="nameInvalid"
      v-model:difficulty-invalid="difficultyInvalid"
      v-model:units-list-invalid="unitsListInvalid"
      v-model:photo-url-list-invalid="photoUrlListInvalid"
      v-model:video-url-invalid="videoUrlInvalid"
      :dialog-header="dialogHeader"
      :save-editing-exercise="saveEditingExercise"
      @remove-exercise-photo-url="removeExercisePhotoUrl"
      @add-exercise-photo-url="addExercisePhotoUrl"
    />
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
