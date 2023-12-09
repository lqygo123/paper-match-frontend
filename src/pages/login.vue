<template>
  <div id="login-page">
    <div class="login-con">
      <div class="banner"></div>
      <div class="login-from">
        <div class="title">用户登录</div>
        <div class="input-con">
          <el-input v-model="username" type="text" placeholder="请输入用户名">
            <i slot="prefix" class="el-input__icon el-icon-user"></i>
          </el-input>
        </div>
        <div class="input-con">
          <el-input v-model="password" type="password" placeholder="请输入密码">
            <i slot="prefix" class="el-input__icon el-icon-lock"></i>
          </el-input>
        </div>
        <div class="btn-con">
          <el-button @click="handleSubmit" type="primary">登录</el-button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { login } from '../apis'

export default {
  name: 'LoginPage',
  data() {
    return {
      username: '',
      password: ''
    };
  },
  methods: {
    async handleSubmit() {
      try {
        await login(this.username, this.password);
        // 登录成功，跳转到主页
        this.$router.push('/file-upload');
      } catch (error) {
        // 登录失败，显示错误信息
        this.$message.error(error.message);
        console.error(error);
      }
    }
  }
};
</script>

<style>
#login-page {
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;

  /* asset login-background.png */
  background: url('../assets/login-background.png') no-repeat center center;
  background-color: #F6F8FA;
}
#login-page .login-con {
  width: 1000px;
  height: 600px;
  border-radius: 10px;
  background: #FFFFFF;
  box-shadow: 0px 4px 10px 0px rgba(35, 115, 210, 0.1);

  display: flex;
  position: relative;
}
#login-page .login-con .banner {
  width: 50%;
  height: 100%;
  background: url('../assets/login-banner.png') no-repeat center center;
}
#login-page .login-con .login-from {
  width: 50%;
  height: 100%;
  padding: 0 100px;
  box-sizing: border-box;

  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
}
#login-page .login-con .login-from .title {
  font-size: 24px;
  color: #333333;
  font-weight: bold;
  margin-bottom: 40px;
  padding-top: 70px;
}
#login-page .login-con .login-from .input-con {
  margin-bottom: 20px;
}
#login-page .login-con .login-from .input-con {
  width: 100%;
}
#login-page .login-con .login-from .btn-con {
  margin-top: 40px;
  width: 100%;
}
#login-page .login-con .login-from .btn-con .el-button {
  margin-top: 100px;
  width: 100%;
}

</style>