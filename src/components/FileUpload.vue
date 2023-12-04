<template>
  <div id="file-upload">

    <div id="mode-switch">
      <button @click="mode = 'digital'" :class="{ active: mode === 'digital' }">digital</button>
      <button @click="mode = 'ocr'" :class="{ active: mode === 'ocr' }">OCR</button>
    </div>

    <div id="drop-zone" @drop="handleDrop" @dragover.prevent @dragenter.prevent>
      拖拽文件到这里上传
    </div>
    <input type="file" @change="handleFile" ref="fileInput" style="display: none" />
    <button @click="triggerFileInput">选择文件</button>
    <div class="file-list">
      文件列表
      <div v-for="(file, index) in files" :key="index">
        {{ file.name }}
        <button @click="deleteFile(index)">删除</button> 
        {{ file.state }}
      </div>
    </div>
    <button @click="handleCompire">执行对比</button>
    <button @click="handleGenerateReport">生成报告</button>

    <div class="compire-results">
      <div class="compire-result-item" v-for="(result, index) in compireResults" :key="index">
        <div>对比结果</div>
        <div>文件1: {{ decodeURIComponent(result.biddingFileName)  }}</div>
        <div>文件2: {{ decodeURIComponent(result.targetFileName) }}</div>
        <div>相似度: {{ Math.random() }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { BASE_URL } from '../../config';

export default {
  name: 'FileUpload',
  data() {
    return {
      mode: 'digital', // digital | ocr
      files: [],
      compireResults: [],
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
        'application/pdf',
        // 'application/zip',
        // 'application/msword',
        // 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        // 'application/x-zip-compressed',
        // 'application/x-rar-compressed',
      ];
      console.log(files)
      const validFiles = files.filter(file => validTypes.includes(file.type));
      const invalidFiles = files.filter(file => !validTypes.includes(file.type));
      if (invalidFiles.length) {
        alert(`仅支持 pdf 格式的文件`);
      }
      return validFiles;
    },

    handleDrop(e) {
      e.preventDefault();
      // this.files.push(e.dataTransfer.files[0]);
      const validatedFile = this.validateFiles(Array.from(e.dataTransfer.files));
      if (validatedFile.length) {
        this.files = [...this.files, ...validatedFile]
      }

      validatedFile.forEach(file => {
        this.uploadFile(file);
      });
    },
    handleFile(e) {
      // this.files.push(e.target.files[0]);
      const validatedFile = this.validateFiles(Array.from(e.target.files));
      if (validatedFile.length) {
        this.files = [...this.files, ...validatedFile]
      }
      validatedFile.forEach(file => {
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
      formData.append('file', file, encodeURIComponent(file.name));
      file.state = '上传中';
      this.files = [...this.files]
      try {
        const res = await axios.post(`${BASE_URL}/file/upload`, formData);
        if (res.status !== 200) {
          throw new Error('上传失败');
        }
        const fileId = res.data.data._id;
        file.state = '上传成功';
        file.fileId = fileId;
      } catch (error) {
        file.state = '上传失败';
      }
      this.files = [...this.files]
    },

    async handleCompire() {
      const fileIds = this.files.map(file => file.fileId);

      // 执行多次对比，对于每个文件，都和剩下的文件进行对比, 两两对比，需要重复 A 和 B 对比，B 和 A 对比, 但不需要和自己对比
      for (let i = 0; i < fileIds.length; i++) {
        for (let j = 0; j < fileIds.length; j++) {
          if (i === j) {
            continue;
          }
          const res = await this.execCompire(fileIds[i], fileIds[j]);
          this.compireResults.push(res);
        }
      }
    },

    async handleGenerateReport() {
      const res = await axios.post(`${BASE_URL}/duplicate/create-report`, {
        results: this.compireResults.map(result => result._id),
      });
      console.log('handleGenerateReport', res.data.data)
      this.$router.push({ path: '/report-detail', query: { id: res.data.data._id, mode: 'edit' } })
    },

    async execCompire(biddingFileId, targetFileId) {
      const res = await axios.post(`${BASE_URL}/duplicate/exec-duplicate`, {
        biddingFileId,
        targetFileId,
        mode: this.mode,
      });

      console.log('execCompire', res.data)

      return res.data.data
    },
  },
};
</script>

<style scoped>
#drop-zone {
  height: 300px;
  width: 100%px;
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ccc;
}
.active {
  background-color: #ddd;
}

.file-list {
  border: 1px solid #e6e6e6;
}

.compire-result-item {
  border: 1px solid #e6e6e6;
  margin-top: 10px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>