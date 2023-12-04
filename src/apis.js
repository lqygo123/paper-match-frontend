import axios from 'axios';
import { BASE_URL } from '../config';

const getReportDetail = async (id) => { 
  try {
    const response = await axios.get(`${BASE_URL}/duplicate/report/${id}`);
    return response.data;
  } catch (error) {
    console.log(error)
  }
}

const getDuplicates = async (resultIds) => { 
  try {
    const response = await axios.post(`${BASE_URL}/duplicate/get-duplicates`, { duplicateIds: resultIds });
    return response.data;
  } catch (error) {
    console.log(error)
  }
}

const saveReport = async (reportId, metaInfo) => { 
  try {
    const response = await axios.post(`${BASE_URL}/duplicate/update-report`, { id: reportId, metaInfo });
    return response.data;
  } catch (error) {
    console.log(error)
  }
}

//     const { startTime ， endTime projectName, biddingID, biddingCompany, biddingAgent, participateCompany, time } = req.query;
const getReports = async (queryOptions) => { 
  try {
    const response = await axios.get(`${BASE_URL}/duplicate/reports`, { params: queryOptions });
    return response.data;
  } catch (error) {
    console.log(error)
  }
}

export {
  getReportDetail,
  getDuplicates,
  saveReport,
  getReports
}