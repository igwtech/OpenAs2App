import axios from 'axios';
const END_POINT_BASE = process.env.VUE_APP_ROOT_API||'https://127.0.0.1:8443/api';
const END_POINT__DATERANGE_DATA = `${END_POINT_BASE}/as2message/list/?Id=""&accountId=""&userId=""`;
const END_POINT_INTERVAL_DATA = `${END_POINT_BASE}/as2message/list/?orgId=""&accountId=""&userId=""`;

const getTableDataByDate = ( payload ) => axios.get(END_POINT__DATERANGE_DATA+ '&' +`startDate=${payload.startDate}`+ '&' +`endDate=${payload.lastDate}`,{ headers: { 'Authorization': 'Basic dXNlcklEOnBXZA==' }});
const getTableDataByInterval = ( payload ) => axios.get(END_POINT_INTERVAL_DATA + '&' +`${payload}`,{ headers: { 'Authorization': 'Basic dXNlcklEOnBXZA==' }});


export default {
    getTableDataByDate, getTableDataByInterval
}