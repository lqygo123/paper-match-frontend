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
            v-model="filters.biddingNumber"
            placeholder="请输入招标编号"
          ></el-input>
        </el-form-item>
        <el-form-item label="招标单位：">
          <el-input
            v-model="filters.biddingCompany"
            placeholder="请输入招标单位"
          ></el-input>
        </el-form-item>
        <el-form-item label="参与公司：">
          <el-input
            v-model="filters.participatingCompany"
            placeholder="请输入参与公司"
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
          <!-- 重置 -->
          <el-button @click="() => { filters = {} ; getReports() }">重置</el-button>
          <el-button type="primary" @click="getReports">查询</el-button>
          <el-button v-if="selectedRow.length" type="danger" @click="deleteSelected">删除选中项目</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="report-list">
      <el-table
        :data="reports"
        border
        style="width: 100%"
        @selection-change="handleSeletionChange"
      >
        <el-table-column type="selection" align="center" class-name="felxc" width="50"></el-table-column>
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

        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button
            type="text"
              size="mini"
              @click="goDetail(scope.row)"
              >查看</el-button
            >
            <el-button
              type="text"
              class="danger-text-button"
              size="mini"
              @click="deleteReport(scope.row._id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          layout="prev, pager, next, jumper"
          :total="pagination.total"
          :page-size="pagination.pageSize"
          :current-page="pagination.page"
          @current-change="getReports"
        ></el-pagination>
      </div>

    </div>
  </div>
</template>

<script>
import { getReports, deleteReport } from "../apis";

export default {
  name: "ReportDetail",
  components: {
    // HelloWorld,
  },
  data() {
    return {
      value1: "",
      reports: [],
      // 分页对象
      pagination: {
        page: 1,
        pageSize: 10,
        total: 0,
      },
      selectedRow: [],
      filters: {
        projectName: "",
        biddingNumber: "",
        biddingCompany: "",
        participatingCompany: "",
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
      this.filters.startTime =  this.value1 && this.value1[0] ;
      this.filters.endTime = this.value1 && this.value1[1];
    },
    goDetail(row) {
      this.$router.push({ path: "/report-detail", query: { id: row._id } });
    },
    async getReports(pageNum = 1) {
      console.log("test");
      const { pageSize } = this.pagination;
      this.pagination.page = pageNum;
      this.filters.page = pageNum;
      this.filters.pageSize = pageSize;
      const res = await getReports(this.filters);
      console.log(res.data);
      // this.reports = res.data;
      this.pagination.total = res.total;
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

    async deleteReport(id) {
      this.$confirm('此操作将永久删除该报告, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await deleteReport(id);
        console.log(res);
        this.getReports(this.pagination.page);
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },

    handleSeletionChange(val) {
      console.log('handleSeletionChange', val);
      this.selectedRow = val;
    },

    async deleteSelected() {

      // coomfirm
      this.$confirm(`此操作将永久删除 ${this.selectedRow.length} 份报告, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await this.deleteSelectedReports();
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
        this.getReports(this.pagination.page);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },

    async deleteSelectedReports() {
      const ids = this.selectedRow.map((item) => item._id);
      await Promise.all(ids.map((id) => deleteReport(id)));
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

.felxc {
  display: flex;
  align-items: center;
  justify-content: center;
}

.filter .el-form-item  {
  margin-bottom: 20px;
  margin-right: 20px;
}
.filter {
  background: #FAFAFA;
  padding: 20px 0 0 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}
#main-page .el-date-editor .el-range-separator {
  box-sizing: content-box;
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
  margin: 24px;
  /* width: 100%; */
  height: calc(100% - 48px);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.pagination {
  margin-top: 20px;
  margin-right: 50px;
  display: flex;
  justify-content: flex-end;
}

.report-list {
  flex-grow: 1;
  overflow: auto;
  width: 100%;
}

.danger-text-button {
  color: #ff4d4f;
}
.danger-text-button:hover {
  color: #ff7875;
}


</style>
<style>
/* .el-table .cell {
  display: flex;
  align-items: center;
  justify-content: center;
} */

</style>
