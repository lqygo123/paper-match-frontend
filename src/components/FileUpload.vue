<template>
  <div id="file-upload">
    <div id="mode-switch" class="tab">
      <div @click="mode = 'digital'" :class="{ active: mode === 'digital' }">
        <span>文件对比</span>
        <div class="tab_line"></div>
      </div>
      <div @click="mode = 'ocr'" :class="{ active: mode === 'ocr' }">
        <span>扫描件对比</span>
        <div class="tab_line"></div>
      </div>
    </div>

    <div class="drop_wrap">
      <div
        id="drop-zone"
        class="drap"
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
          <div class="select-file-text left-select">投标书文件到这里（用于比对查重）</div>
          <div class="file-restriction">
            格式支持：单份50M以内word、pdf、ppt、txt、扫描件文档进行比对
            页数文档：电子文档500页，扫描件300页
          </div>
        </div>
      </div>
      <div
        id="drop-zone"
        class="drap"
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
          <div class="select-file-text left-select">招标文件放这里（用于排除部分结果）</div>
          <div class="file-restriction">
            格式支持：单份50M以内word、pdf、ppt、txt、扫描件文档进行比对
            页数文档：电子文档500页，扫描件300页
          </div>
        </div>
      </div>
    </div>
    <input
      type="file"
      @change="handleFile"
      ref="fileInput"
      style="display: none"
    />
    <!-- <button @click="triggerFileInput">选择文件</button> -->
    <div v-if="files.length || skipFile" class="file-list">
      <div class="file-item" v-for="(file, index) in files" :key="index">
        <div class="file-content"> 投标文件 </div>
        <div class="file-name">{{ file.name }}</div> 
        <div class="file-content">{{ file.state }}</div>
        <div class="file-content"> <el-button @click="deleteFile(index)">删除</el-button></div>
      </div>

      <div class="file-item" v-if="skipFile">
        <div class="file-content"> 招标文件 </div>
        <div class="file-name">{{ skipFile.name }}</div> 
        <div class="file-content">{{ skipFile.state }}</div>
        <div class="file-content"> <el-button @click="deleteSkipFile()">删除</el-button></div>
      </div>
      
    </div>
    <div class="progress">
      <el-progress :percentage="progress" color="#007bff"></el-progress>
    </div>
    <div class="buttons">
      <button class="compare" @click="handleCompire">执行对比</button>
      <!-- <button class="repert" @click="handleGenerateReport">生成报告</button> -->
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
// import axios from "axios";
// import { API_BASE_URL } from "../../config";
import { uploadFile, createReport, execDuplicate } from "../apis";

export default {
  name: "FileUpload",
  data() {
    return {
      mode: "digital", // digital | ocr
      files: [],
      skipFile: null,
      compireResults: [],
      progress: 20,
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
        // const res = await axios.post(`${API_BASE_URL}/file/upload`, formData);
        // if (res.status !== 200) {
        //   throw new Error("上传失败");
        // }
        // const fileId = res.data.data._id;

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
        // const res = await axios.post(`${API_BASE_URL}/file/upload`, formData);
        // if (res.status !== 200) {
        //   throw new Error("上传失败");
        // }
        // const fileId = res.data.data._id;
        // this.skipFile.state = "上传成功";
        // this.skipFile.fileId = fileId;

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
        // this.skipFile.state = "上传失败";
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

      const loading = this.$loading({
        lock: true,
        text: '比对执行中，请耐心等待',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      const fileIds = this.files.map((file) => file.fileId);
      try {
        for (let i = 0; i < fileIds.length; i++) {
          for (let j = 0; j < fileIds.length; j++) {
            if (i === j) {
              continue;
            }
            const res = await this.execCompire(fileIds[i], fileIds[j], this.skipFile && this.skipFile.fileId);

            console.log('execCompire', res)
            this.compireResults.push(res);
          }
        }
        loading.close();
        this.handleGenerateReport()
      } catch (error) {
        alert('对比失败请打开调试控制台查看具体报错信息')
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

      const requestOptions =  {
        biddingFileId,
        targetFileId,
        mode: this.mode,
      }

      if (skipFileId) {
        requestOptions.skipFileId = skipFileId
      }

      // const res = await axios.post(`${API_BASE_URL}/duplicate/exec-duplicate`, requestOptions);
      // console.log("execCompire", res.data);
      console.log("execCompire", requestOptions);
      const res = await execDuplicate(requestOptions);
      return res.data;
    },
  },
};
</script>

<style scoped>
#drop-zone {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 300px;
  min-height: 264px;
  background: rgba(11, 104, 218, 0.04);
  border-radius: 4px;
  cursor: pointer;
  border: 1px dashed #0b68da;
  /* background-color: #ccc; */
}
#file-upload {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
}

.file-list {
  border: 1px dashed #0b68da;
  margin-top: 30px;
  padding: 20px;
  border-radius: 4px;
}

.file-list .file-item {
  display: flex;
  align-items: center;
  justify-content: space-around;
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
.tab {
  margin-bottom: 16px;
}
.tab > div {
  display: inline-block;
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  line-height: 22px;
  height: 28px;
  margin-right: 16px;
  cursor: pointer;
}
.tab > div .tab_line {
  width: 100%;
  height: 2px;
  margin-top: 6px;
}
.tab > div.active .tab_line {
  background: #007bff;
}
.tab > div.active span {
  color: #007bff;
}
.upload-box {
  margin: 0 auto;
  border-radius: 2px;
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
.unUploaded-container {
  text-align: center;
}
.select-file-text {
  margin-top: 20px;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  font-size: 16px;
  color: #0f87ff;
  text-align: center;
  line-height: 24px;
  font-weight: 400;
}
.file-restriction {
  margin-top: 8px;
  padding: 0 24px;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  font-size: 13px;
  color: #909499;
  letter-spacing: 0;
  text-align: center;
  line-height: 20px;
  font-weight: 400;
}
.buttons {
  text-align: center;
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
.progress {
  opacity: 0;
  text-align: center;
  margin: 10px 0;
}
::v-deep .el-progress {
  display: inline-block;
  width: 300px;
}
.drop_wrap {
  display: flex;
  justify-content: space-between;
}
.drop_wrap > div {
  display: inline-block;
}
.drop_wrap > div:first-child {
  margin-right: 24px;
}
</style>
