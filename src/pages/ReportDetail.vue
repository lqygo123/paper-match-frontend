<template>
  <div class="report-detail">
    <div v-if="mode === 'detail'">
      <div class="title"><span>xxxx</span>项目标书对比报告</div>
      <div class="report-header">
        <div class="header-item">
          项目名称：<span>{{ metaInfo?.projectName }}</span>
        </div>
        <div class="header-item">
          招标编号：<span>{{ metaInfo?.biddingNumber }}</span>
        </div>
        <div class="header-item">
          招标人：<span>{{ metaInfo?.biddingCompany }}</span>
        </div>
        <div class="header-item">
          参与公司：<span>{{ metaInfo?.participatingCompany }}</span>
        </div>
        <div class="header-item">
          时间：<span>{{ metaInfo?.time }}</span>
        </div>
        <div class="header-item">
          提交时间：<span>{{ reportTime }}</span>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <td>序号</td>
            <td>对比结果</td>
            <td>原标公司</td>
            <td>对比公司</td>
            <td>查重率</td>
            <td>图片相似张数</td>
            <td>相似句子数量</td>
          </tr>
        </thead>
        <tbody>
          <tr
            @click="handleResultClick(result)"
            v-for="(result, index) in results"
            :key="index"
          >
            <td>{{ index + 1 }}</td>
            <td>对比结果</td>
            <td>{{ result.file1 }}</td>
            <td>{{ result.file2 }}</td>
            <td><a href="">{{result.same}}</a></td>
            <td><a href="">90</a></td>
            <td><a href="">90</a></td>
          </tr>
        </tbody>
      </table>
      <!-- <div class="compire-results">
        <div
          class="compire-result-item"
          @click="handleResultClick(result._id)"
          v-for="(result, index) in results"
          :key="index"
        >
          <div>对比结果</div>
          <div>文件1: {{ decodeURIComponent(result.biddingFileName) }}</div>
          <div>文件2: {{ decodeURIComponent(result.targetFileName) }}</div>
          <div>相似度: {{ Math.random() }}</div>
        </div>
      </div> -->
      <div class="buttons">
        <Button @click="handleEdit">编辑</Button>
        <Button>下载</Button>
        <!-- <Button @click="handleSave">保存</Button> -->
      </div>
    </div>
    <div v-if="mode === 'edit'" style="text-align: center">
      <el-form
        ref="form"
        :model="metaInfo"
        label-width="82px"
        style="width: 300px; display: inline-block"
      >
        <el-form-item label="项目名称：">
          <el-input v-model="metaInfo.projectName"></el-input>
        </el-form-item>
        <el-form-item label="招标编号：">
          <el-input v-model="metaInfo.biddingNumber"></el-input>
        </el-form-item>
        <el-form-item label="招标人：">
          <el-input v-model="metaInfo.biddingCompany"></el-input>
        </el-form-item>
        <el-form-item label="参与公司：">
          <el-input v-model="metaInfo.participatingCompany"></el-input>
        </el-form-item>
        <el-form-item label="时间：">
          <el-input v-model="metaInfo.time"></el-input>
        </el-form-item>
        <el-form-item label="提交时间：">
          <el-input v-model="reportTime"></el-input>
        </el-form-item>
      </el-form>
      <el-table
        :data="results"
        border
        style="width: 100%"
        @row-click="handleResultClick"
      >
        <el-table-column align="center" prop="compare" label="序号">
        </el-table-column>
        <el-table-column align="center" prop="compare" label="对比结果">
        </el-table-column>
        <el-table-column align="center" prop="file1" label="原标公司">
        </el-table-column>
        <el-table-column align="center" prop="file2" label="对比公司">
        </el-table-column>
        <el-table-column align="center" prop="same" label="查重率">
        </el-table-column>
        <el-table-column align="center" prop="same" label="图片相似张数">
        </el-table-column>
        <el-table-column align="center" prop="same" label="相似句子数量">
        </el-table-column>
      </el-table>
      <div class="buttons">
        <!-- <Button @click="handleEdit">编辑</Button> -->
        <Button @click="handleSave">保存</Button>
      </div>
    </div>
  </div>
</template>

<script>
import { getReportDetail, getDuplicates, saveReport } from "../apis";

export default {
  name: "ReportDetail",
  components: {
    // HelloWorld,
  },
  data() {
    return {
      id: "",
      mode: "detail", // 'edit'
      metaInfo: {
        projectName: "",
        biddingNumber: "",
        biddingCompany: "",
        participatingCompany: "",
        time: "",
      },
      reportTime: "",
      results: [],
    };
  },
  mounted() {
    console.log(this.$route.query);
    const { id, mode } = this.$route.query;
    this.mode = mode || "detail";
    this.id = id;
    this.getReportDetail(id);
  },

  methods: {
    async getReportDetail(id) {
      const res = await getReportDetail(id)
      console.log('getReportDetail', res);
      const results = await getDuplicates(res.data.results)
      this.reportTime = res.data.reportTime;
      this.metaInfo = res.data.metaInfo || {
        projectName: '',
        biddingNumber: '',
        biddingCompany: '',
        participatingCompany: '',
        time: '',
      };
      console.log('getDuplicates', results)
      // this.results = results.data;
      this.results = results.data.map((item) => {
        const tmp = {
          ...item,
          compare: "对比结果",
          file1: '文件1:'+decodeURIComponent(item.biddingFileName),
          file2: '文件2:'+decodeURIComponent(item.targetFileName),
          same: '相似度: '+Math.random(),
        };
        return tmp;
      });

      // 测试数据  没用可删
      // this.reportTime = "reportTime";
      // this.metaInfo = {
      //   projectName: "projectName",
      //   biddingNumber: "biddingNumber",
      //   biddingCompany: "biddingCompany",
      //   participatingCompany: "participatingCompany",
      //   time: "time",
      // };
      // this.results = [
      //   {
      //     compare: "对比文件",
      //     file1: "文件1",
      //     file2: "文件2",
      //     same: Math.random(),
      //   },
      //   {
      //     compare: "对比文件",
      //     file1: "文件1",
      //     file2: "文件2",
      //     same: Math.random(),
      //   },
      // ];
    },

    handleResultClick(row) {
      console.log('handleResultClick', row)
      this.$router.push({
        path: "/pdf-preview",
        query: {
          compireId: row._id,
        },
      });
    },

    handleEdit() {
      this.mode = "edit";
    },
    handleSave() {
      this.mode = "detail";
      saveReport(this.id, this.metaInfo);
    },
  },
};
</script>

<style scoped>
.report-detail {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
}
.buttons {
  text-align: center;
}
.buttons button {
  border: none;
  bottom: 0px;
  background: #007bff;
  width: 90px;
  height: 40px;
  border-radius: 4px;
  font-size: 16px;
  color: #fff;
  text-align: center;
  line-height: 21px;
  font-weight: 400;
  cursor: pointer;
  margin-top: 24px;
  margin-right: 20px;
}
.buttons button:last-child {
  margin-right: 0;
}
.title {
  font-size: 28px;
  text-align: center;
  margin-bottom: 30px;
}
.title span {
  border-bottom: 2px solid #000;
}
.report-header .header-item {
  font-size: 18px;
  margin-bottom: 12px;
}
.report-header .header-item span {
  border-bottom: 2px solid #000;
}
table {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #000;
  border-collapse: collapse;
  margin-top: 24px;
}
table * {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  border-spacing: 0;
}
table tr {
  height: 36px;
  line-height: 36px;
  text-align: center;
}
table tr td {
  padding: 0 10px;
  border-bottom: 1px solid #000;
  border-right: 1px solid #000;
}
table tr td:last-child {
  border-right: 0px solid #000;
}
table tbody tr:last-child td {
  border-bottom: 0px solid #000;
}
table tr td a {
  color: #007bff;
}
</style>
