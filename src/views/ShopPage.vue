<script setup lang="ts">
import customItems from '@/base-data/customItems'
import ShopItemTypedList from '@/components/ShopItemTypedList.vue'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()

const types = [...new Set(customItems.map((item) => item.type))]
</script>

<template>
  <h1 class="mt-3 text-center text-3xl font-semibold">Магазин</h1>
  <h2 class="mt-2 text-center text-xl font-semibold">Ваши очки: {{ userStore.user.points }}</h2>
  <div class="flex flex-col gap-4 p-4 !pt-0 sm:p-6 md:p-8">
    <ShopItemTypedList v-for="(type, index) in types" :key="index" :type="type" />
  </div>
</template>

<style scoped></style>
