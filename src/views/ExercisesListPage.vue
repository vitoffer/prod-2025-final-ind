<script setup lang="ts">
import { useExercisesStore } from '@/stores/exercisesStore'

const exercisesStore = useExercisesStore()
</script>

<template>
  <div class="exercises-list-container flex justify-evenly">
    <ExerciseCard v-for="exercise in exercisesStore.list" :key="exercise.id" :exercise="exercise" />
  </div>
</template>

<style scoped lang="scss"></style>
