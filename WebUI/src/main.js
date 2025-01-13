import { createApp } from 'vue'
import App from './App.vue'
import router from './routes'
import store from './store'
import VueHighcharts from 'vue-highcharts';
import Vuelidate from 'vuelidate'
import VeeValidate from "vee-validate";
import VueScreen from 'vue-screen';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import VeeValidate from "vee-validate";
// Import Bootstrap and BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
const app = createApp(App);

app.use(router);
app.use(store);
app.use(Vuelidate);
app.use(VueHighcharts);
app.use(BootstrapVue);
app.use(IconsPlugin);
app.use(VueScreen, 'bootstrap');
app.use(VeeValidate, {
  inject: true,
  fieldsBagName: "veeFields",
  errorBagName: "veeErrors"
});

app.mount('#app');
