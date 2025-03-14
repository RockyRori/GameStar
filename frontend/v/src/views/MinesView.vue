<template>
    <div>
        <h1>矿区</h1>
        <p>采集资源</p>
        <button @click="gatherIron">采集铁矿</button>
    </div>
</template>

<script setup>
import { useGameStore } from '../store';
const store = useGameStore();

const gatherIron = () => {
    store.addResource("iron", 5);
};
</script>