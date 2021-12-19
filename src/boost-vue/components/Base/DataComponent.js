// useage:
// 数据动态加载，使用缓存时，会首先从本地缓存中加载数据
// <x-select data="/api/users" />

import _ from 'lodash';

export default {
    name: 'XDataComponent',
    props: {
        data: { type: Array },
        dataUrl: { type: String, default: '' }, // d_object
        queryParams: { type: Object, default: () => ({}) },
        noAutoLoad: { type: Boolean, default: false }, // 自动加载数据
        orderBy: { type: Object, default: () => ({}) }, // 数据加载时自动排序
        cached: { type: Boolean, default: false }, // 自动缓存加载的数据
        adapter: { type: Function, default: (data) => data } // 对数据进行转换
    },

    created() {
        if (!_.isEmpty(this.dataUrl) && this.noAutoLoad == false) {
            this.$log.info('load data from %s [queryParams=%o， orderBy=%o, cached=%o]', this.dataUrl, this.queryParams, this.orderBy, this.cached);
            this.retrieve(this.dataUrl, this.queryParams);
        }
    },

    methods: {
        retrieve(queryParams) {
            if (_.isEmpty(this.dataUrl)) {
                throw Error('retrieve failed, dataUrl is empty');
            }

            this.cachedQueryParams = queryParams;
            this.$http
                .url(this.dataUrl, this.queryParams)
                .get()
                .then((response) => {
                    var data = response.data;
                    // fiterBy
                    // sortBy
                    // adapter

                    data = this.adapter(data);

                    this.handleDataLoaded(data); // 组件开发者使用
                    this.$emit('update:data', data); // 应用开发者使用
                });
        },

        refresh() {
            this.retrieve(this.cachedQueryParams);
        },

        // virtual
        handleDataLoaded(/* dataStore */) {},
        handleDataChanged(/* newValue, oldValue */) {},

        setData() {}
    },

    watch: {
        data(newValue, oldValue) {
            if (newValue != oldValue) {
                // this.$log.info(
                //     'data changed, [newValue=%o, oldValue=%o]',
                //     newValue,
                //     oldValue
                // );
                this.handleDataChanged(newValue, oldValue);
            }
        }
    }
};
