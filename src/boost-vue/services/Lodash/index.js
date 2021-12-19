// 将Lodash安装到Vue中，便于页面中直接访问
import _ from 'lodash';
import objectUtils from '../../utils/ObjectUtils';

function install(Vue) {
    if (_.has(Vue.prototype, '_')) {
        console.warn('lodash has been installed');
    } else {
        objectUtils
            .defineProperties(Vue.prototype)
            .define('_', () => _)
            .build();
        Vue._ = _;
        console.log('lodash installed');
    }
}

_.mixin({
    install
});

export default _;
