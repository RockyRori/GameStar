<template>
    <div>
        <h1>工坊管理</h1>
        <p>制造装备和符箓</p>
        <button @click="craftSword">打造铁剑</button>
    </div>
</template>

<script setup>
import { useGameStore } from '../store';
const store = useGameStore();

const craftSword = () => {
    store.craftEquipment({ name: "铁剑", attack: 10 });
};
</script>