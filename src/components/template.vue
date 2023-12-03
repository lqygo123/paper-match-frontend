<template>
  <div id="main-page">

  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue';

export default {
  name: 'FileUpload',
  components: {
    // HelloWorld,
  },
  data() {
    return {
      aaa: 123
    };
  },
  mounted() {
    // this.loadPdf("http://localhost:3000/static/gpt-4.pdf");
    this.loadPdf("http://localhost:3000/static/gpt-5.pdf");
  },
  methods: {
    aa() {
      console.log("aa");
    },
  }
};
</script>

<style>
#main-page {
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  box-sizing: border-box;
}
</style>