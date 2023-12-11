import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';
import PDFPreview from './pages/PDFPreview.vue';
import FileUpload from './components/FileUpload.vue';
import ReportDetail from './pages/ReportDetail.vue'
import ReportList from './pages/ReportList.vue';
import ElementUI from 'element-ui';
import login from './pages/login.vue';
import userAdmin from './pages/userAdmin.vue';
import 'element-ui/lib/theme-chalk/index.css';

export const store = Vue.observable({
  isLoggedIn: false,
  username: '',
  token: '',
  role: '',
});

Vue.use(VueRouter);
Vue.use(ElementUI);
Vue.prototype.$store = store;
window.vueStore = store;

const routes = [
  { path: '/', redirect: '/login', name: 'login' },
  { path: '/login', component: login, name: 'login' },
  { path: '/user-admin', component: userAdmin, name: 'userAdmin' },
  { path: '/pdf-preview', component: PDFPreview },
  { path: '/report-list', component: ReportList },
  { path: '/file-upload', component: FileUpload },
  { path: '/report-detail', component: ReportDetail}
];

const router = new VueRouter({
  routes // short for `routes: routes`
});

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');

