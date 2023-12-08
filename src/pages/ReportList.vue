<template>
  <div class="report-preview">
    <div class="filter">
      <el-form :inline="true" :model="filters" class="demo-form-inline">
        <el-form-item label="项目名称：">
          <el-input
            v-model="filters.projectName"
            placeholder="请输入项目名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="招标编号：">
          <el-input
            v-model="filters.biddingID"
            placeholder="请输入招标编号"
          ></el-input>
        </el-form-item>
        <el-form-item label="招标单位：">
          <el-input
            v-model="filters.biddingCompany"
            placeholder="请输入招标单位"
          ></el-input>
        </el-form-item>
        <el-form-item label="招标代理：">
          <el-input
            v-model="filters.biddingAgent"
            placeholder="请输入招标代理"
          ></el-input>
        </el-form-item>
        <el-form-item label="参与单位：">
          <el-input
            v-model="filters.participateCompany"
            placeholder="请输入参与单位"
          ></el-input>
        </el-form-item>
        <el-form-item label="选择时间：">
          <el-date-picker
            v-model="value1"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            @change="changeDate"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getReports">查询</el-button>
          <!-- <el-button type="primary">导出</el-button> -->
        </el-form-item>
      </el-form>
    </div>

    <div class="report-list">
      <el-table
        :data="reports"
        border
        style="width: 100%"
        @row-click="goDetail"
      >
        <el-table-column
          align="center"
          prop="projectName"
          label="项目名称"
          width="180"
        >
        </el-table-column>
        <el-table-column
          align="center"
          prop="biddingNumber"
          label="招标编号"
          width="180"
        >
        </el-table-column>
        <el-table-column align="center" prop="biddingCompany" label="招标单位">
        </el-table-column>
        <el-table-column align="center" prop="time" label="时间">
        </el-table-column>
        <el-table-column align="center" prop="results" label="文件数量">
        </el-table-column>
      </el-table>
      <!-- <div
        class="report-item"
        v-for="(report, index) in reports"
        :key="index"
        @click="
          $router.push({ path: '/report-detail', query: { id: report._id } })
        "
      >
        <div class="report-item-content">
          项目名称{{ report.metaInfo?.projectName }}
        </div>
        <div class="report-item-content">
          招标编号: {{ report.metaInfo?.biddingNumber }}
        </div>
        <div class="report-item-content">
          招标单位: {{ report.metaInfo?.biddingCompany }}
        </div>
        <div class="report-item-content">时间: {{ report.metaInfo?.time }}</div>
        <div class="report-item-content">
          文件数量: {{ report.results?.length }}
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
import { getReports } from "../apis";

export default {
  name: "ReportDetail",
  components: {
    // HelloWorld,
  },
  data() {
    return {
      value1: "",
      reports: [],
      filters: {
        projectName: "",
        biddingID: "",
        biddingCompany: "",
        biddingAgent: "",
        participateCompany: "",
        startTime: "",
        endTime: "",
      },
    };
  },
  mounted() {
    console.log(this.$route.query);
    this.getReports();
  },

  methods: {
    changeDate() {
      this.filters.startTime = this.value1[0];
      this.filters.endTime = this.value1[1];
    },
    goDetail(row) {
      this.$router.push({ path: "/report-detail", query: { id: row._id } });
    },
    async getReports() {
      console.log("test");
      const res = await getReports(this.filters);
      console.log(res.data);
      // this.reports = res.data;

      this.reports = res.data.map((item) => {
        let tmp = {};
        if (item.metaInfo) {
          tmp = {
            ...item,
            ...item.metaInfo,
          };
        } else {
          tmp = {
            ...item,
            projectName: "",
            biddingNumber: "",
            biddingCompany: "",
            time: "",
          };
        }
        tmp.results = item.results ? item.results.length : 0;

        console.log(tmp)
        return tmp;
      });
    },
  },
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
.report-preview {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
}
::v-deep .el-button--primary {
  background-color: #007bff;
  border-color: #007bff;
}
::v-deep .el-form--inline .el-form-item {
  margin-right: 20px;
}
</style>
