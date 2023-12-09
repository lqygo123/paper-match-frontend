<template>
  <div id="login-page">
    <form @submit.prevent="handleSubmit">
      <label>
        用户名:
        <input v-model="username" type="text" required>
      </label>
      <label>
        密码:
        <input v-model="password" type="password" required>
      </label>
      <button type="submit">登录</button>
    </form>
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
}
</style>