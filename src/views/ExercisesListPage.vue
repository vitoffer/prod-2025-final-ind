<script setup lang="ts">
import ExerciseCard from '@/components/ExerciseCard.vue'
import { useEditingExercise } from '@/composables/editingExercise'
import { useFilterExercisesList } from '@/composables/filterExercisesList'
import { useExercisesStore } from '@/stores/exercisesStore'
import type { ExerciseUnit } from '@/types'
import { useConfirm } from 'primevue/useconfirm'
import { computed } from 'vue'

const confirm = useConfirm()

const exercisesStore = useExercisesStore()

const {
  editingExercise,
  editExerciseDialogVisible,
  changeExercise,
  createExercise,
  addExercisePhotoUrl,
  removeExercisePhotoUrl,
  saveEditingExercise,
  edExNameInvalid,
  validateName,
  edExDiffInvalid,
  validateDiff,
  edExUnitsInvalid,
  validateUnits,
  edExPhotoUrlListInvalid,
  validatePhotoUrlList,
  edExVideoUrlInvalid,
  validateVideoUrl,
} = useEditingExercise()

const {
  searchSportsItemsSelect,
  searchTagsSelect,
  filteredExercisesList,
  difficultyOptions,
  sportsItemsOptions,
  tagsOptions,
  sportsItemsSelectSuggestions,
  tagsSelectSuggestions,
  filtersObj,
} = useFilterExercisesList()

const unitsOptions: ExerciseUnit[] = ['кг', 'мин', 'повт']

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

const dialogHeader = computed<string>(() => {
  if (exercisesStore.list.find((exercise) => exercise.id === editingExercise.value.id)) {
    return 'Редактирование упражнения'
  }
  return 'Создание упражнения'
})
</script>

<template>
  <header class="header flex flex-col justify-around lg:flex-row lg:items-center">
    <div>
      <p class="text-center">Фильтры</p>
      <ul class="filters flex flex-col lg:flex-row">
        <li>
          <FloatLabel variant="in" class="mb-2">
            <InputText id="filterName" v-model="filtersObj.name" />
            <label for="filterName">Название</label>
          </FloatLabel>
        </li>
        <li>
          <FloatLabel variant="in" class="mb-2">
            <InputText id="filterName" v-model="filtersObj.description" />
            <label for="filterName">Описание</label>
          </FloatLabel>
        </li>
        <li>
          <p>Сложность</p>
          <SelectButton v-model="filtersObj.difficulty" :options="difficultyOptions"></SelectButton>
        </li>
        <li>
          <FloatLabel variant="in" class="mb-2">
            <AutoComplete
              v-model="filtersObj.sportsItems"
              multiple
              :suggestions="sportsItemsSelectSuggestions"
              @complete="searchSportsItemsSelect"
              id="filterSportsItems"
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
            ></AutoComplete>
            <label for="filterTags">Теги</label>
          </FloatLabel>
        </li>
      </ul>
    </div>

    <Button @click="createExercise" class=""><i class="pi pi-plus"></i></Button>
  </header>
  <div class="exercises-list-container flex flex-wrap justify-evenly">
    <ConfirmDialog></ConfirmDialog>
    <Dialog v-model:visible="editExerciseDialogVisible" modal :header="dialogHeader">
      <div class="flex flex-col">
        <FloatLabel variant="in" class="mb-2">
          <InputText
            id="edExName"
            v-model="editingExercise.name"
            :invalid="edExNameInvalid"
            @input="() => (edExNameInvalid = validateName())"
          />
          <label for="edExName">Название</label>
        </FloatLabel>
        <span class="mb-1">Сложность</span>
        <SelectButton
          v-model="editingExercise.difficulty"
          :options="difficultyOptions"
          class="mb-2"
          :invalid="edExDiffInvalid"
          @change="() => (edExDiffInvalid = validateDiff())"
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
        />
        <MultiSelect
          v-model="editingExercise.tags"
          :options="tagsOptions"
          option-label="name"
          option-value="name"
          filter
          placeholder="Теги"
        />
        <SelectButton
          v-model="editingExercise.units"
          :options="unitsOptions"
          class="mb-2"
          :invalid="edExUnitsInvalid"
          multiple
          @change="() => (edExUnitsInvalid = validateUnits())"
        />
        <InputText
          v-for="(input, index) in editingExercise.photoUrlList"
          :key="index"
          v-model="editingExercise.photoUrlList[index]"
          type="text"
          placeholder="Ссылка на фото"
          :invalid="edExPhotoUrlListInvalid[index]"
          @input="async () => (edExPhotoUrlListInvalid = await validatePhotoUrlList())"
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
          v-model="editingExercise.video!.url"
          type="text"
          placeholder="Ссылка на видео"
          :invalid="edExVideoUrlInvalid"
          @input="async () => (edExVideoUrlInvalid = await validateVideoUrl())"
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
