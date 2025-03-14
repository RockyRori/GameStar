<template>
  <div class="shop">
    <h2>我的武器店</h2>
    <!-- 显示库存 -->
    <Inventory :items="inventory" />
    <!-- 显示对话 -->
    <Dialog :dialog="currentDialog" @next-dialog="nextDialog" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Inventory from './Inventory.vue'
import Dialog from './Dialog.vue'

interface Item {
  id: number
  name: string
  price: number
}

// 示例库存数据
const inventory = ref<Item[]>([
  { id: 1, name: '剑', price: 100 },
  { id: 2, name: '盾', price: 150 },
  { id: 3, name: '弓', price: 120 }
])

// 示例对话数据
const dialogs: string[] = [
  "欢迎光临，勇士！",
  "需要些什么？",
  "本店出品，绝不含糊！"
]

const currentDialogIndex = ref(0)
const currentDialog = ref(dialogs[currentDialogIndex.value])

// 切换到下一句对话
function nextDialog() {
  currentDialogIndex.value++
  if (currentDialogIndex.value < dialogs.length) {
    currentDialog.value = dialogs[currentDialogIndex.value]
  } else {
    // 对话结束后重置或触发其他逻辑
    currentDialogIndex.value = 0
    currentDialog.value = dialogs[currentDialogIndex.value]
  }
}
</script>

<style scoped>
.shop {
  border: 2px solid #333;
  padding: 20px;
  width: 500px;
  margin: 0 auto;
  background: #f9f9f9;
}
</style>
