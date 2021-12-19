import Vue from 'vue';
import Vuex from 'vuex';
import _ from 'lodash';
import framework from '../boost-framework/store';

Vue.use(Vuex);

// 自动加载模块
// var modules = {};
// const moduleContext = require.context('../', true, /store\/index\.js$/);
// moduleContext.keys().forEach((path) => {
//     if (path.startsWith('./store')) {
//         return;
//     } else {
//         const module = moduleContext(path);
//         _.each(module, (value, key) => {
//             modules[key] = value;
//         });
//     }
// });

export default new Vuex.Store({
    state: {},
    mutations: {},
    actions: {},
    modules: {
        framework,

        eventbus: {
            namespaced: true,
            state: {}
        }
    }
});
