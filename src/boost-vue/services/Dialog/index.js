import _ from 'lodash';
import objectUtils from '../../utils/ObjectUtils';
import Vue from 'vue';

var DialogService = objectUtils.defineClass(
    function (vm) {
        this._vm = vm;
        this.dialogs = {};
    },
    {
        open(loader, attrs, listeners) {
            loader.then((component) => {
                component = _.get(component, 'default', component);
                var path = component.__file;

                var dialog = _.get(this.dialogs, path, null);
                if (_.isNil(dialog)) {
                    dialog = this.createDialog(component, attrs, listeners);
                    this.dialogs[path] = dialog;
                } else {
                    dialog.attrs = attrs;
                    dialog.listeners = listeners;
                }
                dialog.visible = true;
            });
        },

        destroy() {
            _.each(this.dialogs, (vm) => {
                vm.$destroy();
            });
            this.dialogs = {};
        },

        createDialog(component, attrs, listeners) {
            var div = document.createElement('div');
            this._vm.$el.append(div);

            var dialog = new Vue({
                el: div,
                parent: this._vm,
                data: () => ({
                    visible: true,
                    attrs,
                    listeners
                }),
                methods: {
                    handleClose(event) {
                        this.visible = false;
                        if (!_.isNil(event)) {
                            var { code, data } = event;
                            if (!_.isNil(code)) {
                                var fn = _.get(this.listeners, code, () => {
                                    console.warn('Can not found callback function with name %s', code);
                                });
                                fn(data);
                            }
                        }
                    }
                },
                render() {
                    var _vm = this;
                    return <component value={_vm.visible} attrs={_vm.attrs} on={{ close: _vm.handleClose }} />;
                }
            });

            return dialog;
        }
    },
    {
        install(Vue /* options */) {
            Vue.mixin({
                beforeCreate() {
                    this.$dialog = new DialogService(this);
                },
                destroyed() {
                    this.$dialog.destroy();
                }
            });
        }
    }
);

export default DialogService;
