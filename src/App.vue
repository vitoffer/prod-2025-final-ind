<script setup lang="ts"></script>

<template>
  <nav>
    <ul class="flex justify-center gap-4">
      <li>
        <Button severity="info">
          <RouterLink :to="{ name: 'ExercisesListPage' }">Список упражнений</RouterLink>
        </Button>
      </li>
      <li>
        <Button severity="info">
          <RouterLink :to="{ name: 'WorkoutsListPage' }">Список тренировок</RouterLink>
        </Button>
      </li>
      <li>
        <Button severity="info">
          <RouterLink :to="{ name: 'ProfilePage' }">Профиль</RouterLink>
        </Button>
      </li>
    </ul>
  </nav>
  <RouterView></RouterView>
</template>

<style scoped></style>
