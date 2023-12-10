<template>
  <div class="report-detail">

    <div class="header-con">
      <div class="header-desc"> {{ mode === 'edit' ? '编辑报告' : '查重报告结果' }}</div>
    </div>
    <div class="main-con">
      <!-- <el-form
        v-if="mode === 'edit'"
        ref="form"
        :model="metaInfo"
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
      </el-form> -->

      <div class="report-header">
          <div class="header-item">
            <span class="label">项目名称：</span>
            <span v-if="mode === 'detail'" class="content">{{ metaInfo.projectName || '—'  }}</span>
            <el-input v-if="mode === 'edit'" v-model="metaInfo.projectName" placeholder="请输入项目名称"></el-input>
          </div>
          <div class="header-item">
            <span class="label">招标编号：</span>
            <span v-if="mode === 'detail'" class="content">{{ metaInfo.biddingNumber || '—'  }}</span>
            <el-input v-if="mode === 'edit'" v-model="metaInfo.biddingNumber" placeholder="请输入招标编号"></el-input>
          </div>
          <div class="header-item">
            <span class="label">招标人：</span>
            <span v-if="mode === 'detail'" class="content">{{ metaInfo.biddingCompany || '—'  }}</span>
            <el-input v-if="mode === 'edit'" v-model="metaInfo.biddingCompany" placeholder="请输入招标人"></el-input>
          </div>
          <div class="header-item">
            <span class="label">参与公司：</span>
            <span v-if="mode === 'detail'" class="content">{{ metaInfo.participatingCompany || '—'  }}</span>
            <el-input v-if="mode === 'edit'" v-model="metaInfo.participatingCompany" placeholder="请输入参与公司"></el-input>
          </div>
          <div class="header-item">
            <span class="label">开标时间：</span>
            <span v-if="mode === 'detail'" class="content">{{ metaInfo.time || '—'  }}</span>
            <!-- 使用 Date Picker 选择日期，并将相应的string 值设置到 metaInfo.time  -->
            <el-date-picker
              v-if="mode === 'edit'"
              v-model="metaInfo.time"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
            ></el-date-picker>
          </div>
          <div class="header-item">
            <span class="label">提交时间：</span>
            <span class="content">{{ reportTime.substring(0, 10) }}</span>
          </div>
        </div>
      <el-table
        :data="results"
        border
        style="width: 100%"
        @row-click="handleResultClick"
      >
        <el-table-column
          align="center"
          label="编号"
          width="50"
        >
          <template slot-scope="scope">
            <span>{{ scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="biddingFileName"
          label="招标公司"
        >
        </el-table-column>
        <el-table-column
          align="center"
          prop="targetFileName"
          label="对比公司"
        >
        </el-table-column>
        <el-table-column
          align="center"
          prop="repetitionRate"
          label="重复率"
        >
        </el-table-column>
        <el-table-column
          align="center"
          prop="sameImage"
          label="图片相似(张)"
        >
        </el-table-column>
        <el-table-column
          align="center"
          prop="sameSentence"
          label="相似句子(条)"
        >
        </el-table-column>
      </el-table>



    </div>
    <div class="bottom-con">
      <Button v-if="mode === 'detail'" @click="handleEdit">编辑</Button>
      <Button v-if="mode === 'edit'" @click="handleSave">保存</Button>
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
          biddingFileName: decodeURIComponent(item.biddingFileName),
          targetFileName: decodeURIComponent(item.targetFileName),
          repetitionRate: `${parseFloat(item.abstract.repetitionRate) * 100}`.substring(0, 5) + '%',
          sameImage: `${item.abstract.imageRepetitionCount}/${item.abstract.imageTotal}`,
          sameSentence: `${item.abstract.textRepetitionCount}/${item.abstract.textTotal}`,
        };
        return tmp;
      });
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
  margin: 24px;
  height: calc(100% - 48px);
  overflow-y: auto;
  position: relative;
}

.report-detail .header-con {
  position: absolute;
  top: 0;
  left: 0;
  height: 60px;
  width: 100%;
  border-bottom: 1px solid #e6e6e6;
}

.report-detail .header-con .header-desc {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
}


.report-detail .bottom-con {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 60px;
  width: 100%;
  border-top: 1px solid #e6e6e6;

  display: flex;
  align-items: center;
  justify-content: center;
}

.report-detail .main-con {
  margin-top: 60px;
  margin-bottom: 60px;
  height: calc(100% - 120px);
  overflow-y: auto;
  padding: 24px;
  background: #fff;
}

.buttons {
  text-align: center;
}

.bottom-con button {
  border: none;
  bottom: 0px;
  background: #007bff;
  width: 90px;
  height: 32px;
  border-radius: 4px;
  font-size: 16px;
  color: #fff;
  text-align: center;
  line-height: 21px;
  font-weight: 400;
  cursor: pointer;
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

.report-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-bottom: 20px;
} 

.report-header .header-item {
  height: 40px;
  flex-basis: 50%;
  font-size: 18px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  position: relative;
}

.header-item .label {
  display: inline-block;
  width: 120px;
}

.header-item .el-input {
  display: inline-block;
  width: calc(100% - 140px);
}
.header-item .el-date-editor {
  display: inline-block;
  width: calc(100% - 140px);
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
}</style>
