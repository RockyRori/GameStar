<template>
  <div class="inventory">
    <h3>库存</h3>
    <ul>
      <li v-for="item in items" :key="item.id">
        {{ item.name }} - {{ item.price }} 金币
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
interface Item {
  id: number
  name: string
  price: number
}

const props = defineProps<{
  items: Item[]
}>()
</script>

<style scoped>
.inventory {
  margin-bottom: 20px;
  text-align: left;
}
</style>
