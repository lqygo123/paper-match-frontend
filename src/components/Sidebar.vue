
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
      <el-menu-item index="/report-list">
        <i class="el-icon-tickets"></i>
        <span>查看报告</span>
        <!-- <router-link to="/report-list"></router-link> -->
      </el-menu-item>
      <el-menu-item index="logout">
        <i class="el-icon-switch-button"></i>
        <span>退出登录</span>
        <!-- <router-link to="/report-list"></router-link> -->
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue';
import { deleteToken } from "../apis";

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
  methods: {
    handleSelect(key) {



      this.activeIndex = key;

      if (key === 'logout') {
        this.logout()
        this.$router.push(
          "/login"
        );
        return
      }

      this.$router.push(
        key
      );
    },

    logout() {
      deleteToken()
      // this.$router.push(
      //   "/login",
      //   () => {},
      //   () => {}
      // );
    },
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
  border-bottom: 1px solid #dcdfe6;
}
::v-deep .el-menu-item.is-active {
  color: #007bff;
}
</style>
