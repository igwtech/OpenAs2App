import { createApp } from 'vue';
import App from './App.vue';
import router from './routes';
import store from './store';
import VueHighcharts from 'vue-highcharts';
import Vuelidate from 'vuelidate';
import VueScreen from 'vue-screen';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';

// Import Bootstrap and BootstrapVue CSS files (order is important)
// import 'bootstrap/dist/css/bootstrap.css'
// import 'bootstrap-vue/dist/bootstrap-vue.css'

const app = createApp(App);

app.use(router);
app.use(store);
app.use(Vuelidate);
app.use(VueHighcharts);
app.use(BootstrapVue);
app.use(IconsPlugin);
app.use(VueScreen, 'bootstrap');

app.mount('#app');
