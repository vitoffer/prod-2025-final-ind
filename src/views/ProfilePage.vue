<script setup lang="ts">
import { useUserStore } from '@/stores/userStore'
import { computed, ref } from 'vue'

const userStore = useUserStore()
const showDialog = ref(false)
const age = ref<number | null>(userStore.user.age)
const height = ref<number | null>(userStore.user.heightCm)
const weight = ref<number | null>(userStore.user.weightKg)

if (userStore.isNewUser) {
  showDialog.value = true
}

const hatImage = ref<string | null>(null)
const bodyImage = ref<string | null>(null)
const necklaceImage = ref<string | null>(null)
const braceletImage = ref<string | null>(null)
const pantsImage = ref<string | null>(null)
const bootsImage = ref<string | null>(null)

loadImages()

function getImageUrl(group: string, type: string, title: string): string {
  return `/${group}/${type}/${title}.svg`
}

function loadImages() {
  if (userStore.user.character.hat) {
    hatImage.value = getImageUrl('accessories', 'hat', userStore.user.character.hat)
  }
  bodyImage.value = getImageUrl('character', 'body', userStore.user.character.body)
  if (userStore.user.character.necklace) {
    necklaceImage.value = getImageUrl('accessories', 'necklace', userStore.user.character.necklace)
  }
  if (userStore.user.character.bracelet) {
    braceletImage.value = getImageUrl('accessories', 'bracelet', userStore.user.character.bracelet)
  }
  if (userStore.user.character.pants) {
    pantsImage.value = getImageUrl('accessories', 'pants', userStore.user.character.pants)
  }
  if (userStore.user.character.boots) {
    bootsImage.value = getImageUrl('accessories', 'boots', userStore.user.character.boots)
  }
}

const ageInvalid = computed<boolean>(() => {
  return age.value === null || age.value < 1 || age.value > 100
})

const heightInvalid = computed<boolean>(() => {
  return height.value === null || height.value < 50 || height.value > 250
})

const weightInvalid = computed<boolean>(() => {
  return weight.value === null || weight.value < 30 || weight.value > 250
})

function saveUserData() {
  if (ageInvalid.value || heightInvalid.value || weightInvalid.value) return

  userStore.updateUser({ age: age.value!, heightCm: height.value!, weightKg: weight.value! })

  if (userStore.isNewUser) {
    userStore.toggleIsNewUser()
  }

  showDialog.value = false
}
</script>

<template>
  <Dialog v-model:visible="showDialog" header="User Information" :modal="true">
    <template #default>
      <div>
        <label for="height">Возраст (лет):</label>
        <InputNumber v-model="age" id="age" type="number" :invalid="ageInvalid" />
        <label for="height">Рост (см):</label>
        <InputNumber v-model="height" id="height" type="number" :invalid="heightInvalid" />
        <label for="weight">Вес (кг):</label>
        <InputNumber v-model="weight" id="weight" type="number" :invalid="weightInvalid" />
      </div>
    </template>
    <template #footer>
      <Button @click="saveUserData" aria-label="Save user info">Сохранить</Button>
    </template>
  </Dialog>
  <div v-if="userStore.isNewUser"></div>
  <div v-else class="mt-4 mr-auto ml-auto w-fit text-lg font-semibold">
    <div class="flex justify-between">
      <p>Возраст: {{ userStore.user.age }} лет;</p>
      <p>Рост: {{ userStore.user.heightCm }} см;</p>
      <p>Вес: {{ userStore.user.weightKg }} кг;</p>
    </div>
    <Button
      @click="
        () => {
          showDialog = true
        }
      "
      class="mx-auto my-2 !block"
      >Изменить данные</Button
    >

    <div class="flex justify-between">
      <p>Уровень: {{ userStore.user.level }};</p>
      <p>XP: {{ userStore.user.xp }};</p>
      <p>Очки: {{ userStore.user.points }};</p>
    </div>
    <p>Доступные предметы кастомизации: {{ userStore.user.customizationItems }}</p>
    <RouterLink :to="{ name: 'ShopPage' }" class="p-button mx-auto my-2 !block w-fit"
      >В магазин</RouterLink
    >
    <p>Ачивки: {{ userStore.user.achievements }}</p>
    <p class="mt-4 mb-2 text-center">Ваш персонаж:</p>
    <div class="relative mr-auto ml-auto w-fit rounded-3xl bg-neutral-300 px-16 py-4">
      <img
        v-if="userStore.user.character.hat"
        :src="hatImage || ''"
        alt="Шапка"
        class="absolute top-[16px] left-[50%] -translate-x-[50%]"
      />
      <img :src="bodyImage || ''" alt="Тело" class="mt-4" />
      <img
        v-if="userStore.user.character.necklace"
        :src="necklaceImage || ''"
        alt="Цепочка"
        class="absolute top-[108px] left-[50%] -translate-x-[50%]"
      />
      <img
        v-if="userStore.user.character.bracelet"
        :src="braceletImage || ''"
        alt="Браслет"
        class="absolute top-[186px] left-[78px] -translate-x-[50%]"
      />
      <img
        v-if="userStore.user.character.pants"
        :src="pantsImage || ''"
        alt="Штаны"
        class="absolute top-[208px] left-[50%] -translate-x-[50%]"
      />
      <img
        v-if="userStore.user.character.boots"
        :src="bootsImage || ''"
        alt="Ботинки"
        class="absolute top-[277px] left-[50%] -translate-x-[50%]"
      />
    </div>
  </div>
</template>

<style scoped></style>
