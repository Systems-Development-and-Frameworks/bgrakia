<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <NewsList/>
  </div>
</template>

<script>
import NewsList from "@/components/NewsList";

export default {
  name: 'App',
  components: {
    NewsList
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
