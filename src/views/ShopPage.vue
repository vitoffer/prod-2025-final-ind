<script setup lang="ts">
import customItems from '@/base-data/customItems'
import ShopItemTypedList from '@/components/ShopItemTypedList.vue'

const types = [...new Set(customItems.map((item) => item.type))]
</script>

<template>
  <div class="flex flex-col gap-4 p-4 sm:p-6 md:p-8">
    <ShopItemTypedList v-for="(type, index) in types" :key="index" :type="type" />
  </div>
</template>

<style scoped></style>
