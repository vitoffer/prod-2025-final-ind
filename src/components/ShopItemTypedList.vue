<script setup lang="ts">
import customItems from '@/base-data/customItems'
import { accessoriesFormattedTypeNames } from '@/gamification/constants'
import type { CustomItemType } from '@/types'
import ShopItem from './ShopItem.vue'

const props = defineProps<{ type: CustomItemType }>()

const itemsList = customItems.filter((item) => item.type === props.type)

const formattedTypeName = accessoriesFormattedTypeNames.find(
  (accessory) => accessory.name === props.type,
)?.formattedName
</script>

<template>
  <div>
    <p class="mb-2">{{ formattedTypeName }}</p>
    <div
      class="grid max-w-[1440px] grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
    >
      <ShopItem v-for="item in itemsList" :key="item.id" :item="item" />
    </div>
  </div>
</template>

<style scoped></style>
