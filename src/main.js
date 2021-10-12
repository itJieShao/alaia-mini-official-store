import Vue from 'vue';
import VueApollo from 'vue-apollo';
import apolloClient from './service/apollo';
import App from './App.vue';
import store from './store'
import customNavBar from './components/nav-bar'
import customTabBar from './custom-tab-bar'
import { photoCompress } from './utils/picture'
import './iconfont/iconfont.scss';
import './iconfont/customfont.scss';
import './theme.scss';
//有数 SDK
import sr from 'sr-sdk-wxapp'

Vue.config.productionTip = false;

App.mpType = 'app';

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
});

Vue.prototype.$apolloProvider = apolloProvider;
Vue.use(VueApollo);
Vue.component('custom-nav-bar', customNavBar)
Vue.component('custom-tab-bar', customTabBar)
Vue.prototype.$photoCompress = photoCompress
Vue.prototype.$sr = sr;

const app = new Vue({
  ...App,
  store,
});
app.$mount();
