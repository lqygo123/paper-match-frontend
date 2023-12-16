<template>
  <div class="task-list-page">
    <div class="task-list-header">查重进度</div>
    <div class="task-list">
      <div class="task-list-item" v-if="runningTaskList.length || waitingTaskList.length">
        <div class="task-list-item-state">状态</div>
        <div class="task-list-item-file">项目名称</div>
        <!-- <div class="task-list-item-file">比对文件</div> -->
      </div>
      <div class="no-task" v-else>
        暂无任务
      </div>
      <div class="task-list-item" v-for="task in runningTaskList" :key="task.id">
        <div class="task-list-item-state green">对比中</div>
        <div class="task-list-item-file">{{ task.reportMetaInfo.projectName }}</div>
      </div>
      <div class="task-list-item" v-for="task in waitingTaskList" :key="task.id">
        <div class="task-list-item-state">等待中</div>
        <div class="task-list-item-file">{{ task.reportMetaInfo.projectName }}</div>
      </div>
    </div>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue';
import { getCurrentTasks } from '../apis';

export default {
  name: 'TaskList',
  components: {
    // HelloWorld,
  },
  data() {
    return {
      updateListIntervalId: null,

    // task item
    // {
    //   "taskId": "1702695389228ct5wqeb4z7q",
    //   "name": "ocr 测试文档3.pdf 比对 ocr 测试文档1.pdf",
    //   "reportMetaInfo": {
    //       "projectName": "zxc",
    //       "biddingNumber": "",
    //       "biddingCompany": "",
    //       "participatingCompany": "",
    //       "time": ""
    //   },
    //   "createAt": 1702695389228,
    //   "biddingFileId": "657d11dadb83b81ae519c42e",
    //   "targetFileId": "657d11dadb83b81ae519c42c",
    //   "skipFileId": null,
    //   "biddingFileName": "ocr 测试文档3.pdf",
    //   "targetFileName": "ocr 测试文档1.pdf",
    //   "mode": "digital",
    //   "isRunning": true
    // }

      runningTaskList: [],
      waitingTaskList: [],
    };
  },
  created() {
    this.getTaskList();
    this.updateListIntervalId = setInterval(() => {
      this.getTaskList();
    }, 1000);
  },
  destroyed() {
    clearInterval(this.updateListIntervalId);
  },
  methods: {
    async getTaskList() {
      const res = await getCurrentTasks();
      this.runningTaskList = res.data.running;
      this.waitingTaskList = res.data.queue;

      console.log('runningTaskList', this.runningTaskList);

      // const item = {
      //   "taskId": "1702695389228ct5wqeb4z7q",
      //   "name": "ocr 测试文档3.pdf 比对 ocr 测试文档1.pdf",
      //   "reportMetaInfo": {
      //       "projectName": "zxc",
      //       "biddingNumber": "",
      //       "biddingCompany": "",
      //       "participatingCompany": "",
      //       "time": ""
      //   },
      //   "createAt": 1702695389228,
      //   "biddingFileId": "657d11dadb83b81ae519c42e",
      //   "targetFileId": "657d11dadb83b81ae519c42c",
      //   "skipFileId": null,
      //   "biddingFileName": "ocr 测试文档3.pdf",
      //   "targetFileName": "ocr 测试文档1.pdf",
      //   "mode": "digital",
      //   "isRunning": true
      // }

      // this.runningTaskList = [item, item]
      // this.waitingTaskList = [item, item, item, item, item, item, item, item, item, item, item, item, item, item, item, item, item, item, item, item, item, item, item, item, item, item, item, item, item, item, item, item, item, item, item, item, item, item, item, item]
    }
  }
};
</script>

<style scoped>
.task-list-page {
  background: #fff;
  border-radius: 8px;
  padding-top: 45px;
  margin: 24px;
  height: calc(100% - 48px);
  position: relative;
}

.task-list-header {
  height: 45px;
  width: 100%;
  border-bottom: 1px solid #e6e6e6;
  position: absolute;
  left: 0;
  top: 0;

  display: flex;
  align-items: center;
  justify-content: center;
}

.task-list {
  height: calc(100% - 45px);
  width: 100%;
  overflow-y: auto;
  position: absolute;
  left: 0;
  top: 45px;
  padding: 24px;
}

.task-list-item {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 40px;
  margin-bottom: 10px;
}

.task-list-item:last-child {
  margin-bottom: 0;
}

.task-list-item-state {
  flex-basis: 60px;
  flex-shrink: 0;
  text-align: center;
}
.task-list-item-state.green {
  color: #52c41a;
}

.no-task {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
}

.task-list-item-name {
  flex-basis: 400px;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
  text-align: center;
  flex-shrink: 0;
}

.task-list-item-file {
  flex-grow: 1;
  text-overflow:ellipsis;
  white-space: nowrap;
  text-align: center;
}

.task-list-bottom {
  height: 45px;
  width: 100%;
  border-top: 1px solid #e6e6e6;
  position: absolute;
  left: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>