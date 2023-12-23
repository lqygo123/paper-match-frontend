<template>
  <div class="user-admin">
    <div class="user-admin-header">用户管理</div>
    <div class="user-list">
      <el-table :data="users"  style="width: 100%" @selection-change="handleSeletionChange">
        <el-table-column type="selection" align="center" width="55"></el-table-column>
        <el-table-column prop="name" align="center" label="姓名">
          <template slot-scope="scope">
            <div v-if="scope.row.isEdit">
              <el-input
                v-model="scope.row.name"
                type="text"
                placeholder="请输入姓名"
              >
                <i slot="prefix" class="el-input__icon el-icon-user"></i>
              </el-input>
            </div>
            <div v-else>{{ scope.row.name }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="username" align="center" label="登录账号">
          <template slot-scope="scope">
            <div v-if="scope.row.isEdit">
              <el-input
                v-model="scope.row.username"
                type="text"
                placeholder="请输入登录账号"
              >
                <i slot="prefix" class="el-input__icon el-icon-user"></i>
              </el-input>
            </div>
            <div v-else>{{ scope.row.username }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="password" align="center" label="密码">
          <template slot-scope="scope">
            <div v-if="scope.row.isEdit">
              <el-input
                v-model="scope.row.password"
                type="text"
                placeholder="请输入密码"
              >
                <i slot="prefix" class="el-input__icon el-icon-lock"></i>
              </el-input>
            </div>
            <div v-else>{{ scope.row.password }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="enabled" align="center" label="授权">
          <template slot-scope="scope">
            <div :class="scope.row.enabled ? 'accredit green' : 'accredit red'">
              {{ scope.row.enabled ? '已授权' : '未授权' }}
            </div>
          </template>
        </el-table-column>
        <!-- 编辑 -->
        <el-table-column label="操作" align="center" >
          <template slot-scope="scope">
            <el-button
              v-if="!scope.row.isEdit"
              @click="scope.row.isEdit = true"
              type="text"
              size="small"
            >
              编辑
            </el-button>
            <el-button
              v-if="scope.row.isEdit"
              @click="scope.row.isEdit = false"
              type="text"
              size="small"
            >
              取消
            </el-button>
            <el-button
              v-if="scope.row.isEdit"
              @click="updateUser(scope.row)"
              type="text"
              size="small"
            >
              保存
            </el-button>
          </template>
        </el-table-column>
      </el-table>
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
    handleSeletionChange(val) {
      console.log(val)
      this.users.forEach((item) => {
        item.checked = val.includes(item)
      })
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

.center-text {
    text-align: center;
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

.accredit::before {
  content: '';
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 5px;
}

.accredit.green::before {
  background-color: #67c23a;

} 
.accredit.red::before {
  background-color: #f56c6c;
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
