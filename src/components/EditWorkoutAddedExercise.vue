<script setup lang="ts">
import type { ExerciseWithGoal } from '@/types'
import type { VirtualScrollerItemOptions } from 'primevue'
import { computed } from 'vue'

const props = defineProps<{ exercise: ExerciseWithGoal; options: VirtualScrollerItemOptions }>()

const formattedGoal = computed<string>(() => {
  if (props.exercise.units.includes('мин')) {
    return `${props.exercise.goal.time} мин`
  }
  if (props.exercise.units.includes('повт') && props.exercise.units.includes('кг')) {
    return `${props.exercise.goal.repetitions} повторений, ${props.exercise.goal.weight} кг`
  }
  if (props.exercise.units.includes('повт')) {
    return `${props.exercise.goal.repetitions} повторений`
  }
  if (props.exercise.units.includes('кг')) {
    return `1 повт, ${props.exercise.goal.weight} кг`
  }
  return ''
})
</script>

<template>
  <div
    :class="['flex items-center justify-between p-2', { 'bg-[var(--p-surface-700)]': options.odd }]"
    style="height: 50px"
  >
    <p>
      {{ exercise.name }}
    </p>
    <p>
      {{ formattedGoal }}
    </p>
    <Button severity="danger" @click="$emit('removeAddedExercise', exercise.id)"
      ><i class="pi pi-times-circle"></i
    ></Button>
  </div>
</template>

<style scoped></style>
