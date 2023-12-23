<template>
  <div class="user-admin">
    <div class="user-admin-header">用户管理</div>
    <div class="user-list">
      <div class="user-item" v-for="(user, index) in users" :key="index">
        <el-checkbox class="check-box" v-model="user.checked"></el-checkbox>
        <div class="user-item-content">
          <div class="edit" v-if="user.isEdit">
            <el-input
              v-model="users[index].name"
              type="text"
              placeholder="请输入姓名"
            >
              <i slot="prefix" class="el-input__icon el-icon-user"></i>
            </el-input>
          </div>
          <div class="desc" v-else>姓名: {{ user.name }}</div>
        </div>
        <div class="user-item-content">
          <div class="edit" v-if="user.isEdit">
            <el-input
              v-model="users[index].username"
              type="text"
              placeholder="请输入登录账号"
            >
              <i slot="prefix" class="el-input__icon el-icon-user"></i>
            </el-input>
          </div>
          <div class="desc" v-else>登录账号: {{ user.username }}</div>
        </div>
        <div class="user-item-content">
          <div class="edit" v-if="user.isEdit">
            <el-input
              v-model="users[index].password"
              type="text"
              placeholder="请输入密码"
            >
              <i slot="prefix" class="el-input__icon el-icon-lock"></i>
            </el-input>
          </div>
          <div class="desc" v-else>密码: {{ user.password }}</div>
        </div>
        <div class="user-item-content-small">
          <div class="edit" v-if="user.isEdit">
            <el-checkbox v-model="users[index].enabled">授权</el-checkbox>
          </div>
          <div class="desc" :class="user.enabled ? 'green' : 'red'" v-else>
            {{ user.enabled ? '已授权' : '未授权' }}
          </div>
        </div>
        <div class="user-item-content-small">
          <el-button
            v-if="!user.isEdit"
            @click="user.isEdit = true"
            type="primary"
            size="small"
          >
            编辑
          </el-button>
          <el-button
            v-if="user.isEdit"
            @click="user.isEdit = false"
            type="primary"
            size="small"
          >
            取消
          </el-button>
          <el-button
            v-if="user.isEdit"
            @click="updateUser(user)"
            type="primary"
            size="small"
          >
            保存
          </el-button>
        </div>
      </div>
    </div>
    <div class="user-admin-bottom">
      <el-button type="primary" size="small" @click="handleEnableMuti">{{
        isAllCheckedUserEnabled ? '取消授权选中账号' : '授权选中账号'
      }}</el-button>
    </div>
  </div>
</template>

<script>
// import { getUsers, updateUser } from "../apis";
import { getUsers, updateUser } from '../apis'

export default {
  name: 'UserAdmin',
  components: {},
  data() {
    return {
      users: [],
    }
  },

  computed: {
    checkedUsers() {
      return this.users.filter((item) => item.checked)
    },
    isAllCheckedUserEnabled() {
      return (
        this.checkedUsers.length > 0 &&
        this.checkedUsers.every((item) => item.enabled)
      )
    },
  },

  async mounted() {
    this.init()
  },
  methods: {
    async init() {
      this.users = []
      const res = await getUsers()
      this.users = res.data.map((item) => {
        return {
          ...item,
          isEdit: false,
          checked: false,
        }
      })
    },
    async updateUser(userInfo) {
      const payload = {
        enabled: userInfo.enabled,
        name: userInfo.name,
        password: userInfo.password,
        username: userInfo.username,
      }
      const res = await updateUser(userInfo._id, payload)
      if (res.code === 0) {
        this.$message.success('更新成功')
      } else {
        this.$message.error(res.message)
      }
      userInfo.isEdit = false
    },
    async handleEnableMuti() {
      const payload = {
        enabled: !this.isAllCheckedUserEnabled,
      }
      const promises = this.checkedUsers.map((item) => {
        return updateUser(item._id, payload)
      })
      const res = await Promise.all(promises)
      if (res.every((item) => item.code === 0)) {
        this.$message.success('更新成功')
      } else {
        this.$message.error('更新失败')
      }
      this.init()
    },
  },
}
</script>

<style scoped>
.user-admin {
  background: #fff;
  border-radius: 8px;
  padding-top: 45px;
  margin: 24px;
  height: calc(100% - 48px);
  position: relative;
}

.user-admin-header {
  height: 45px;
  width: 100%;
  border-bottom: 1px solid #e6e6e6;
  position: absolute;
  left: 0;
  top: 0;

  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.user-list {
  width: 100%;
  height: calc(100% - 60px);
  overflow: auto;
  padding: 24px;
}
.user-item {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 40px;
}

.user-item .green {
  color: #67c23a;
} 
.user-item .red {
  color: #f56c6c;
}

.check-box {
  flex-basis: 50px;
}

.user-item-content {
  flex-basis: 20%;
  flex-grow: 1;
  margin-right: 20px;
}

.user-item-content-small {
  flex-basis: 15%;
}

.user-admin-bottom {
  height: 60px;
  width: 100%;
  border-top: 1px solid #e6e6e6;
  position: absolute;
  left: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-admin-bottom .el-button {
  height: 30px;
}
</style>
