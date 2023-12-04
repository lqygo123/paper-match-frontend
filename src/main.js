import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';
import PDFPreview from './pages/PDFPreview.vue';
import FileUpload from './components/FileUpload.vue';
import ReportDetail from './pages/ReportDetail.vue'
import main from './pages/main.vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(VueRouter);
Vue.use(ElementUI);

const routes = [
  { path: '/', component: main },
  { path: '/pdf-preview', component: PDFPreview },
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