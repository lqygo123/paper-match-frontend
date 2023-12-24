<template>
  <div class="report-detail">

    <div class="header-con">
      <div class="header-desc"> {{ mode === 'edit' ? '编辑报告' : '查重报告结果' }}</div>
    </div>
    <div class="pdf-export-main-con">
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
          label="查重文件"
        >
        </el-table-column>
        <el-table-column
          align="center"
          prop="targetFileName"
          label="对比文件"
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
        <!-- 操作.查看按钮 -->
        <el-table-column v-if="showPreview" align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              @click="handleResultClick(scope.row)"
              >查看</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="bottom-con">
      <!-- 返回 -->
      <el-button size="mini" @click="$router.push('/report-list')">返回</el-button>
      <el-button type="primary" size="mini" v-if="mode === 'detail'" @click="handleEdit">编辑</el-button>
      <el-button type="primary" size="mini" v-if="mode === 'detail'" @click="exportPdf">导出报告</el-button>
      <el-button type="primary" size="mini" v-if="mode === 'edit'" @click="handleSave">保存</el-button>
    </div>



  </div>
</template>

<script>
import { getReportDetail, getDuplicates, saveReport } from "../apis";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default {
  name: "ReportDetail",
  components: {
    // HelloWorld,
  },
  data() {
    return {
      id: "",
      mode: "detail", // 'edit'
      showPreview: true,
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
          repetitionRate: `${parseFloat( (item.abstract.imageRepetitionCount + item.abstract.textRepetitionCount) / (item.abstract.pdf1ImageTotal + item.abstract.pdf1TextTotal)) * 100 || 0}`.substring(0, 5) + '%',
          sameImage: `${item.abstract.imageRepetitionCount}/${item.abstract.pdf1ImageTotal}`,
          sameSentence: `${item.abstract.textRepetitionCount}/${item.abstract.pdf1TextTotal}`,
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

    async exportPdf() {

      this.showPreview = false;
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve()
        }, 100)
      })

      const element = document.querySelector('.pdf-export-main-con');
      const bottomCon = document.querySelector('.bottom-con');

      const originalDisplay = bottomCon.style.display;
      bottomCon.style.display = 'none';

      // 暂时修改 pdf-export-main-con 让它不要滚动，从而可以绘制全部内容
      element.style.overflowY = 'visible';
      element.style.height = 'auto';


      const canvas = await html2canvas(element, {
        windowHeight: element.scrollHeight,
        windowWidth: element.scrollWidth
      });
      const imgData = canvas.toDataURL('image/png');
      bottomCon.style.display = originalDisplay;

      // 考虑 pdf-export-main-con 可能滚动，如有滚动，要把滚动下面的内容也画进 pdf
      const width = element.scrollWidth * 0.264583;
      const height = element.scrollHeight * 0.264583;

      // 改回原来的样式
      element.style.overflowY = 'auto';
      element.style.height = 'calc(100% - 120px)';

      // 创建一个与 .pdf-export-main-con 元素大小一致的 jsPDF 实例
      const pdf = new jsPDF({
        orientation: height > width ? 'portrait' : 'landscape',
        unit: 'mm',
        format: [width, height]
      });

      this.showPreview = true


      // 将图片添加到 jsPDF 实例
      pdf.addImage(imgData, 'PNG', 0, 0, width, height);

      // 保存 PDF
      pdf.save('report.pdf');
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

.report-detail .pdf-export-main-con {
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

.header-item {
  display: inline-block;
  width: 120px;
  font-size: 14px;
  color: #666666;
}

.header-item .el-input {
  display: inline-block;
  width: calc(100% - 140px);
}
.header-item .el-date-editor {
  display: inline-block;
  width: calc(100% - 140px);
}
</style>
