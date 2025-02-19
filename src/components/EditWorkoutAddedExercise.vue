<script setup lang="ts">
import type { ExerciseWithGoal } from '@/types'
import type { VirtualScrollerItemOptions } from 'primevue'
import { ref } from 'vue'

defineProps<{ options: VirtualScrollerItemOptions }>()

defineEmits<{ (e: 'removeAddedExercise'): void }>()

const exercise = defineModel<ExerciseWithGoal>('exercise')
const time = ref('00:00')

const setsOptions = [...Array(4).keys()].map((value) => value + 2)
</script>

<template>
  <div class="flex flex-col border-b-gray-500 p-2 not-last:border-b">
    <div class="flex w-full items-center justify-between">
      <p>
        {{ exercise!.name }}
      </p>
      <p class="mr-3"></p>
      <Button severity="danger" @click="$emit('removeAddedExercise')" class="!p-2">
        <i class="pi pi-times-circle" />
      </Button>
    </div>
    <div>
      <template v-if="exercise!.unitsList.includes('подходы')">
        <Select
          v-model="exercise!.goal.sets"
          size="small"
          :options="setsOptions"
          label-class="!p-0"
          class="!border-none !pr-1 !pl-1"
          :invalid="!exercise!.goal.sets"
        >
          <template #value="slotProps">
            <div class="p-1">
              {{ slotProps.value }}
            </div>
          </template>
        </Select>
        подходов</template
      >
      <template v-if="exercise!.unitsList.includes('повторения')">
        по
        <InputNumber
          v-model="exercise!.goal.repetitions"
          size="small"
          :min="1"
          :max="999"
          input-class="goal-number-input repetitions"
          :invalid="!exercise!.goal.repetitions"
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
          :invalid="!exercise!.goal.weightKg"
        />
        кг</template
      >
      <template v-if="exercise!.unitsList.includes('время')">
        по
        <InputMask
          mask="99:99"
          placeholder="мин:сек"
          v-model="time"
          slotChar="00:00"
          size="small"
          class="goal-number-input time"
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
  padding-inline: 8px;
  padding-inline: 4px;
}

:deep(.goal-number-input) {
  box-sizing: content-box;
  text-align: center;
  line-height: 1em;
  padding: 4px;
  margin-block: 2px;

  &.repetitions {
    width: 3ch;
  }

  &.weight {
    width: 4ch;
  }

  &.time {
    width: 7ch;
  }
}
</style>
