import { createStore, Store } from 'vuex';
import { Module } from 'vuex';
import dashboardModule from './modules/dashboard.module.js';

interface RootState {
    username: string | null;
    password: string | null;
    server: string | null;
}

const dashboardModule: Module<any, RootState> = {
    namespaced: true,
    state: {
        tableData: null
    },
    getters: {},
    actions: {
        async fetchTableDataByDate({ commit }, payload) {
            try {
                const resp = await Dashboard.getTableDataByDate(payload);
                commit('set_data', resp.data.results);
                return true;
            } catch (error) {
                console.log(error);
                return error;
            }
        },
        async fetchTableDataByInterval({ commit }, payload) {
            try {
                const resp = await Dashboard.getTableDataByInterval(payload);
                commit('set_data', resp.data.results);
                return true;
            } catch (error) {
                console.log(error);
                return error;
            }
        }
    },
    mutations: {
        set_data: (state, data) => {
            state.tableData = null;
            state.tableData = data;
        }
    }
};

const store: Store<RootState> = createStore({
  modules: {
    dashboardModule
  },
  state: {
    username: null,
    password: null,
    server: null
  },
  actions: {
    loginAction(context, payload) {
      if (this.debug) console.log(`Logging with ${payload.user} and ${payload.pass}`);
      context.commit('login', payload);
    },
    logoutAction(context) {
      if (this.debug) console.log(`Logout`);
      context.commit('logout');
    }
  },
  mutations: {
    login(state, payload) {
      state.username = payload.user;
      state.password = payload.pass;
      state.server = payload.server;
      return state;
    },
    logout(state) {
      state.username = null;
      state.password = null;
      return state;
    }
  }
});

export default store;
