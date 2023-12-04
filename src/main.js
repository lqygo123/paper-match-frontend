import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';
import PDFPreview from './pages/PDFPreview.vue';
import FileUpload from './components/FileUpload.vue';
import ReportDetail from './pages/ReportDetail.vue'
import main from './pages/main.vue';

Vue.use(VueRouter);

const routes = [
  { path: '/', component: main },
  { path: '/pdf-preview', component: PDFPreview },
  { path: '/file-upload', component: FileUpload },
  { path: '/report-details', component: ReportDetail}
];

const router = new VueRouter({
  routes // short for `routes: routes`
});

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');