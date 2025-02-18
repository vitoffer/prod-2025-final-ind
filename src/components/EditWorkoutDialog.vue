<script setup lang="ts">
import { useExercisesStore } from '@/stores/exercisesStore'
import type { Exercise, ExerciseWithGoal, Workout, WorkoutExerciseGoal } from '@/types'
import type { AutoCompleteCompleteEvent } from 'primevue'
import { ref } from 'vue'
import EditWorkoutAddedExercise from './EditWorkoutAddedExercise.vue'

defineProps<{
  dialogHeader: string
  validateName: (workout: Workout) => boolean
  saveEditingWorkout: () => void
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
  if (exerciseSearch.value!.units.includes('мин')) {
    newGoal.time = 0
  }
  if (exerciseSearch.value!.units.includes('повт')) {
    newGoal.repetitions = 0
  }
  if (exerciseSearch.value!.units.includes('кг')) {
    newGoal.weight = 0
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
    <FloatLabel>
      <InputText
        v-model="editingWorkout!.name"
        :invalid="nameInvalid"
        @input="() => (nameInvalid = validateName(editingWorkout!))"
        id="edWoName"
        class="w-[500px]"
      />
      <label for="edWoName">Название</label>
    </FloatLabel>
    <VirtualScroller
      :items="[...editingWorkout!.exercises]"
      :itemSize="50"
      class="rounded border border-gray-200"
      style="width: 500px; height: 200px"
    >
      <template v-slot:item="{ options }">
        <EditWorkoutAddedExercise
          :options="options"
          v-model:exercise="editingWorkout!.exercises[options.index]"
          @remove-added-exercise="() => removeAddedExercise(options.index)"
        />
      </template>
    </VirtualScroller>
    <AutoComplete
      v-model="exerciseSearch"
      :suggestions="searchExercisesList"
      option-label="name"
      @complete="search"
      @option-select="addExerciseToList"
      placeholder="Поиск упражнения по названию"
      class="w-[500px]"
      input-class="w-full"
    />
    <div class="flex w-full justify-evenly">
      <Button @click="editWorkoutDialogVisible = false" severity="danger">Отменить</Button>
      <Button @click="saveEditingWorkout" severity="success">Сохранить</Button>
    </div>
  </Dialog>
</template>

<style scoped></style>
