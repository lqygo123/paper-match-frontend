<template>
  <div class="task-list-page">
    <div class="task-list-header">比对中任务</div>
    
  </div>
</template>

<script>

export default {
  name: 'TaskList',
  components: {},
  data() {
    return {
      aaa: 123
    };
  },
  mounted() {

  },
  methods: {
    aa() {
      console.log("aa");
    },
  }
};
</script>

<style>
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