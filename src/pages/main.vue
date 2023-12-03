<template>
  <div id="main-page">
    <div id="sidebar">
      智能评价辅助平台
      <div class="navi-item" >标书查重</div>
      <div class="navi-item" >查看报告</div>
    </div>
    <div id="content">
      <FileUpload v-if="tab === 'fileUpload'"></FileUpload>
    </div>
  </div>
</template>

<script>

import FileUpload from '../components/FileUpload.vue';

export default {
  name: 'main-page',
  components: {
    FileUpload
  },
  data() {
    return {
      tab: 'fileUpload'
    };
  },
  mounted() {
    // this.loadPdf("http://localhost:3000/static/gpt-4.pdf");
    // this.loadPdf("http://localhost:3000/static/gpt-5.pdf");
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
  display: flex;
  flex-direction: row;
}

#sidebar {
  width: 200px;
  /* 其他样式 */
}

#content {
  flex-grow: 1;
  /* 其他样式 */
}
</style>