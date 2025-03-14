// src/App.vue
<template>
  <div id="app">
    <header>
      <h1>宗主有令</h1>
      <nav>
        <router-link to="/">首页</router-link>
        <router-link to="/battle">战斗</router-link>
        <router-link to="/workshop">工坊</router-link>
        <router-link to="/market">市场</router-link>
        <router-link to="/tavern">酒馆</router-link>
        <router-link to="/mines">矿区</router-link>
      </nav>
    </header>
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
</script>

<style>
#app {
  text-align: center;
  font-family: Arial, sans-serif;
}

header {
  background-color: #333;
  color: white;
  padding: 10px;
}

nav a {
  color: white;
  text-decoration: none;
  margin: 0 10px;
}

nav a:hover {
  text-decoration: underline;
}

main {
  padding: 20px;
}
</style>
