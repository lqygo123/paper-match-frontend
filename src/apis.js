import axios from 'axios';
import { DOMAIN } from '../config';

const instance = axios.create({
  baseURL: DOMAIN,
  timeout: 1000 * 60 * 5,
})

// instance.interceptors.request.use((config) => {
//   const token = window.__token__;
//   if (token) {
//     config.headers['Authorization'] = token;
//   }
//   return config;
// })

// instance.interceptors.response.use((response) => {
//   console.log('interceptors', response)
//   if (response.status === 401) {
//     console.log('!!!!!!!!!!!!!!!!!!!!!!!')
//     // 未登录，跳转到登录页
//     window.location.href = '/login';
//     delete window.__token__;
//   }
//   return response;
// })

// const requestToken = {}
// window.requestToken = requestToken;

// const getToken = () => { 
//   return localStorage.getItem('token');
// }

const setToken = (token) => { 
  localStorage.setItem('token', token);
}

const deleteToken = () => {
  localStorage.removeItem('token');
}

async function authedRequest(request) {
  const token = localStorage.getItem('token');
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
      deleteToken()
    }
    // throw error;
  }
  return response.data;
}

// const getReportDetail = async (id) => {
//   const response = await instance.get(`api/v1/duplicate/report/${id}`);
//   return response.data;
// }

// const getDuplicates = async (resultIds) => {
//   const response = await instance.post(`api/v1/duplicate/get-duplicates`, { duplicateIds: resultIds });
//   return response.data;
// }

// const getDuplicateDetail = async (id) => {
//   const response = await instance.get(`api/v1/duplicate/duplicate-result/${id}`);
//   return response.data;
// }

// const saveReport = async (reportId, metaInfo) => {
//   const response = await instance.post(`api/v1/duplicate/update-report`, { id: reportId, metaInfo });
//   return response.data;
// }

// //     const { startTime ， endTime projectName, biddingID, biddingCompany, biddingAgent, participateCompany, time } = req.query;
// const getReports = async (queryOptions) => {
//   const response = await instance.get(`api/v1/duplicate/reports`, { params: queryOptions });
//   return response.data;
// }

// const uploadFile = async (formData, processCallback) => {
//   const response = await instance.post(`api/v1/file/upload`, formData, {
//     headers: {
//       'Content-Type': 'multipart/form-data'
//     },
//     onUploadProgress: (progressEvent) => {
//       const { loaded, total } = progressEvent;
//       const percent = Math.floor((loaded * 100) / total);
//       processCallback(percent);
//     }
//   });
//   return response.data;
// }

// const createReport = async (results) => {
//   const response = await instance.post(`api/v1/duplicate/create-report`, { results });
//   return response.data;
// }

// const execDuplicate = async (requestOptions) => {
//   const response = await instance.post(`api/v1/duplicate/exec-duplicate`, requestOptions);
//   return response.data;
// }

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
  return await authedRequest(() => instance.post(`api/v1/duplicate/exec-duplicate`, requestOptions));
}

const login = async (username, password) => {
  const response = await instance.post(`api/v1/user/login`, { username, password });
  if (response.data.code === 0) {
    // window.__token__ = response.data.data.token
    setToken(response.data.data.token);
  } else {
    // 登录失败，处理错误
    console.error(response.data.message);
  }
}

export {
  getReportDetail,
  getDuplicates,
  getDuplicateDetail,
  saveReport,
  getReports,
  uploadFile,
  createReport,
  execDuplicate,
  login,
  deleteToken
}