<template>
    <div>
      <h1>战斗系统</h1>
      <p>选择你的弟子进行战斗！</p>
      <button @click="startBattle">开始战斗</button>
    </div>
  </template>
  
  <script setup>
  import { useGameStore } from '../store';
  const store = useGameStore();
  
  const startBattle = () => {
    console.log("战斗开始");
  };
  </script>