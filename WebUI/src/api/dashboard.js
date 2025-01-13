import axios from 'axios';

const END_POINT__DATERANGE_DATA = 'https://ec2-3-101-28-243.us-west-1.compute.amazonaws.com:8443/api/as2message/list/?Id=""&accountId=""&userId=""';
const END_POINT_INTERVAL_DATA = 'https://ec2-3-101-28-243.us-west-1.compute.amazonaws.com:8443/api/as2message/list/?orgId=""&accountId=""&userId=""';

import Utils from '../utils';

const getTableDataByDate = (payload) => axios.get(`${END_POINT__DATERANGE_DATA}&startDate=${payload.startDate}&endDate=${payload.lastDate}`, { headers: Utils.getAuthHeaders() });
const getTableDataByInterval = (payload) => axios.get(`${END_POINT_INTERVAL_DATA}&${payload}`, { headers: Utils.getAuthHeaders() });


export default {
    getTableDataByDate, getTableDataByInterval
}
