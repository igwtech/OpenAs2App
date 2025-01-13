import { ActionContext } from 'vuex';
import Dashboard from '../../api/dashboard.js';
import { RootState } from '../index';

interface DashboardState {
    tableData: any | null;
}

const state: DashboardState = {
    tableData: null
};

const actions = {
    async fetchTableDataByDate({ commit }: ActionContext<DashboardState, RootState>, payload: any) {
        try {
            const resp = await Dashboard.getTableDataByDate(payload);
            commit('set_data', resp.data.results);
            return true;
        } catch (error) {
            console.log(error);
            return error;
        }
    },
    async fetchTableDataByInterval({ commit }: ActionContext<DashboardState, RootState>, payload: any) {
        try {
            const resp = await Dashboard.getTableDataByInterval(payload);
            commit('set_data', resp.data.results);
            return true;
        } catch (error) {
            console.log(error);
            return error;
        }
    }
};

const mutations = {
    set_data(state: DashboardState, data: any) {
        state.tableData = null;
        state.tableData = data;
    }
};

export default {
    namespaced: true,
    state,
    actions,
    mutations
};
