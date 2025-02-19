<script setup lang="ts">
import type { ExerciseWithGoal } from '@/types'
import type { VirtualScrollerItemOptions } from 'primevue'
import GoalInput from './GoalInput.vue'

defineProps<{ options: VirtualScrollerItemOptions }>()

defineEmits<{ (e: 'removeAddedExercise'): void }>()

const exercise = defineModel<ExerciseWithGoal>('exercise')
</script>

<template>
  <div
    :class="['flex items-center justify-between p-2', { 'bg-[var(--p-surface-700)]': options.odd }]"
    style="height: 50px"
  >
    <p>
      {{ exercise!.name }}
    </p>
    <p class="mr-3 ml-auto">
      <!-- <template v-if="exercise!.unitsList.includes('подходы')"
        ><GoalInput v-model="exercise!.goal.sets" type="sets" /> подходов</template
      >
      <template v-if="exercise!.unitsList.includes('повторения')"
        >по
        <GoalInput v-model="exercise!.goal.repetitions" type="repetitions" /> повторений</template
      >
      <template v-if="exercise!.unitsList.includes('вес')"
        >по <GoalInput v-model="exercise!.goal.weightKg" type="weightKg" /> кг</template
      >
      <template v-if="exercise!.unitsList.includes('время')"
        >по <GoalInput v-model="exercise!.goal.time" type="time" /> мин</template
      > -->
    </p>
    <Button severity="danger" @click="$emit('removeAddedExercise')">
      <i class="pi pi-times-circle" />
    </Button>
  </div>
</template>

<style scoped></style>
