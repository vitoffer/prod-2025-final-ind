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
      <template v-if="exercise!.units.includes('мин')">
        <GoalInput v-model="exercise!.goal.time" />
        мин
      </template>
      <template v-else-if="exercise!.units.includes('повт') && exercise!.units.includes('кг')">
        <GoalInput v-model="exercise!.goal.repetitions" />
        повт, по
        <GoalInput v-model="exercise!.goal.weight" />
        кг
      </template>
      <template v-else-if="exercise!.units.includes('повт')">
        <GoalInput v-model="exercise!.goal.repetitions" />
        повт
      </template>
      <template v-else-if="exercise!.units.includes('кг')">
        <GoalInput v-model="exercise!.goal.weight" />
        кг
      </template>
    </p>
    <Button severity="danger" @click="$emit('removeAddedExercise')">
      <i class="pi pi-times-circle" />
    </Button>
  </div>
</template>

<style scoped></style>
