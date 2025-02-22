<script setup lang="ts">
import achievements from '@/base-data/achievements'
import UserCustomItemBlock from '@/components/UserCustomItemBlock.vue'
import { XPForLevel } from '@/gamification/xp'
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

const level = computed(() => userStore.user.level)
const xp = computed(() => userStore.user.xp)
const xpForNextLevel = computed(() => XPForLevel(level.value + 1))
const progress = computed(() => (xp.value / xpForNextLevel.value) * 100)
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
    <div class="flex justify-between gap-3">
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
      <p>Очки: {{ userStore.user.points }};</p>
    </div>
    <p>{{ xp }} / {{ xpForNextLevel }} XP</p>
    <ProgressBar :value="progress" :showValue="false" />
    <p class="mt-4 mb-2 text-center">Ваш персонаж:</p>
    <div class="relative mr-auto ml-auto w-fit rounded-3xl bg-neutral-300 px-16 py-4">
      <img
        v-if="userStore.user.character.hat"
        :src="userStore.user.character.hat || ''"
        alt="Шапка"
        class="absolute top-[16px] left-[50%] -translate-x-[50%]"
      />
      <img :src="`/character/body/${userStore.user.character.body}.svg`" alt="Тело" class="mt-4" />
      <img
        v-if="userStore.user.character.necklace"
        :src="userStore.user.character.necklace || ''"
        alt="Цепочка"
        class="absolute top-[108px] left-[50%] -translate-x-[50%]"
      />
      <img
        v-if="userStore.user.character.bracelet"
        :src="userStore.user.character.bracelet || ''"
        alt="Браслет"
        class="absolute top-[186px] left-[78px] -translate-x-[50%]"
      />
      <img
        v-if="userStore.user.character.pants"
        :src="userStore.user.character.pants || ''"
        alt="Штаны"
        class="absolute top-[208px] left-[50%] -translate-x-[50%]"
      />
      <img
        v-if="userStore.user.character.boots"
        :src="userStore.user.character.boots || ''"
        alt="Ботинки"
        class="absolute top-[277px] left-[50%] -translate-x-[50%]"
      />
    </div>
    <p class="text-center">Доступные предметы кастомизации:</p>
    <ul class="flex flex-wrap gap-2">
      <li
        v-for="(item, index) in userStore.user.customizationItems"
        :key="index"
        class="flex items-center"
      >
        <UserCustomItemBlock :item="item" />
      </li>
    </ul>
    <RouterLink :to="{ name: 'ShopPage' }" class="p-button mx-auto my-2 !block w-fit"
      >В магазин</RouterLink
    >
    <p class="text-center">Ачивки:</p>
    <p>Получены:</p>
    <div v-for="ach in achievements" :key="ach.id" class="achievement-item">
      <div class="achievement-icon">
        <i class="pi pi-trophy"></i>
      </div>
      <div class="achievement-info">
        <h3>{{ ach.name }}</h3>
        <p>{{ ach.description }}</p>
        <small v-if="userStore.user.achievements.find((userAch) => userAch.id === ach.id)"
          >Получено</small
        >
        <small v-else>Не получено</small>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
