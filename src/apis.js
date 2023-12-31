import axios from 'axios';
import { DOMAIN } from '../config';
import { store } from './main';

const instance = axios.create({
  baseURL: DOMAIN,
  timeout: 1000 * 60 * 5,
})

const setLoginInfo = (userInfo) => { 
  console.log('setLoginInfo', userInfo)
  store.isLoggedIn = true;
  store.username = userInfo.username;
  store.role = userInfo.role;
  store.token = userInfo.token;
  localStorage.setItem('loginInfo', JSON.stringify(userInfo));
}

const logout = () => {
  store.isLoggedIn = false;
  store.username = '';
  store.role = '';
  store.token = '';
  localStorage.removeItem('loginInfo')
}

async function authedRequest(request) {
  const token = store.token;
  if (token) {
    instance.defaults.headers.common['Authorization'] = token;
  } else {
    delete instance.defaults.headers.common['Authorization'];
    window.location.href = '#/login'
  }
  let response = {}
  try {
    response = await request();
  } catch (error) {
    if (error.response.status === 401) {
      // 未登录，跳转到登录页 vue route to 
      window.location.href = '#/login';
      logout()
      window.vueInstance.$message.error('登录信息已过期，请重新登录');
    }
    // throw error;
  }
  return response.data;
}

const getReportDetail = async (id) => {
  return await authedRequest(() => instance.get(`api/v1/duplicate/report/${id}`));
}

const getDuplicates = async (resultIds) => {
  return await authedRequest(() => instance.post(`api/v1/duplicate/get-duplicates`, { duplicateIds: resultIds }));
}

const getDuplicateDetail = async (id) => {
  return await authedRequest(() => instance.get(`api/v1/duplicate/duplicate-result/${id}`));
}

const saveReport = async (reportId, metaInfo) => {
  return await authedRequest(() => instance.post(`api/v1/duplicate/update-report`, { id: reportId, metaInfo }));
}

const getReports = async (queryOptions) => {
  return await authedRequest(() => instance.get(`api/v1/duplicate/reports`, { params: queryOptions }));
}

const deleteReport = async (id) => {
  return await authedRequest(() => instance.post(`api/v1/duplicate/delete-report`, { id }));
}

const uploadFile = async (formData, processCallback) => {
  return await authedRequest(() => instance.post(`api/v1/file/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress: (progressEvent) => {
      const { loaded, total } = progressEvent;
      const percent = Math.floor((loaded * 100) / total);
      processCallback(percent);
    }
  }));
}

const createReport = async (results) => {
  return await authedRequest(() => instance.post(`api/v1/duplicate/create-report`, { results }));
}

const execDuplicate = async (requestOptions) => {
  return await authedRequest(() => instance.post(`api/v1/duplicate/exec-duplicate`, requestOptions, {
    timeout: 1000 * 60 * 20
  }));
}

const createBatchDuplicate = async (taskList, reportMetaInfo = {}) => {
  return await authedRequest(() => instance.post(`api/v1/duplicate/create-duplicate-task`, {
    taskList,
    reportMetaInfo
  }));
}

const getCurrentTasks = async () => { 
  return await authedRequest(() => instance.get(`api/v1/duplicate/current-tasks`));
}

const login = async (username, password) => {
  const response = await instance.post(`api/v1/user/login`, { username, password });
  if (response.data.code === 0) {
    // window.__token__ = response.data.data.token
    setLoginInfo(response.data.data);
  } else {
    // 登录失败，处理错误
    console.error(response.data.message);
  }
}

const getUsers = async () => {
  return await authedRequest(() => instance.get(`api/v1/user/users`));
}

const updateUser = async (userId, info) => {
  return await authedRequest(() => instance.post(`api/v1/user/update-user`, { userId, info }));
}
  
/*
router.post("/cancel-batch-duplicate-task", async (req, res) => {
  const { batchId } = req.body;
  taskQueue.running.filter(item => item.batchId === batchId).forEach(item => {
    taskQueue.cancel(item.taskId)
  })
  res.json({ code: 0, message: "取消成功" });
});
*/

const cancelBatchDuplicateTask = async (batchId) => {
  return await authedRequest(() => instance.post(`api/v1/duplicate/cancel-batch-duplicate-task`, { batchId }));
}

export {
  getReportDetail,
  getDuplicates,
  getDuplicateDetail,
  saveReport,
  getReports,
  deleteReport,
  uploadFile,
  createReport,
  execDuplicate,
  login,
  getUsers,
  updateUser,

  createBatchDuplicate,
  cancelBatchDuplicateTask,
  getCurrentTasks,

  logout
}