<template>
  <div class="report-preview">
    <div class="filter">
      <el-form :inline="true" :model="filters" class="demo-form-inline">
        <el-form-item label="项目名称">
          <el-input v-model="filters.projectName" placeholder="请输入项目名称"></el-input>
        </el-form-item>
        <el-form-item label="招标编号">
          <el-input v-model="filters.biddingID" placeholder="请输入招标编号"></el-input>
        </el-form-item>
        <el-form-item label="招标单位">
          <el-input v-model="filters.biddingCompany" placeholder="请输入招标单位"></el-input>
        </el-form-item>
        <el-form-item label="招标代理">
          <el-input v-model="filters.biddingAgent" placeholder="请输入招标代理"></el-input>
        </el-form-item>
        <el-form-item label="参与单位">
          <el-input v-model="filters.participateCompany" placeholder="请输入参与单位"></el-input>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker
            v-model="filters.startTime"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            style="width: 100%;"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker
            v-model="filters.endTime"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            style="width: 100%;"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getReports">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="report-list">
      <div class="report-item" 
        v-for="(report, index) in reports" :key="index" 
        @click="$router.push({ path: '/report-detail', query: { id: report._id } })"
      >
        <div class="report-item-content">项目名称{{ report.metaInfo?.projectName }}</div>
        <div class="report-item-content">招标编号: {{ report.metaInfo?.biddingNumber }}</div>
        <div class="report-item-content">招标单位: {{ report.metaInfo?.biddingCompany }}</div>
        <div class="report-item-content">时间: {{ report.metaInfo?.time }}</div>
        <div class="report-item-content"> 文件数量: {{ report.results?.length }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { getReports } from '../apis'

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
        startTime: '',
        endTime: '',
      }
    };
  },
  mounted() {
    console.log(this.$route.query);
    this.getReports()
  },



  methods: {
    async getReports() {
      const res = await getReports(this.filters)
      console.log(res.data)
      this.reports = res.data
    },
  }
};
</script>

<style scoped>
#main-page {
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
.report-item {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
</style>