import _ from 'lodash';
import objectUtils from '../../utils/ObjectUtils';

const prototype = {
    info(message, ...args) {
        console.info(message, ...args);
    },

    trace(message, ...args) {
        console.trace(message, args);
    },

    debug(message, ...args) {
        console.debug(message, args);
    },

    error(message, ...args) {
        console.error(message, args);
    }
};

var LogService = objectUtils.defineClass(function () {}, prototype, {
    installed: false,
    defaults: {
        name: 'log',
        level: 'debug'
    },

    install(Vue, options) {
        if (!LogService.installed) {
            LogService.installed = true;

            var _options = _.extend({}, LogService.defaults, options);
            var name = _options.name;
            var log = new LogService();

            objectUtils
                .defineProperties(Vue.prototype)
                .define('$' + name, () => log)
                .build();

            Vue[name] = log;
        }
    }
});

export default LogService;
