import { createStore } from 'vuex';
import dashboardModule from './modules/dashboard.module.js';

interface RootState {
    username: string | null;
    password: string | null;
    server: string | null;
}

const store = createStore<RootState>({
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
      console.log(`Logging with ${payload.user} and ${payload.pass}`);
      context.commit('login', payload);
    },
    logoutAction(context) {
      console.log(`Logout`);
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
