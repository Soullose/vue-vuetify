import Axios from 'axios';
import _ from 'lodash';
import objectUtils from '../../utils/ObjectUtils';

const CONTENT_TYPE_APPLICATION_JSON = 'application/json;charset=utf-8';
const CONTEXT_TYPE_TEXT_PLAIN = 'text/plain;charset=utf-8';
const CONTENT_TYPE_APPLICATION_FROM_DATA = 'application/form-data;charset=utf-8';

const urlOptions = {
    interpolate: /\{(\w+)\}/g
};

function getPathVariables(path) {
    var keys = path.match(urlOptions.interpolate);
    return _.map(keys, (key) => _.trim(key, '{}'));
}

var axios = Axios.create({
    baseURL: '/api' //config.baseURL, 不需要提供，参考在webpack中配置，详见 https://www.jianshu.com/p/f002ae1c046f
});

export var HttpService = objectUtils.defineClass(
    function () {
        var axios = Axios.create({});
        objectUtils
            .defineProperties(this)
            .define('$axios', () => {
                return axios;
            })
            .build();
    },
    {
        url(url, payload) {
            this.options = {};
            this.options.url = _.isNil(payload) ? url : _.template(url, urlOptions)(payload);
            return this;
        },

        invoke(options) {
            return axios(_.extend(this.options, options));
        },

        header(options) {
            _.each(options, (value, key) => {
                _.set(this.options, 'headers' + '.' + key, value);
            });
            return this;
        },

        data(payload) {
            this.options.data = payload;
            var contentType = _.isString(payload) ? CONTEXT_TYPE_TEXT_PLAIN : CONTENT_TYPE_APPLICATION_JSON;
            _.set(this.options, 'headers.content-type', contentType);
            return this;
        },

        jsonData(payload) {
            this.options.data = payload;
            _.set(this.options, 'headers.content-type', CONTENT_TYPE_APPLICATION_JSON);
        },

        stringData(payload) {
            this.options.data = payload;
            _.set(this.options, 'headers.content-type', CONTEXT_TYPE_TEXT_PLAIN);
        },

        formData(payload) {
            var formData = new FormData();
            _.each(payload, (value, key) => {
                formData.append(key, value);
            });

            this.options.data = formData;
            _.set(this.options, 'headers.content-type', CONTENT_TYPE_APPLICATION_FROM_DATA);
            return this;
        },

        params(payload) {
            var pathVariables = getPathVariables(this.options.url);
            if (pathVariables.length !== 0) {
                this.options.url = _.template(this.options.url, urlOptions)(payload);
                this.options.params = _.omit(payload, pathVariables);
            } else {
                this.options.params = _.clone(payload);
            }
            return this;
        },

        get() {
            this.options.method = 'get';
            return axios(this.options);
        },

        getString() {
            this.options.method = 'get';
            this.options.responseType = 'text';
            return axios(this.options);
        },

        post() {
            this.options.method = 'post';
            return axios(this.options);
        },

        delete() {
            this.options.method = 'delete';
            return axios(this.options);
        },

        put() {
            this.options.method = 'put';
            return axios(this.options);
        },

        patch() {
            this.options.method = 'patch';
            return axios(this.options);
        },

        install(Vue /* options */) {
            if (_.isNil(Vue.http)) {
                Vue.http = this;
                objectUtils
                    .defineProperties(Vue.prototype)
                    .define('$http', () => http)
                    .build();
            }
        }
    },
    {
        defaults: {
            name: 'http'
        }
    }
);

var http = new HttpService();

export default http;
