import axios from 'axios';
import { API_BASE_URL } from '../config';

const getReportDetail = async (id) => { 
  try {
    const response = await axios.get(`${API_BASE_URL}/duplicate/report/${id}`);
    return response.data;
  } catch (error) {
    console.log(error)
  }
}

const getDuplicates = async (resultIds) => { 
  try {
    const response = await axios.post(`${API_BASE_URL}/duplicate/get-duplicates`, { duplicateIds: resultIds });
    return response.data;
  } catch (error) {
    console.log(error)
  }
}

const getDuplicateDetail = async (id) => { 
  try {
    const response = await axios.get(`${API_BASE_URL}/duplicate/duplicate-result/${id}`);
    return response.data;
  } catch (error) {
    console.log(error)
  }
}

const saveReport = async (reportId, metaInfo) => { 
  try {
    const response = await axios.post(`${API_BASE_URL}/duplicate/update-report`, { id: reportId, metaInfo });
    return response.data;
  } catch (error) {
    console.log(error)
  }
}

//     const { startTime ， endTime projectName, biddingID, biddingCompany, biddingAgent, participateCompany, time } = req.query;
const getReports = async (queryOptions) => { 
  try {
    const response = await axios.get(`${API_BASE_URL}/duplicate/reports`, { params: queryOptions });
    return response.data;
  } catch (error) {
    console.log(error)
  }
}

const uploadFile = async (formData, processCallback) => { 
  try {
    const response = await axios.post(`${API_BASE_URL}/file/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;
        const percent = Math.floor((loaded * 100) / total);
        processCallback(percent);
      }
    });
    return response.data;
  } catch (error) {
    console.log(error)
  }
}

const createReport = async (results) => { 
  try {
    const response = await axios.post(`${API_BASE_URL}/duplicate/create-report`, { results });
    return response.data;
  } catch (error) {
    console.log(error)
  }
}

const execDuplicate = async (requestOptions) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/duplicate/exec-duplicate`, requestOptions);
    return response.data;
  } catch (error) {
    console.log(error)
  }
}

// login
// const login = async (username, password) => {
//   try {
//     const response = await axios.post(`${API_BASE_URL}/user/login`, { username, password });   
//   } catch (error) {
    
//   }
// }

export {
  getReportDetail,
  getDuplicates,
  getDuplicateDetail,
  saveReport,
  getReports,
  uploadFile,
  createReport,
  execDuplicate
}