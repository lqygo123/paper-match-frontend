<template>
  <div class="report-detail">
    <Button @click="handleEdit">编辑</Button>
    <Button @click="handleSave">保存</Button>
    <div v-if="mode === 'detail'" class="report-header">
      <div class="header-item">项目名称：{{ metaInfo?.projectName }}</div>
      <div class="header-item">招标编号：{{ metaInfo?.biddingNumber }}</div>
      <div class="header-item">招标人：{{ metaInfo?.biddingCompany }}</div>
      <div class="header-item">参与公司：{{ metaInfo?.participatingCompany }}</div>
      <div class="header-item">时间：{{ metaInfo?.time }}</div>
      <div class="header-item">提交时间：{{ reportTime }}</div>
    </div>
    <div v-if="mode === 'edit'" class="report-header">
      <div class="header-item">项目名称：<Input :value="metaInfo.projectName" @change="metaInfo.projectName = $event.target.value" /></div>
      <div class="header-item">招标编号：<Input :value="metaInfo.biddingNumber" @change="metaInfo.biddingNumber = $event.target.value" /></div>
      <div class="header-item">招标人：<Input :value="metaInfo.biddingCompany" @change="metaInfo.biddingCompany = $event.target.value" /></div>
      <div class="header-item">参与公司：<Input :value="metaInfo.participatingCompany" @change="metaInfo.participatingCompany = $event.target.value" /></div>
      <div class="header-item">时间：<Input :value="metaInfo.time" @change="metaInfo.time = $event.target.value" /></div>
      <div class="header-item">提交时间：{{ reportTime }}</div>
    </div>
    <div class="compire-results">
      <div class="compire-result-item" @click="handleResultClick(result._id)" v-for="(result, index) in results" :key="index">
        <div>对比结果</div>
        <div>文件1: {{ decodeURIComponent(result.biddingFileName)  }}</div>
        <div>文件2: {{ decodeURIComponent(result.targetFileName) }}</div>
        <div>相似度: {{ Math.random() }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { getReportDetail, getDuplicates, saveReport } from '../apis'

export default {
  name: 'ReportDetail',
  components: {
    // HelloWorld,
  },
  data() {
    return {
      id: '',
      mode: 'detail', // 'edit'
      metaInfo: {
        projectName: '',
        biddingNumber: '',
        biddingCompany: '',
        participatingCompany: '',
        time: '',
      },
      reportTime: '',
      results: []
    };
  },
  mounted() {
    console.log(this.$route.query);
    const { id, mode } = this.$route.query;
    this.mode = mode || 'detail';
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
      this.results = results.data;
    },

    handleResultClick(id) {
      this.$router.push({
        path: '/pdf-preview',
        query: {
          compireId: id
        }
      })
    },

    handleEdit() {
      this.mode = 'edit';
    },
    handleSave() {
      this.mode = 'detail';
      saveReport(this.id, this.metaInfo);
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
  box-sizing: border-box;
}
.compire-result-item {
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.report-header {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.header-item {
  margin: 5px;
}

.compire-results {
  margin-top: 20px;
}
</style>