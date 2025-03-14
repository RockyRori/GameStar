<template>
    <div>
        <h1>酒馆</h1>
        <p>招募新弟子</p>
        <button @click="recruit">招募弟子</button>
    </div>
</template>

<script setup>
import { useGameStore } from '../store';
const store = useGameStore();

const recruit = () => {
    store.recruitDisciple({ name: "新弟子", level: 1 });
};
</script>