<script setup lang="ts">
import { useExercisesStore } from '@/stores/exercisesStore'
import type {
  Exercise,
  FilledExercisesWorkout,
  FilledExerciseWithGoal,
  WorkoutExerciseGoal,
} from '@/types'
import type { AutoCompleteCompleteEvent } from 'primevue'
import { ref } from 'vue'
import EditWorkoutAddedExercise from './EditWorkoutAddedExercise.vue'
import { isNameValid } from '@/utils/validation'
import { useExercisesListSuggestions } from '@/composables/exercises-list/suggestions'

defineProps<{
  dialogHeader: string
  saveEditingWorkout: () => void
  validateAndRunWorkout: (workout: FilledExercisesWorkout) => void
  newWorkout: boolean
}>()

const editWorkoutDialogVisible = defineModel<boolean>('editWorkoutDialogVisible')
const editingWorkout = defineModel<FilledExercisesWorkout>('editingWorkout')
const nameInvalid = defineModel<boolean>('nameInvalid')

const exercisesStore = useExercisesStore()

const exerciseSearch = ref<Exercise | null>(null)
const searchExercisesList = ref<Exercise[]>([])

function searchByName(event: AutoCompleteCompleteEvent) {
  searchExercisesList.value = exercisesStore.list.filter((exercise) =>
    exercise.name.toLowerCase().includes(event.query.toLowerCase()),
  )
}

function addExerciseToList(exercise: Exercise) {
  const newGoal: WorkoutExerciseGoal = {}
  if (exercise.unitsList.includes('время')) {
    newGoal.time = { minutes: 0, seconds: 0 }
  }
  if (exercise.unitsList.includes('подходы')) {
    newGoal.sets = 0
  }
  if (exercise.unitsList.includes('повторения')) {
    newGoal.repetitions = 0
  }
  if (exercise.unitsList.includes('вес')) {
    newGoal.weightKg = 0
  }
  editingWorkout.value!.exercises.push({
    ...exercise,
    goal: newGoal,
  } as FilledExerciseWithGoal)
}

function addNamedExerciseToList() {
  addExerciseToList(exerciseSearch.value!)
  exerciseSearch.value = null
}

function removeAddedExercise(index: number) {
  editingWorkout.value!.exercises.splice(index, 1)
}

const { showTagsSuggestions, tagsSuggestions } = useExercisesListSuggestions('filter')

const selectedTag = ref<string | null>(null)

function suggestExercises() {
  const exercisesWithTag = exercisesStore.list.filter((exercise) =>
    exercise.tags.includes(selectedTag.value!),
  )

  const copy = [...exercisesWithTag]
  const count = Math.floor(Math.random() * copy.length) + 1

  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * copy.length)
    addExerciseToList(copy[randomIndex])
    copy.splice(randomIndex, 1)
  }

  selectedTag.value = null
}
</script>

<template>
  <Dialog
    v-model:visible="editWorkoutDialogVisible"
    modal
    :header="dialogHeader"
    class="!w-[90vw] !max-w-[800px] sm:!w-[80vw] xl:!w-[60vw]"
  >
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
      <FloatLabel variant="in" v-if="editingWorkout?.exercises.length === 0">
        <AutoComplete
          v-model="selectedTag"
          :suggestions="tagsSuggestions"
          @complete="showTagsSuggestions"
          @option-select="suggestExercises"
          input-class="w-full"
          id="exercisesTagsSearch"
          class="w-full"
        />
        <label for="exercisesTagsSearch">Подобрать упражнения по части тела (тегу)</label>
      </FloatLabel>
      <FloatLabel variant="in">
        <AutoComplete
          v-model="exerciseSearch"
          :suggestions="searchExercisesList"
          option-label="name"
          @complete="searchByName"
          @option-select="addNamedExerciseToList"
          input-class="w-full"
          id="exerciseSearch"
          class="w-full"
        />
        <label for="exerciseSearch">Поиск упражнения по названию</label>
      </FloatLabel>
      <ScrollPanel class="!h-[300px] w-full rounded border border-gray-500">
        <EditWorkoutAddedExercise
          v-for="(exercise, index) in editingWorkout?.exercises"
          :key="exercise.id"
          :index="index"
          :editing-workout="editingWorkout!"
          v-model:exercise="editingWorkout!.exercises[index]"
          @remove-added-exercise="() => removeAddedExercise(index)"
        />
      </ScrollPanel>

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
        <Button
          v-if="newWorkout"
          @click="() => validateAndRunWorkout(editingWorkout!)"
          aria-label="Run workout"
          >Запустить</Button
        >
      </div>
    </div>
  </Dialog>
</template>

<style scoped></style>
