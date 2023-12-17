<template>
  <div class="task-list-page">
    <div class="task-list-header">查重进度</div>
    <div class="task-list">
      <div class="task-list-item bold" v-if="groupedList.length">
        <div class="task-list-item-name">项目名称</div>
        <div class="task-list-item">创建者</div>
        <div class="task-list-item">比对状态</div>
        <div class="task-list-item">上传时间</div>
      </div>
      <div class="no-task" v-else>
        暂无任务
      </div>

      <div class="task-list-item" v-for="batchItem in groupedList" :key="batchItem.batchId + Math.random()">
        <div class="task-list-item-name">{{ batchItem.projectName }}</div>
        <div class="task-list-item">{{ batchItem.creator.role === 'admin' ? '管理员' : batchItem.creator.name || '-' }}</div>
        <div class="task-list-item">{{ batchItem.total - batchItem.waitting - batchItem.running }}/{{ batchItem.total }}</div>
        <div class="task-list-item">{{ batchItem.createAt }}</div>
      </div>

      <!-- <div class="task-list-item" v-for="task in runningTaskList" :key="task.id">
        <div class="task-list-item-state green">对比中</div>
        <div class="task-list-item-file">{{ task.reportMetaInfo.projectName }}</div>
      </div>
      <div class="task-list-item" v-for="task in waitingTaskList" :key="task.id">
        <div class="task-list-item-state">等待中</div>
        <div class="task-list-item-file">{{ task.reportMetaInfo.projectName }}</div>
      </div> -->
    </div>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue';
import { getCurrentTasks } from '../apis';
import { formateTime } from '../utils'

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
    //   "batchId": "batch-1702735935512mv292u7xo6"
    //   "taskId": "1702695389228ct5wqeb4z7q",
    //   "name": "ocr 测试文档3.pdf 比对 ocr 测试文档1.pdf",
    //   "batchTotal": 6,
    //   "reportMetaInfo": {
    //       "projectName": "zxc",
    //       "biddingNumber": "",
    //       "biddingCompany": "",
    //       "participatingCompany": "",
    //       "time": ""
    //   },
    //   "createAt": 1702695389228,
    //   "isRunning": true
    // }
      runningTaskList: [],
      waitingTaskList: [],


//    {
//     "projectName": "czscsc",
//     "biddingNumber": "",
//     "biddingCompany": "",
//     "participatingCompany": "",
//     "time": "",
//     "createAt": 1702740559836,
//     "total": 12,
//     "waitting": 10,
//     "running": 1,
//     "creator": {
//         "role": "admin"
//     },
//      "batchId": "batch-1702740559836fwadrdna2wi"
//      }
      groupedList: [],
    };
  },
  created() {
    this.getTaskList();
    this.updateListIntervalId = setInterval(() => {
      this.getTaskList();
    }, 1000);

    // this.groupedList = [
    //   {
    //     projectName: '项目1',
    //     biddingNumber: '123',
    //     biddingCompany: '123',
    //     participatingCompany: '123',
    //     time: '123',
    //     createAt: formateTime(1702740559836),
    //     total: 12,
    //     waitting: 10,
    //     running: 1,
    //     creator: {
    //       role: 'admin',
    //     },
    //     batchId: 'batch-1702740559836fwadrdna2wi',
    //   },
    //   {
    //     projectName: '项目2',
    //     biddingNumber: '123',
    //     biddingCompany: '123',
    //     participatingCompany: '123',
    //     time: '123',
    //     createAt: formateTime(1702740559836),
    //     total: 12,
    //     waitting: 10,
    //     running: 1,
    //     creator: {
    //       role: 'admin',
    //     },
    //     batchId: 'batch-1702740559836fwadrdna2wi',
    //   },
    //   {
    //     projectName: '项目3',
    //     biddingNumber: '123',
    //     biddingCompany: '123',
    //     participatingCompany: '123',
    //     time: '123',
    //     createAt: formateTime(1702740559836),
    //     total: 12,
    //     waitting: 10,
    //     running: 1,
    //     creator: {
    //       role: 'admin',
    //     },
    //     batchId: 'batch-1702740559836fwadrdna2wi',
    //   },
    //   {
    //     projectName: '项目4',
    //     biddingNumber: '123',
    //     biddingCompany: '123',
    //     participatingCompany: '123',
    //     time: '123',
    //     createAt: formateTime(1702740559836),
    //     total: 12,
    //     waitting: 10,
    //     running: 1,
    //     creator: {
    //       role: 'admin',
    //     },
    //     batchId: 'batch-1702740559836fwadrdna2wi',
    //   },
    //   {
    //     projectName: '项目5',
    //     biddingNumber: '123',
    //     biddingCompany: '123',
    //     participatingCompany: '123',
    //     time: '123',
    //     createAt: formateTime(1702740559836),
    //     total: 12,
    //     waitting: 10,
    //     running: 1,
    //     creator: {
    //       role: 'admin',
    //     },
    //     batchId: 'batch-1702740559836fwadrdna2wi',
    //   }]
  },
  destroyed() {
    clearInterval(this.updateListIntervalId);
  },
  methods: {
    async getTaskList() {
      const res = await getCurrentTasks();
      this.runningTaskList = res.data.running;
      this.waitingTaskList = res.data.queue;

      const groupedTask = {}
      this.runningTaskList.forEach((task) => {
        const batchId = task.batchId;
        if (!groupedTask[batchId]) {
          groupedTask[batchId] = {
            ...task.reportMetaInfo,
            createAt: formateTime(task.createAt),
            total: task.batchTotal,
            waitting: 0,
            running: 0,
            creator: task.creator,
          };
          groupedTask[batchId].running += 1;
        }
      });
      this.waitingTaskList.forEach((task) => {
        const batchId = task.batchId;
        if (!groupedTask[batchId]) {
          groupedTask[batchId] = {
            ...task.reportMetaInfo,
            createAt: formateTime(task.createAt),
            total: task.batchTotal,
            waitting: 0,
            running: 0,
            creator: task.creator,
          };
        }
        groupedTask[batchId].waitting += 1;
      });

      this.groupedList = Object.keys(groupedTask).map((key) => {
        return {
          ...groupedTask[key],
          batchId: key,
        };
      });

      console.log('groupedList', this.groupedList);
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
  font-weight: bold;

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
  justify-content: space-around;
  height: 40px;
  margin-bottom: 10px;
}

.task-list-item.bold {
  font-weight: bold;
}

.task-list-item-name {
  text-align: center;
  flex-grow: 1;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}

.task-list-item {
  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: 20%;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;

}

/* .task-list-item-creator {
  flex-basis: 30%;
  flex-shrink: 0;
  text-align: center;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
} */

/* .task-list-item-process {
  flex-basis: 30%;
  flex-shrink: 0;
  text-align: center;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
} */

.task-list-item-state {
  flex-basis: 20%;
  flex-shrink: 0;
  text-align: center;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
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