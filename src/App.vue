<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>


export default {
  name: 'App',
  components: {

  },
};
</script>

<style>
#app {
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;

  box-sizing: border-box;
}
</style>