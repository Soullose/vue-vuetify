import _ from 'lodash';
import objectUtils from '../../utils/ObjectUtils';
import Vuex from 'vuex';

var store = new Vuex.Store({
    strict: true
});

function createEvent(name, payload) {
    return {
        name,
        payload
    };
}

function defineModule(options) {
    return {
        namespaced: true,
        state: { data: [], inserted: [], deleted: [], updated: [], event: {} },
        mutations: {
            SET_DATA: (state, payload) => {
                state.data = payload;
                state.inserted = [];
                state.deleted = [];
                state.updated = [];
                state.event = createEvent('set_data', payload);
            },

            ADD: (state, { added, inserted }) => {
                _.each(added, (row) => state.data.push(row));
                inserted && state.inserted.splice(state.inserted.length, 0, added);
                state.event = createEvent('add', added);
            },

            REMOVE: (state, { removed, deleted }) => {
                // var removedData = _.pullAll(state.data, removed);
                // var removedInserted = _.pullAll(state.inserted, removed);
                // /*var removedUpdated = */ _.pullAll(state.updated, removed);

                // if (deleted) {
                //     var execluedInserted = _.difference(removedData, removedInserted);
                //     state.deleted.splice(state.deleted.length, 0, execluedInserted);
                // }

                // state.data.__ob__.dep.notify();
                // state.event = createEvent('remove', removed);
                state.data.shift();
            },

            MODIFY: (state, { modified, value, updated }) => {
                _.each(modified, (row) => {
                    _.assign(row, value);
                });
                state.event = createEvent('modify', modified);
            }
        },
        actions: {
            retrieve(context, payload) {
                var queryParams = payload;
                var http = options.http,
                    retrieveUrl = options.retrieveUrl;

                return _.isFunction(retrieveUrl)
                    ? retrieveUrl(queryParams).then((response) => {
                          context.commit('SET_DATA', response.data);
                      })
                    : (_.isNil(queryParams) ? http.url(retrieveUrl) : http.url(retrieveUrl, queryParams)).get().then((response) => {
                          context.commit('SET_DATA', response.data);
                      });
            }
        },
        getters: {
            modified(state) {
                return state.inserted.length !== 0 || state.deleted.length !== 0 || state.updated.length !== 0;
            }
        }
    };
}

function registerModule(options) {
    var moduleId = options.moduleId;
    var module = _.get(store._modules.root._children, moduleId);

    if (_.isNil(module)) {
        store.registerModule(moduleId, defineModule(options));

        module = _.get(store._modules.root._children, moduleId);
    }

    return module.context;
}

function unregisterModule(options) {}

var DataStore = objectUtils.defineClass(
    function (vm, options) {
        var _options = _.extend(
            {
                moduleId: _.uniqueId('ds_')
            },
            DataStore.defaults,
            _.isString(options) ? { retrieveUrl: options, autoLoad: true } : options
        );
        _options.http = vm.$http;
        var context = registerModule(_options);
        objectUtils
            .defineProperties(this)
            .define('$context', () => context)
            .define('$options', () => _options)
            .define('$vm', () => vm)
            .define('data', () => context.state.data)
            .define('event', () => context.state.event)
            .build();
    },
    {
        add(rows, inserted) {
            var idField = this.$options.idField;
            var added = _.map(_.castArray(rows), (row) => {
                var addedRow = _.clone(row);
                _.isNil(_.get(addedRow, idField)) && _.set(addedRow, idField, _.uniqueId('new_'));
                return addedRow;
            });
            this.$context.commit('ADD', { added, inserted });
            return added;
        },

        // 被移除的数据，来源于本DataStore
        remove(rows, deleted) {
            var removed = _.castArray(rows);
            this.$context.commit('REMOVE', { removed, deleted });
        },

        removeById(rowIds, deleted) {
            var data = this.$context.state.data;
            var idField = this.$options.idField;

            var removed = _.map(_.castArray(rowIds), (id) => _.find(data, (row) => row[idField] === id));
            this.$context.commit('REMOVE', { removed, deleted });
        },

        removeIf(test, deleted) {
            var removed = _.filter(this.$context.state.data, (row) => test(row));
            this.$context.commit('REMOVE', { removed, deleted });
            return removed;
        },

        modify(rows, value, updated) {
            var modified = _.castArray(rows);
            this.$context.commit('MODIFY', { modified, value, updated });
        },

        notify(name, payload) {
            this.$context.commit('SET_EVENT', { name, payload });
        },

        destroy() {},

        setData(data) {
            this.$context.commit('SET_DATA', data);
        },

        retrieve(queryParams) {
            this.cachedQueryParams = queryParams;
            return this.$context.dispatch('retrieve', queryParams);
        },

        refresh() {
            this.retrieve(this.cachedQueryParams);
        }
    },
    {
        defaults: {
            idField: 'id',
            name: null,
            autoLoad: true,
            retrieveUrl: '' // 如果是函数必须返回Promise
        }
    }
);

var DataStoreFactory = objectUtils.defineClass(function () {}, {
    install(Vue) {
        Vue.mixin({
            beforeCreate() {
                var datastoreOptions = _.get(this.$options, 'datastores', undefined);
                if (!_.isNil(datastoreOptions)) {
                    var datastores = {};
                    _.each(datastoreOptions, (options, key) => {
                        var ds = new DataStore(this, options);
                        datastores[key] = ds;
                    });

                    this.$datastores = datastores;
                    console.log(this.$datastores);
                }
            },

            data() {
                return !_.isNil(this.$datastores) ? this.$datastores : {};
            },

            created() {
                if (!_.isNil(this.$datastores)) {
                    var loadAll = _.map(
                        _.filter(this.$datastores, (ds) => ds.$options.autoLoad),
                        (ds) => ds.retrieve()
                    );

                    Promise.all(loadAll).then(_.spread(() => _.isFunction(this.handleDataAutoLoaded) && this.handleDataAutoLoaded()));
                }
            },

            destroy() {
                if (!_.isNil(this.$datastore)) {
                    _.each(this.$datastores, (ds) => ds.destroy());
                }
            }
        });
    }
});

export default new DataStoreFactory();
