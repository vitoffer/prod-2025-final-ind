<script setup lang="ts">
import { useRunWorkoutStore } from '@/stores/runWorkoutStore'
import { useWorkoutsStore } from '@/stores/workoutsStore'
import type { Workout } from '@/types'
import { useRouter } from 'vue-router'

const workoutsStore = useWorkoutsStore()
const runWorkoutStore = useRunWorkoutStore()
const router = useRouter()

function runWorkout(workout: Workout) {
  runWorkoutStore.changeRunWorkout(workout)
  router.push({ name: 'RunWorkoutPage' })
}
</script>

<template>
  <ul class="workouts-list mt-6 mr-auto ml-auto flex w-fit flex-col gap-4">
    <li v-for="workout in workoutsStore.list" :key="workout.id">
      {{ workout.name }}
      <Button @click="() => runWorkout(workout)"><i class="pi pi-play"></i></Button>
    </li>
  </ul>
</template>

<style scoped></style>
