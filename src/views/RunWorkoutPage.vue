<script setup lang="ts">
import { useRunWorkoutStore } from '@/stores/runWorkoutStore'

const runWorkoutStore = useRunWorkoutStore()
</script>

<template>
  <pre>{{ JSON.stringify(runWorkoutStore.selectedRunWorkout, null, 2) }}</pre>
</template>

<style scoped></style>
