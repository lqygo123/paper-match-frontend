<template>
  <div id="main-page">
    <div id="sidebar">
      智能评价辅助平台
      <div class="navi-item" @click="handleTabChange('fileUpload')">标书查重</div>
      <div class="navi-item" @click="handleTabChange('reportList')">查看报告</div>
    </div>
    <div id="content">
      <FileUpload v-if="tab === 'fileUpload'"></FileUpload>
      <ReportList v-if="tab === 'reportList'"></ReportList>
    </div>
  </div>
</template>

<script>

import FileUpload from '../components/FileUpload.vue';
import ReportList from '../pages/ReportList.vue';

export default {
  name: 'main-page',
  components: {
    FileUpload,
    ReportList
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
    handleTabChange(tab) {
      this.tab = tab;
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