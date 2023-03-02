import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import resetMessage from "@/api/resetMessage";
import 'element-ui/lib/theme-chalk/index.css';
// 计算响应式
import 'lib-flexible-computer'


// 以插件形式引入自定义请求api, 全局使用, this.deleteRequest....
import {postRequest} from "@/api";
import {getRequest} from "@/api";
import {putRequest} from "@/api";
import {deleteRequest} from "@/api";

Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.prototype.$message = resetMessage;

// 插件形式使用请求
Vue.prototype.postRequest = postRequest;
Vue.prototype.getRequest = getRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.deleteRequest = deleteRequest;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
