<script setup lang="ts">
import { useUserStore } from '@/stores/userStore'
import { ref } from 'vue'

const userStore = useUserStore()
const showDialog = ref(false)
const age = ref<number | null>(userStore.user.age)
const height = ref<number | null>(userStore.user.height)
const weight = ref<number | null>(userStore.user.weight)

if (userStore.isNewUser) {
  showDialog.value = true
}

const saveUserData = () => {
  if (age.value === null || height.value === null || weight.value === null) return
  userStore.updateUser({ age: age.value, height: height.value, weight: weight.value })
  showDialog.value = false
  userStore.toggleIsNewUser()
}

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
  <div v-if="userStore.isNewUser">
    <Dialog v-model:visible="showDialog" header="User Information" :modal="true">
      <template #default>
        <div>
          <label for="height">Возраст (лет):</label>
          <InputNumber v-model="age" id="age" type="number" :invalid="age === null" />
          <label for="height">Рост (см):</label>
          <InputNumber v-model="height" id="height" type="number" :invalid="height === null" />
          <label for="weight">Вес (кг):</label>
          <InputNumber v-model="weight" id="weight" type="number" :invalid="weight === null" />
        </div>
      </template>
      <template #footer>
        <Button @click="saveUserData">Сохранить</Button>
      </template>
    </Dialog>
  </div>
  <div v-else>
    <p>Возраст: {{ userStore.user.age }} лет</p>
    <p>Рост: {{ userStore.user.height }} см</p>
    <p>Вес: {{ userStore.user.weight }} кг</p>
    <p>Уровень: {{ userStore.user.level }}</p>
    <p>XP: {{ userStore.user.xp }}</p>
    <p>Очки: {{ userStore.user.points }}</p>
    <p>Доступные предметы кастомизации: {{ userStore.user.customizationItems }}</p>
    <p>Ачивки: {{ userStore.user.achievements }}</p>
    <p>Персонаж:</p>
    <div class="w-fit bg-gray-300 p-4">
      <img
        v-if="userStore.user.character.hat"
        :src="hatImage || ''"
        alt="Шапка"
        class="w-[200px]"
      />
      <img :src="bodyImage || ''" alt="Тело" class="w-[200px]" />
      <img
        v-if="userStore.user.character.jacket"
        :src="jacketImage || ''"
        alt="Жилет"
        class="w-[200px]"
      />
      <img
        v-if="userStore.user.character.pants"
        :src="pantsImage || ''"
        alt="Штаны"
        class="w-[200px]"
      />
      <img
        v-if="userStore.user.character.boots"
        :src="bootsImage || ''"
        alt="Ботинки"
        class="w-[200px]"
      />
    </div>
  </div>
</template>

<style scoped></style>
