
<template>
  <div id="sidebar">
    <el-menu
      :default-active="activeIndex"
      class="el-menu-vertical-demo"
      @select="handleSelect"
    >
      <el-menu-item index="/file-upload">
        <template slot="title">
          <i class="el-icon-folder"></i>
          <span>标书查重 </span>
        </template>
      </el-menu-item>
      <el-menu-item index="/task-list">
        <i class="el-icon-odometer"></i>
        <span>查重进度</span>
      </el-menu-item>
      <el-menu-item index="/report-list">
        <i class="el-icon-tickets"></i>
        <span>查看报告</span>
      </el-menu-item>
      <el-menu-item v-if="$store.role === 'admin'" index="/user-admin">
        <i class="el-icon-user"></i>
        <span>用户管理</span>
      </el-menu-item>
      <div @click="handleLogout" class="el-menu-item bottom" >
        <i class="el-icon-switch-button"></i>
        <span>退出登录</span>
      </div>
    </el-menu>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue';
import { logout } from "../apis";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Sidebar",
  components: {
    // HelloWorld,
  },
  data() {
    return {
      activeIndex: "/file-upload",
    };
  },
  mounted() {

  },
  watch: {
    $route(to) {
      this.activeIndex = to.path;
    },
  },
  methods: {
    handleLogout() {
      this.$confirm("确认退出登录吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
      .then(() => {
        logout();
        this.$router.push("/login");
      })

    },
    handleSelect(key) {
      this.activeIndex = key;
      this.$router.push(
        key
      );
    }
  },
};
</script>

<style scoped>
#sidebar {
  background: #fff;
  height: 100%;
  width: 200px;
  flex: 0 0 200px;
  padding: 0 10px;
}
::v-deep .el-menu {
  border-right: 0;
}
::v-deep .el-menu-item {
  border-bottom: 1px solid #eeeeee;
}
::v-deep .el-menu-item.is-active {
  color: #007bff;
}

.el-menu-vertical-demo.el-menu {
  height: 100%;
  position: relative;
}
.bottom {
  position: absolute;
  bottom: 0;
  width: 100%;
}
</style>
