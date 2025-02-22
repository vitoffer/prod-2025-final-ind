<script setup lang="ts">
import { useUserStore } from '@/stores/userStore'
import type { CustomItem } from '@/types'
import { computed } from 'vue'

const props = defineProps<{ item: CustomItem }>()

const userStore = useUserStore()

const isItemWorn = computed<boolean>(() =>
  Object.values(userStore.user.character).includes(props.item.imageUrl),
)
</script>

<template>
  <div class="flex w-fit flex-col items-center gap-2 rounded-lg bg-neutral-300 p-4">
    <img :src="item.imageUrl" alt="Картинка предмета кастомизации" class="w-[50px]" />
    <Button size="small" v-if="isItemWorn" @click="() => userStore.unWearItem(item)">Снять</Button>
    <Button size="small" v-else @click="() => userStore.wearItem(item)">Надеть</Button>
  </div>
</template>

<style scoped></style>
