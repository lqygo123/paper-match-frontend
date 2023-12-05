<template>
  <div id="app">
    <Sidebar />
    <div class="main-con">
      <router-view/>
    </div>
  </div>
</template>

<script>

import Sidebar from './components/Sidebar.vue';

export default {
  name: 'App',
  components: {
    Sidebar
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

  display: flex;
  align-items: center;
  justify-content: space-between;
}
.main-con {
  flex: 1;
  height: 100%;
  background: #f5f5f5;
}
</style>