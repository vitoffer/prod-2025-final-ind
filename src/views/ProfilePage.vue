<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { ref } from 'vue'

const userStore = useUserStore()
const hatImage = ref<string | null>(null)
const bodyImage = ref<string | null>(null)
const jacketImage = ref<string | null>(null)
const pantsImage = ref<string | null>(null)
const bootsImage = ref<string | null>(null)

loadImages()

async function loadImages() {
  if (userStore.user.character.hat) {
    hatImage.value = new URL(
      `../assets/character/hat/${userStore.user.character.hat}.svg`,
      import.meta.url,
    ).href
  }
  bodyImage.value = new URL(
    `../assets/character/body/${userStore.user.character.body}.svg`,
    import.meta.url,
  ).href
  if (userStore.user.character.jacket) {
    hatImage.value = new URL(
      `../assets/character/jacket/${userStore.user.character.jacket}.svg`,
      import.meta.url,
    ).href
  }
  if (userStore.user.character.pants) {
    hatImage.value = new URL(
      `../assets/character/pants/${userStore.user.character.pants}.svg`,
      import.meta.url,
    ).href
  }
  if (userStore.user.character.boots) {
    hatImage.value = new URL(
      `../assets/character/boots/${userStore.user.character.boots}.svg`,
      import.meta.url,
    ).href
  }
}
</script>

<template>
  <div>
    <p>Рост: {{ userStore.user.height }} см</p>
    <p>Вес: {{ userStore.user.weight }} кг</p>
    <p>Уровень: {{ userStore.user.level }}</p>
    <p>XP: {{ userStore.user.xp }}</p>
    <p>Очки: {{ userStore.user.points }}</p>
    <p>Доступные предметы кастомизации: {{ userStore.user.customizationItems }}</p>
    <p>Ачивки: {{ userStore.user.achievements }}</p>
    <div class="w-fit bg-gray-300 p-4">
      <img v-if="userStore.user.character.hat" :src="hatImage || ''" alt="Шапка" />
      <img :src="bodyImage || ''" alt="Тело" class="w-[200px]" />
      <img v-if="userStore.user.character.jacket" :src="jacketImage || ''" alt="Жилет" />
      <img v-if="userStore.user.character.pants" :src="pantsImage || ''" alt="Штаны" />
      <img v-if="userStore.user.character.boots" :src="bootsImage || ''" alt="Ботинки" />
    </div>
  </div>
</template>

<style scoped></style>
