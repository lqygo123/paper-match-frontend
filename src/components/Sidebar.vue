
<template>
  <div id="sidebar">
    智能评价辅助平台
    <div class="navi-item">
      <router-link to="/file-upload">标书查重</router-link>
    </div>
    <div class="navi-item">
      <router-link to="/report-list">查看报告</router-link>
    </div>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue';

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Sidebar',
  components: {
    // HelloWorld,
  },
  data() {
    return {
      aaa: 123
    };
  },
  mounted() {

  },
  methods: {

  }
};
</script>

<style>
#sidebar {
  background: #e6e6e6;
  height: 100%;
  width: 200px;
  flex: 0 0 200px;
}
</style>