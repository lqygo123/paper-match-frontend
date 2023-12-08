
<template>
  <div class="header">智能评价辅助平台</div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue';

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Sidebar",
  components: {
    // HelloWorld,
  },
  data() {
    return {
      aaa: 123,
    };
  },
  mounted() {},
  methods: {},
};
</script>

<style scoped>
.header {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 56px;
  line-height: 56px;
  padding: 0 24px;
  font-size: 28px;
  min-width: 0px;
  max-width: none;
  box-shadow: 0 4px 20px #0000000d;
  background-color: #fff;
  z-index: 1;
  box-sizing: border-box;
}
</style>
