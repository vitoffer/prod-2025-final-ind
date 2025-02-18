<script setup lang="ts">
const goal = defineModel<number>()
</script>

<template>
  <InputNumber
    v-model="goal"
    showButtons
    :min="1"
    :max="999"
    input-class="w-[3.5rem]"
    button-layout="horizontal"
    decrement-button-class="!w-[1.5rem]"
    increment-button-class="!w-[1.5rem]"
  />
</template>

<style scoped></style>
