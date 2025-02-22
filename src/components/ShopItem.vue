<script setup lang="ts">
import { useGlobalStore } from '@/stores/globalStore'
import { useUserStore } from '@/stores/userStore'
import type { CustomItem } from '@/types'
import { computed } from 'vue'

const props = defineProps<{
  item: CustomItem
}>()

const userStore = useUserStore()
const globalStore = useGlobalStore()

function buyItem() {
  if (props.item.price <= userStore.user.points) {
    userStore.buyItem(props.item)
  } else {
    globalStore.addToast({ summary: 'Не хватает очков', severity: 'error', life: 3000 })
  }
}

const alreadyHaveItem = computed<boolean>(
  () => userStore.user.customizationItems.find((item) => item.id === props.item.id) !== undefined,
)
</script>

<template>
  <div
    class="flex aspect-square w-full flex-col items-center justify-center gap-1 rounded-xl bg-neutral-300 p-2 font-medium text-black"
  >
    <p class="h-[2lh] text-center">{{ item.name }}</p>
    <img :src="item.imageUrl" alt="Картинка предмета" class="h-[50%] max-w-[80%]" />
    <p class="text-center">{{ item.price }} очков</p>
    <Button
      v-if="!alreadyHaveItem"
      severity="success"
      class="!border-2 !border-black"
      @click="buyItem"
      >Купить</Button
    >
    <p v-else>Уже есть в инвентаре</p>
  </div>
</template>

<style scoped></style>
