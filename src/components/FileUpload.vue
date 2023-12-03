<template>
  <div id="main-page">

    <div id="mode-switch">
      <button @click="mode = 'normal'" :class="{ active: mode === 'normal' }">Normal</button>
      <button @click="mode = 'ocr'" :class="{ active: mode === 'ocr' }">OCR</button>
    </div>

    <div id="drop-zone" @drop="handleDrop" @dragover.prevent @dragenter.prevent>
      拖拽文件到这里上传
    </div>
    <input type="file" @change="handleFile" ref="fileInput" style="display: none" />
    <button @click="triggerFileInput">选择文件</button>
    <button @click="uploadFile">上传文件</button>
    <div id="file-list">
      <div v-for="(file, index) in files" :key="index">
        {{ file.name }}
        <button @click="deleteFile(index)">删除</button>
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
      mode: 'normal', // normal | ocr
      files: [],
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
    },
    handleFile(e) {
      // this.files.push(e.target.files[0]);
      const validatedFile = this.validateFiles(Array.from(e.target.files));
      if (validatedFile.length) {
        this.files = [...this.files, ...validatedFile]
      }
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    deleteFile(index) {
      this.files.splice(index, 1);
    },
    uploadFile() {
      this.files.forEach(file => {
        const formData = new FormData();
        
        formData.append('file', file, encodeURIComponent(file.name));
        axios.post(`${BASE_URL}/file/upload`, formData);
      });
      // 上传成功提示
      alert('上传成功');
      
      this.files = [];
    },
  },
};
</script>

<style scoped>
#drop-zone {
  height: 500px;
  width: 500px;
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ccc;
}
.active {
  background-color: #ddd;
}
</style>