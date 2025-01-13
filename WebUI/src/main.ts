import { createApp } from 'vue';
import App from './App.vue';
import router from './routes';
import {store} from './store';
import HighchartsVue from 'highcharts-vue';
import VueScreen from 'vue-screen';
// import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';

// Import Bootstrap and BootstrapVue CSS files (order is important)
// import 'bootstrap/dist/css/bootstrap.css'
// import 'bootstrap-vue/dist/bootstrap-vue.css'

const app = createApp(App);

app.use(router);
app.use(store);
app.use(HighchartsVue);
// app.use(BootstrapVue);
// app.use(IconsPlugin);
app.use(VueScreen);

app.mount('#app');
