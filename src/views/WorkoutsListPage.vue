<script setup lang="ts">
import { useWorkoutsStore } from '@/stores/workoutsStore'

const workoutsList = useWorkoutsStore()
</script>

<template>
  <div v-for="workout in workoutsList.list" :key="workout.id">
    {{ workout.name }}
  </div>
</template>

<style scoped></style>
