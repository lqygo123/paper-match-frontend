<template>
  <div class="report-preview">
    <div class="header"></div>

    <div class="report-list">
      <div class="report-item" v-for="(report, index) in reports" :key="index">
        
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { BASE_URL } from '../../config';

export default {
  name: 'ReportDetail',
  components: {
    // HelloWorld,
  },
  data() {
    return {
      reports: [],
      filters: {
        projectName: '',
        biddingID: '',
        biddingCompany: '',
        biddingAgent: '',
        participateCompany: '',
        time: '',
      }
    };
  },
  mounted() {
    console.log(this.$route.query);
    this.getReports()
  },



  methods: {
    async getReports() {
      const res = await axios.get(`${BASE_URL}/duplicate/reports`)
      this.reports = res.data.data
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
}
</style>