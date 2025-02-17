<script setup lang="ts">
import type { Workout } from '@/types'
import type { AutoCompleteCompleteEvent } from 'primevue'
import { ref } from 'vue'

defineProps<{
  dialogHeader: string
  validateName: (workout: Workout) => boolean
  saveEditingWorkout: () => void
}>()

const editWorkoutDialogVisible = defineModel<boolean>('editWorkoutDialogVisible')
const editingWorkout = defineModel<Workout>('editingWorkout')
const nameInvalid = defineModel<boolean>('nameInvalid')

const addedExercisesList = ref<string[]>([
  '1',
  '2',
  '2',
  '2',
  '2',
  '2',
  '2',
  '2',
  '2',
  '2',
  '2',
  '2',
  '2',
  '2',
])

const exerciseSearch = ref<string>('')
const searchExercisesList = ref<string[]>([])

const search = (event: AutoCompleteCompleteEvent) => {
  searchExercisesList.value = [...Array(10).keys()].map((item) => event.query + '-' + item)
}
</script>

<template>
  <Dialog v-model:visible="editWorkoutDialogVisible" modal :header="dialogHeader">
    <FloatLabel>
      <InputText
        v-model="editingWorkout!.name"
        :invalid="nameInvalid"
        @input="() => (nameInvalid = validateName(editingWorkout!))"
        id="edWoName"
      />
      <label for="edWoName">Название</label>
    </FloatLabel>
    <VirtualScroller
      :items="addedExercisesList"
      :itemSize="50"
      class="border-surface-200 dark:border-surface-700 rounded border"
      style="width: 200px; height: 200px"
    >
      <template v-slot:item="{ item, options }">
        <div
          :class="['flex items-center p-2', { 'bg-surface-100 dark:bg-surface-700': options.odd }]"
          style="height: 50px"
        >
          {{ item }}
        </div>
      </template>
    </VirtualScroller>
    <AutoComplete v-model="exerciseSearch" :suggestions="searchExercisesList" @complete="search" />
    <div class="flex w-full justify-evenly">
      <Button @click="editWorkoutDialogVisible = false" severity="danger">Отменить</Button>
      <Button @click="saveEditingWorkout" severity="success">Сохранить</Button>
    </div>
  </Dialog>
</template>

<style scoped></style>
