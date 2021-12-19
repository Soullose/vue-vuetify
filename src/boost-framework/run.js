import _ from 'lodash';
import Vue from 'vue';

const defaultConfig = {
    el: '#app', // VUE挂载点
    urls: {
        systemMenus: 'framework/system/menus'
    }
};

export default {
    run(config) {
        var _config = _.extend({}, config, defaultConfig);

        return new Vue({}).$mount(_.get(_config, 'el', '#app'));
    }
};
