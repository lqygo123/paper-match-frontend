<template>
  <div id="file-upload">
    <div
      class="compire-loading"
      v-if="isCompire"
    >
      结果对比中，请耐心等待...
    </div>

    <div
      id="mode-switch"
      class="file-upload-tab"
    >
      <div
        class="file-upload-tab-item"
        @click="mode = 'digital'"
        :class="{ active: mode === 'digital' }"
      >
        <span>文件对比</span>
      </div>
      <div
        class="file-upload-tab-item"
        @click="mode = 'ocr'"
        :class="{ active: mode === 'ocr' }"
      >
        <span>扫描件对比</span>
      </div>
    </div>

    <div class="main-content">
      <div class="file-upload-header">
        招标文件（可选）
      </div>
      <div class="file-upload-desc">
        可选择上传一份招标文件参与查重，与招标文件相同内容不参与查重
      </div>
      <div
        class="drop-zone"
        @drop="handleDropSkipFile"
        @dragover.prevent
        @dragenter.prevent
      >
        <div class="upload-box left-box">
          <div class="origin-file preview-div">
            <img
              src="../assets/icon.webp"
              style="top: 0px; margin-top: 0px; width: 72px; height: 72px"
            />
          </div>
        </div>
        <div class="unUploaded-container">
          <div class="select-file-text left-select">拖放招标文件到这里</div>
          <div class="file-restriction">
            格式支持：单份50M以内word、pdf、ppt、txt、扫描件文档进行比对
            页数文档：电子文档500页，扫描件300页
          </div>
        </div>
      </div>


      <div
        v-if="skipFile"
        class="file-list"
      >
        <div
          class="file-item"
        >
          <div class="file-content"> 招标文件 </div>
          <div class="file-name">{{ skipFile.name }}</div>
          <div class="file-content">{{ skipFile.state }}</div>
          <div class="file-content"> <el-button @click="deleteSkipFile()">删除</el-button></div>
        </div>
      </div>



      <div class="file-upload-header">
        投标文件（必选）
      </div>

      <div
        class="drop-zone"
        @drop="handleDrop"
        @dragover.prevent
        @dragenter.prevent
      >
        <div class="upload-box left-box">
          <div class="origin-file preview-div">
            <img
              src="../assets/icon.webp"
              style="top: 0px; margin-top: 0px; width: 72px; height: 72px"
            />
          </div>
        </div>
        <div class="unUploaded-container">
          <div class="select-file-text left-select">拖放投标文件到这里</div>
          <div class="file-restriction">
            格式支持：单份50M以内word、pdf、ppt、txt、扫描件文档进行比对
            页数文档：电子文档500页，扫描件300页
          </div>
        </div>
      </div>

      <div
        v-if="files.length"
        class="file-list"
      >
        <div
          class="file-item"
          v-for="(file, index) in files"
          :key="index"
        >
          <div class="file-content"> 投标文件 </div>
          <div class="file-name">{{ file.name }}</div>
          <div class="file-content">{{ file.state }}</div>
          <div class="file-content"> <el-button @click="deleteFile(index)">删除</el-button></div>
        </div>
      </div>

      <input
        type="file"
        @change="handleFile"
        ref="fileInput"
        style="display: none"
      />
      <!-- <button @click="triggerFileInput">选择文件</button> -->
    </div>

    <div class="buttons-wrap">
      <el-button
        type="primary"
        @click="handleCompire"
      >执行对比 
    </el-button>
    </div>

    <!-- <div class="compire-results">
      <div
        class="compire-result-item"
        v-for="(result, index) in compireResults"
        :key="index"
      >
        <div>对比结果</div>
        <div>文件1: {{ decodeURIComponent(result.biddingFileName) }}</div>
        <div>文件2: {{ decodeURIComponent(result.targetFileName) }}</div>
        <div>相似度: {{ Math.random() }}</div>
      </div>
    </div> -->
  </div>
</template>

<script>
import { uploadFile, createReport, execDuplicate, createBatchDuplicate, getCurrentTasks } from "../apis";

export default {
  name: "FileUpload",
  data() {
    return {
      mode: "digital", // digital | ocr
      files: [],
      skipFile: null,
      compireResults: [],
      isCompire: false,
    };
  },
  watch: {
    files: {
      handler() {
        console.log(this.files);
      },
      deep: true,
    },
  },
  methods: {
    validateFiles(files) {
      const validTypes = [
        "application/pdf",
        // 'application/zip',
        // 'application/msword',
        // 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        // 'application/x-zip-compressed',
        // 'application/x-rar-compressed',
      ];
      console.log(files);
      const validFiles = files.filter((file) => validTypes.includes(file.type));
      const invalidFiles = files.filter(
        (file) => !validTypes.includes(file.type)
      );
      if (invalidFiles.length) {
        alert(`仅支持 pdf 格式的文件`);
      }
      return validFiles;
    },

    handleDrop(e) {
      e.preventDefault();
      // this.files.push(e.dataTransfer.files[0]);
      const validatedFile = this.validateFiles(
        Array.from(e.dataTransfer.files)
      );
      if (validatedFile.length) {
        this.files = [...this.files, ...validatedFile];
      }

      validatedFile.forEach((file) => {
        this.uploadFile(file);
      });
    },

    handleDropSkipFile(e) {
      e.preventDefault();
      // this.files.push(e.dataTransfer.files[0]);
      const validatedFile = this.validateFiles(
        Array.from(e.dataTransfer.files)
      );
      if (validatedFile.length) {
        this.skipFile = validatedFile[0];
      }
      if (this.skipFile) {
        this.uploadSkipFile();
      }
    },

    handleFile(e) {
      // this.files.push(e.target.files[0]);
      const validatedFile = this.validateFiles(Array.from(e.target.files));
      if (validatedFile.length) {
        this.files = [...this.files, ...validatedFile];
      }
      validatedFile.forEach((file) => {
        this.uploadFile(file);
      });
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    deleteFile(index) {
      this.files.splice(index, 1);
    },

    async uploadFile(file) {
      const formData = new FormData();
      formData.append("file", file, encodeURIComponent(file.name));
      file.state = "上传中";
      this.files = [...this.files];
      try {
        const res = await uploadFile(formData, (percent) => {
          console.log(file.name, percent)
        });

        file.state = "上传成功";
        file.fileId = res.data._id;
      } catch (error) {
        file.state = "上传失败";
      }
      this.files = [...this.files];
    },

    async uploadSkipFile() {
      const formData = new FormData();
      formData.append("file", this.skipFile, encodeURIComponent(this.skipFile.name));
      this.skipFile.state = "上传中";
      try {
        const res = await uploadFile(formData, (percent) => {
          console.log(this.skipFile.name, percent)
        });
        this.skipFile.state = "上传成功";
        this.skipFile.fileId = res.data._id;

        this.skipFile = {
          ...this.skipFile,
          name: this.skipFile.name,
          state: "上传成功",
          fileId: res.data._id,
        };

      } catch (error) {
        this.skipFile = {
          ...this.skipFile,
          name: this.skipFile.name,
          state: "上传失败",
        };
      }

    },

    deleteSkipFile() {
      this.skipFile = null;
    },

    async handleCompire() {

      if (this.files.length < 2) {
        alert("请至少上传两个文件");
        return;
      }

      // this.isCompire = true;
      // this.$message(`开始对比，生成结果需要一段时间，请耐心等待....`)

      // const fileIds = this.files.map((file) => file.fileId);

      const taskList = [];

      try {
        for (let i = 0; i < this.files.length; i++) {
          for (let j = 0; j < this.files.length; j++) {
            if (i === j) {
              continue;
            }
            taskList.push({
              biddingFileId: this.files[i].fileId,
              targetFileId: this.files[j].fileId,
              skipFileId: this.skipFile && this.skipFile.fileId,
              biddingFileName: this.files[i].name,
              targetFileName: this.files[j].name,
              mode: this.mode,
            })
          }
        }

        const res = await createBatchDuplicate(taskList)
        console.log('createBatchDuplicate res', res)

        setInterval(async () => {
          const taskRes = await getCurrentTasks()
          console.log('当前运行', taskRes.data.running.map(item => item.name).join('、'))
          console.log('排队中', taskRes.data.queue.map(item => item.name).join('、'))
        }, 100);

        // this.isCompire = false
        // this.handleGenerateReport()
      } catch (error) {
        console.log(error);
        this.isCompire = false
        this.$message.error('对比失败请打开调试控制台查看具体报错信息')
      }
    },

    async handleGenerateReport() {
      // const res = await axios.post(`${API_BASE_URL}/duplicate/create-report`, {
      //   results: this.compireResults.map((result) => result._id),
      // });
      // console.log("handleGenerateReport", res.data.data);

      const res = await createReport(this.compireResults.map((result) => result._id));

      console.log('createReport res', res)

      this.$router.push({
        path: "/report-detail",
        query: { id: res.data._id, mode: "edit" },
      });
    },

    async execCompire(biddingFileId, targetFileId, skipFileId) {

      const requestOptions = {
        biddingFileId,
        targetFileId,
        mode: this.mode,
      }

      if (skipFileId) {
        requestOptions.skipFileId = skipFileId
      }

      console.log("execCompire", requestOptions);
      const res = await execDuplicate(requestOptions);
      return res.data;
    },
  },
};
</script>

<style scoped>
#file-upload {
  background: #fff;
  border-radius: 8px;
  /* padding: 0 24px; */
  /* box-sizing: content-box; */
  margin: 24px;
  height: calc(100vh - 100px);
  color: #666666;

  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  position: relative;
  /* width: 100%; */
  box-sizing: border-box;
}

.file-upload-tab {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 45px;
  padding: 0;

  border-bottom: 1px solid #e6e6e6;
  width: 100%;
}

.file-upload-tab-item {
  width: 120px;
  height: 45px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 20px;
}

/* active */
.file-upload-tab-item.active {
  color: #007bff;
  position: relative;
}

.file-upload-tab-item.active::after {
  position: absolute;
  content: "";
  display: block;
  width: 100%;
  height: 2px;
  background: #007bff;
  margin-top: 5px;
  bottom: 0;
}

#file-upload .main-content {
  padding: 24px 24px;
  margin: 0 24px;
  flex-grow: 1;
  overflow-y: auto;
  box-sizing: content-box;
  width: calc(100% - 48px);
}

.file-upload-header {
  font-size: 16px;
  font-weight: 400;
  color: #333333;
  line-height: 22px;
  margin-bottom: 10px;
  font-weight: bolder;
}

.file-upload-desc {
  margin-bottom: 20px;
}


.file-list {
  margin-bottom: 24px;
}

.file-list .file-item {
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-bottom: 8px;
}

.file-list .file-item .file-name {
  flex-grow: 1;
}

.file-list .file-item .file-content {
  margin: 0 10px;
  width: 80px;
  flex-shrink: 0;
}

.compire-result-item {
  border: 1px solid #e6e6e6;
  margin-top: 10px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.drop-zone {
  display: flex;
  /* flex-direction: column; */
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 110px;
  background: rgba(11, 104, 218, 0.04);
  border-radius: 4px;
  cursor: pointer;
  border: 1px dashed #0b68da;
  margin-bottom: 20px;
  /* background-color: #ccc; */
}

.upload-box {
  /* margin: 0 auto; */
  border-radius: 2px;
  width: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.unUploaded-container {
  flex-grow: 1;
  padding-right: 24px;
}

.origin-file {
  width: inherit;
  height: inherit;
  margin-left: 0;
  margin-top: 0;
  display: flex;
  justify-content: center;
  vertical-align: middle;
}
.select-file-text {
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  font-size: 16px;
  color: #0f87ff;
  line-height: 24px;
  font-weight: 400;
}

.file-restriction {
  margin-top: 8px;
  /* padding: 0 24px; */
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  font-size: 13px;
  color: #909499;
  letter-spacing: 0;

  line-height: 20px;
  font-weight: 400;
}

.buttons-wrap {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  border-top: 1px solid #e6e6e6;
}
.buttons-wrap .el-button {
  width: 100px;
  height: 34px;
  border-radius: 4px;
  font-size: 16px;
  line-height: 1;
  color: #fff;
  text-align: center;
  font-weight: 400;
  cursor: pointer;
  padding: 0;
}

.compare {
  margin-right: 20px;
}

.compare,
.repert {
  border: none;
  bottom: 0px;
  background: #007bff;
  width: 160px;
  height: 40px;
  border-radius: 4px;
  font-size: 16px;
  color: #fff;
  text-align: center;
  line-height: 21px;
  font-weight: 400;
  cursor: pointer;
}

.compire-loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0, 0.34);
  color: #fff;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
}
</style>
