<template>
  <div class="dialog">
    <p>{{ dialog }}</p>
    <button @click="next">下一句</button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  dialog: string
}>()

const emit = defineEmits<{
  (e: 'next-dialog'): void
}>()

function next() {
  emit('next-dialog')
}
</script>

<style scoped>
.dialog {
  border-top: 1px solid #ccc;
  padding-top: 10px;
}
button {
  margin-top: 10px;
  padding: 5px 10px;
}
</style>
