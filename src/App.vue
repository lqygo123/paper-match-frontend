<template>
  <div id="app">
    <Sidebar v-if="showSidebar" />
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
  data() {
    return {
      showSidebar: this.$route.name !== 'login'
    };
  },
  mounted() {
    console.log('mounted', this.$route);
  },
  watch: {
    '$route'(to) {
      console.log('watch $route', to);
      // 如果当前路由是登录页面，不显示 Sidebar
      this.showSidebar = to.name !== 'login';
    }
  },
  errorCaptured(err, vm, info) {
    // 错误处理逻辑...
    console.error(err, info);
    return false; // 阻止错误继续向上冒泡
  }
};
</script>

<style>
*,
*::before,
*::after {
  box-sizing: border-box;
}
#app {
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;

  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;

  word-break: break-all;
}
.main-con {
  flex: 1;
  height: 100%;
  background: #f5f5f5;
}
</style>