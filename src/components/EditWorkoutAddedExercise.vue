<script setup lang="ts">
import type { ExerciseWithGoal, ExerciseWithGoalValidation, GoalTime, Workout } from '@/types'
import { getInvalidExercisesList } from '@/utils/validation'
import { computed, ref } from 'vue'

const props = defineProps<{ index: number; editingWorkout: Workout }>()

defineEmits<{ (e: 'removeAddedExercise'): void }>()

const exercise = defineModel<ExerciseWithGoal>('exercise')
const exercisesListInvalid = defineModel<ExerciseWithGoalValidation[]>('exercisesListInvalid')

const timeInput = ref('00:00')

if (exercise.value?.goal.time) {
  timeInput.value = stringifyTime(exercise.value!.goal.time!)
}

function stringifyTime(timeObject: GoalTime) {
  const minutes = String(timeObject.minutes || 0).padStart(2, '0')
  const seconds = String(timeObject.seconds || 0).padStart(2, '0')
  return `${minutes}:${seconds}`
}

function parseTime(input: string) {
  if (input.length === 0) return { minutes: 0, seconds: 0 }
  const [minutes, seconds] = input.split(':').map(Number)
  return { minutes, seconds }
}

function updateExerciseTime() {
  const time = parseTime(timeInput.value)
  exercise.value!.goal.time = time

  exercisesListInvalid.value = getInvalidExercisesList(props.editingWorkout)
}

const setsOptions = [...Array(4).keys()].map((value) => value + 2)

const exerciseSetsInvalid = computed(() => {
  console.log(exercisesListInvalid)
  return exercisesListInvalid.value![props.index].sets
})
</script>

<template>
  <div class="flex flex-col border-b-gray-500 p-2 not-last:border-b">
    <div class="mb-1 flex w-full items-center justify-between">
      <p>
        {{ exercise!.name }}
      </p>
      <p class="mr-3"></p>
      <Button severity="danger" @click="$emit('removeAddedExercise')" class="!p-2">
        <i class="pi pi-times-circle" />
      </Button>
    </div>
    <div>
      <span v-show="exercise!.unitsList.includes('подходы')">
        <Select
          v-model="exercise!.goal.sets"
          size="small"
          :options="setsOptions"
          label-class="!p-0"
          class="!border-none !p-1 not-last:mb-1"
          :invalid="exerciseSetsInvalid"
          @change="() => (exercisesListInvalid = getInvalidExercisesList(editingWorkout))"
        >
          <template #value="slotProps">
            <div class="p-1 leading-normal">
              {{ slotProps.value }}
            </div>
          </template>
        </Select>
      </span>
      <template v-if="exercise!.unitsList.includes('подходы')"> подходов</template>
      <template v-if="exercise!.unitsList.includes('повторения')">
        по
        <InputNumber
          v-model="exercise!.goal.repetitions"
          size="small"
          :min="1"
          :max="999"
          input-class="goal-number-input repetitions"
          class="not-last:mb-1"
          :invalid="exercisesListInvalid![index].repetitions"
          @input="() => (exercisesListInvalid = getInvalidExercisesList(editingWorkout))"
        />
        повторений</template
      >
      <template v-if="exercise!.unitsList.includes('вес')">
        по
        <InputNumber
          v-model="exercise!.goal.weightKg"
          size="small"
          :min="0.1"
          :max="999"
          input-class="goal-number-input weight"
          class="not-last:mb-1"
          :invalid="exercisesListInvalid![index].weightKg"
          @input="() => (exercisesListInvalid = getInvalidExercisesList(editingWorkout))"
        />
        кг</template
      >
      <template v-if="exercise!.unitsList.includes('время')">
        по
        <InputMask
          mask="99:99"
          placeholder="мин:сек"
          v-model="timeInput"
          @value-change="updateExerciseTime"
          slotChar="00:00"
          size="small"
          class="goal-number-input time not-last:mb-1"
          :invalid="exercisesListInvalid![index].time"
        />
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
:deep(.p-datepicker-hour-picker) {
  display: none;

  + [data-pc-section='separatorcontainer'] {
    display: none;
  }
}

:deep(.p-select-dropdown) {
  width: fit-content;
  padding-inline: 4px;
}

:deep(.goal-number-input) {
  box-sizing: content-box;
  text-align: center;
  padding: 8px 4px;
  border: none;

  &.repetitions {
    width: 4ch;
  }

  &.weight {
    width: 4ch;
  }

  &.time {
    width: 7ch;
  }
}
</style>
