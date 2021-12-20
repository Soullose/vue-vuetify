import config from './config';
import components from './components';
// import BNXComponents from '@/__bnx/components';
// import MJYComponents from '@/__mjy/components';

// import BNXServices from '@/__bnx/services';

import http from './services/Http';
import log from './services/Log';
import dialog from './services/Dialog';
import _ from './services/Lodash';

import DataStoreFactory from './services/DataStore';

var services = {
    dialog,
    http,
    log
};

// components = _.extend({}, BNXComponents, MJYComponents, components);

function install(Vue) {
    _.each(components, (component, name) => Vue.component(name, component));
    // _.each(BNXComponents, (component, name) => Vue.component(name, component));
    // _.each(MJYComponents, (component, name) => Vue.component(name, component));

    // _.each(BNXServices, (service, name) => service.install(Vue, config[name]));
    _.each(services, (service, name) => service.install(Vue, config[name]));

    DataStoreFactory.install(Vue);

    // Layout.install(Vue);

    _.install(Vue);
}

export default {
    install,
    ...services,
    ...components
};
