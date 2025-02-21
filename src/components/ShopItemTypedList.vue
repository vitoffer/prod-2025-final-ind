<script setup lang="ts">
import customItems from '@/base-data/customItems'
import { accessoriesFormattedTypeNames } from '@/gamification/constants'
import type { CustomItemType } from '@/types'

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
      <div
        v-for="item in itemsList"
        :key="item.id"
        class="flex aspect-square w-full flex-col items-center justify-center gap-1 rounded-xl bg-neutral-300 p-2 font-medium text-black"
      >
        <p class="h-[2lh] text-center">{{ item.name }}</p>
        <img :src="item.imageUrl" alt="Картинка предмета" class="h-[50%] max-w-[80%]" />
        <p class="text-center">{{ item.price }} очков</p>
        <Button severity="success" class="!border-2 !border-black">Купить</Button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
