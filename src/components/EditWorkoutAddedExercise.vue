<script setup lang="ts">
import type {
  ExerciseUnit,
  ExerciseWithGoalValidation,
  FilledExerciseWithGoal,
  Workout,
} from '@/types'
import { formattedReps, formattedSets, parseTime, stringifyTime } from '@/utils/formatters'
import { getInvalidExercisesList } from '@/utils/validation'
import { ref } from 'vue'

const props = defineProps<{ index: number; editingWorkout: Workout }>()

defineEmits<{ (e: 'removeAddedExercise'): void }>()

const exercise = defineModel<FilledExerciseWithGoal>('exercise')
const exercisesListInvalid = defineModel<ExerciseWithGoalValidation[]>('exercisesListInvalid')

const timeInput = ref('00:00')

if (exercise.value?.goal.time) {
  timeInput.value = stringifyTime(exercise.value!.goal.time!)
}

const setsOptions = [...Array(4).keys()].map((value) => value + 3)

const timeInvalid = ref<boolean>(false)

function handleRepetitionsInput() {
  if (!exercise.value?.goal.repetitions) {
    exercise.value!.goal.repetitions = 1
  }
}

function handleWeightKgInput() {
  if (!exercise.value?.goal.weightKg) {
    exercise.value!.goal.weightKg = 0.1
  }
}

function handleTimeInput() {
  if (!exercise.value?.goal.time) {
    exercise.value!.goal.time = { minutes: 0, seconds: 0 }
    return
  }

  const time = parseTime(timeInput.value)
  exercise.value!.goal.time = time

  exercisesListInvalid.value = getInvalidExercisesList(props.editingWorkout)

  if (time.seconds > 59) {
    timeInvalid.value = true
  } else {
    timeInvalid.value = false
  }
}
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
      <span v-if="exercise!.unitsList.includes('подходы')">
        <Select
          v-model="exercise!.goal.sets"
          size="small"
          :options="setsOptions"
          label-class="!p-0"
          class="!border-none !p-1 not-last:mb-1"
        >
          <template #value="slotProps">
            <div class="p-1 leading-normal">
              {{ slotProps.value }}
            </div>
          </template>
        </Select>
        {{ formattedSets(exercise!.goal.sets) }}
      </span>
      <template v-if="exercise!.unitsList.includes('повторения')">
        {{ exercise!.unitsList.includes('подходы') ? ' по ' : '' }}
        <InputNumber
          v-model="exercise!.goal.repetitions"
          size="small"
          :min="1"
          :max="999"
          input-class="goal-number-input repetitions"
          class="not-last:mb-1"
          @input="handleRepetitionsInput"
        />
        {{ formattedReps(exercise!.goal.repetitions) }}</template
      >
      <template v-if="exercise!.unitsList.includes('вес')">
        {{
          ['повторения', 'подходы'].some((unit) =>
            exercise!.unitsList.includes(unit as ExerciseUnit),
          )
            ? ' по '
            : ''
        }}
        <InputNumber
          v-model="exercise!.goal.weightKg"
          size="small"
          :min="0.1"
          :max="999"
          :max-fraction-digits="2"
          input-class="goal-number-input weight"
          class="not-last:mb-1"
          @input="handleWeightKgInput"
        />
        кг</template
      >
      <template v-if="exercise!.unitsList.includes('время')">
        {{
          ['повторения', 'подходы', 'вес'].some((unit) =>
            exercise!.unitsList.includes(unit as ExerciseUnit),
          )
            ? ' по '
            : ''
        }}
        <InputMask
          mask="99:99"
          placeholder="мин:сек"
          v-model="timeInput"
          @value-change="handleTimeInput"
          slotChar="00:00"
          :invalid="timeInvalid"
          size="small"
          class="goal-number-input time not-last:mb-1"
        />
        (мин:сек)
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
