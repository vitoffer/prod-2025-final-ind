<script setup lang="ts">
import { useExercisesStore } from '@/stores/exercisesStore'
import type { Exercise, ExerciseWithGoal, Workout, WorkoutExerciseGoal } from '@/types'
import type { AutoCompleteCompleteEvent } from 'primevue'
import { ref } from 'vue'
import EditWorkoutAddedExercise from './EditWorkoutAddedExercise.vue'
import { isNameValid } from '@/utils/validation'

defineProps<{
  dialogHeader: string
  saveEditingWorkout: () => void
  runWorkout: () => void
  newWorkout: boolean
}>()

const editWorkoutDialogVisible = defineModel<boolean>('editWorkoutDialogVisible')
const editingWorkout = defineModel<Workout>('editingWorkout')
const nameInvalid = defineModel<boolean>('nameInvalid')

const exercisesStore = useExercisesStore()

const exerciseSearch = ref<Exercise | null>(null)
const searchExercisesList = ref<Exercise[]>([])

const search = (event: AutoCompleteCompleteEvent) => {
  searchExercisesList.value = exercisesStore.list.filter((exercise) =>
    exercise.name.toLowerCase().includes(event.query.toLowerCase()),
  )
}

const addExerciseToList = () => {
  const newGoal: WorkoutExerciseGoal = {}
  if (exerciseSearch.value!.unitsList.includes('время')) {
    newGoal.time = { hours: 0, minutes: 0, seconds: 0 }
  }
  if (exerciseSearch.value!.unitsList.includes('подходы')) {
    newGoal.sets = 0
  }
  if (exerciseSearch.value!.unitsList.includes('повторения')) {
    newGoal.repetitions = 0
  }
  if (exerciseSearch.value!.unitsList.includes('вес')) {
    newGoal.weightKg = 0
  }
  editingWorkout.value!.exercises.push({
    ...exerciseSearch.value,
    goal: newGoal,
  } as ExerciseWithGoal)
  exerciseSearch.value = null
}

const removeAddedExercise = (index: number) => {
  editingWorkout.value!.exercises.splice(index, 1)
}
</script>

<template>
  <Dialog v-model:visible="editWorkoutDialogVisible" modal :header="dialogHeader">
    <div class="flex flex-col gap-2">
      <FloatLabel variant="in">
        <InputText
          v-model="editingWorkout!.name"
          :invalid="nameInvalid"
          @input="() => (nameInvalid = !isNameValid(editingWorkout!))"
          id="edWoName"
          class="w-full"
        />
        <label for="edWoName">Название</label>
      </FloatLabel>
      <VirtualScroller
        :items="[...editingWorkout!.exercises]"
        :itemSize="50"
        class="h-[200px] w-full rounded border border-gray-500"
      >
        <template v-slot:item="{ options }">
          <EditWorkoutAddedExercise
            :options="options"
            v-model:exercise="editingWorkout!.exercises[options.index]"
            @remove-added-exercise="() => removeAddedExercise(options.index)"
          />
        </template>
      </VirtualScroller>
      <FloatLabel variant="in">
        <AutoComplete
          v-model="exerciseSearch"
          :suggestions="searchExercisesList"
          option-label="name"
          @complete="search"
          @option-select="addExerciseToList"
          input-class="w-full"
          id="exerciseSearch"
          class="w-full"
        />
        <label for="exerciseSearch">Поиск упражнения по названию</label>
      </FloatLabel>
      <div class="flex w-full justify-evenly">
        <Button
          @click="editWorkoutDialogVisible = false"
          severity="danger"
          aria-label="Cancel editing workout"
          >Отменить</Button
        >
        <Button @click="saveEditingWorkout" severity="success" aria-label="Save workout"
          >Сохранить</Button
        >
        <Button v-if="newWorkout" @click="() => runWorkout()" aria-label="Run workout"
          >Запустить</Button
        >
      </div>
    </div>
  </Dialog>
</template>

<style scoped></style>
