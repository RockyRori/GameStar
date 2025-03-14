<template>
  <div>
    <h1>宗主有令</h1>
    <p>管理宗门，培养弟子，探索修仙世界</p>
    <div>
      <router-link to="/battle">进入战斗</router-link>
      <router-link to="/workshop">工坊管理</router-link>
      <router-link to="/market">市场交易</router-link>
      <router-link to="/tavern">酒馆</router-link>
      <router-link to="/mines">矿区</router-link>
    </div>
  </div>
</template>

<script setup>
import { useGameStore } from '../store';
const store = useGameStore();
</script>