import Vue from 'vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import '@mdi/font/css/materialdesignicons.css';
import '@/assets/style/boost.css';
import Boost from './boost-vue';
import App from './boost-framework';

Vue.config.productionTip = false;

Vue.use(Boost);

store.dispatch('framework/init').then(() => {
    console.log(store.state.framework.user);

    new Vue({
        router,
        store,
        vuetify,
        render: (h) => h(App)
    }).$mount('#app');
});
