<script setup lang="ts"></script>

<template>
  <div class="relative flex flex-col">
    <nav
      class="sticky bottom-0 z-10 order-1 justify-self-end border-t border-t-gray-600 bg-[#121212] p-2 sm:static sm:border-none"
    >
      <ul class="flex justify-center gap-4">
        <li>
          <Button severity="info" class="!pt-1 !pb-1">
            <RouterLink :to="{ name: 'ExercisesListPage' }" class="">Упражнения</RouterLink>
          </Button>
        </li>
        <li>
          <Button severity="info" class="!pt-1 !pb-1">
            <RouterLink :to="{ name: 'WorkoutsListPage' }" class="">Тренировки</RouterLink>
          </Button>
        </li>
        <li>
          <Button severity="info" class="!pt-1 !pb-1">
            <RouterLink :to="{ name: 'ProfilePage' }" class="">Профиль</RouterLink>
          </Button>
        </li>
      </ul>
    </nav>
    <div class="sm:order-1">
      <RouterView></RouterView>
    </div>
  </div>
</template>

<style scoped></style>
