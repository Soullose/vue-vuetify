import { VTreeview } from 'vuetify/lib';
import _ from 'lodash';
import objectUtils from '@/boost-vue/utils/ObjectUtils';

var TreeviewNode = objectUtils.defineWrappedClass(
    [
        'id',
        'text',
        function leaf() {
            return this.children.length === 0;
        }
    ],
    function () {},
    {},
    {}
);

console.log(TreeviewNode);

export default {
    props: {
        ds: { type: Object, required: true },
        idField: { type: String, default: 'id' },
        parentIdField: { type: String, default: 'parentId' },
        itemText: { type: [String, Function], default: 'name' },
        itemDisabled: { type: [String, Function], default: null },
        activatable: { type: Boolean, default: true },
        hoverable: { type: Boolean, default: true }
    },
    components: { VTreeview },

    data() {
        return {
            items: []
        };
    },

    computed: {
        data() {
            return _.isNil(this.ds) ? [] : this.ds.data;
        },

        idValue() {
            return (item) => _.get(item, this.idField, null);
        },

        parentIdValue() {
            return (item) => _.get(item, this.parentIdField, null);
        },

        leaf() {
            return (item) => this.children(item).length === 0;
        },

        label() {
            // item = item.data
            return (item) => (_.isString(this.itemText) ? _.get(item, this.itemText, 'Item text') : this.itemText(item));
        },

        prependIcon() {
            return ({ open, leaf }) => (leaf ? 'mdi-file-outline' : open ? 'mdi-folder-open-outline' : 'mdi-folder-outline');
        }
    },

    methods: {
        updateAll(status) {
            this.$refs.tree.updateAll(status);
        },
        buildTree(items, parentId) {
            var parts = _.partition(items, (item) => this.parentIdValue(item) === parentId);
            return _.map(parts[0], (root) => {
                var node = this.createNode(root);
                node.children = this.buildTree(parts[1], this.idValue(root));
                return node;
            });
        },

        createNode(root) {
            var t = {
                data: root
            };

            var def = objectUtils.defineProperties(t);
            def.define('id', () => this.idValue(root));

            var itemDisabled = this.itemDisabled;
            if (!_.isNil(itemDisabled)) {
                var disabledGetter = _.isString(itemDisabled) ? () => _.get(root, itemDisabled, true) : () => itemDisabled(root);
                def.define('disabled', disabledGetter);
            }

            def.build();

            return t;
        },

        labelFn(attrs) {
            var scoped = _.extend({}, attrs, { item: attrs.item.data, leaf: attrs.item.children.length === 0 });
            return _.isNil(this.$scopedSlots.label) ? this.label(scoped.item) : this.$scopedSlots.label(scoped);
        },

        prependFn(attrs) {
            var scoped = _.extend({}, attrs, { item: attrs.item.data, leaf: attrs.item.children.length === 0 });
            return _.isNil(this.$scopedSlots.prepend) ? (
                <v-icon color={scoped.leaf ? 'primary lighten-2' : 'yellow darken-2'}>{this.prependIcon(scoped)}</v-icon>
            ) : (
                this.$scopedSlots.prepend(scoped)
            );
        },

        appendFn(attrs) {
            var scoped = _.extend({}, attrs, { item: attrs.item.data, leaf: attrs.item.children.length === 0 });
            // var scoped = attrs;
            return _.isNil(this.$scopedSlots.append) ? undefined : this.$scopedSlots.append(scoped);
        }
    },

    watch: {
        'ds.event'(event) {
            var _vm = this;
            if (event.name === 'set_data') {
                _vm.items = _vm.buildTree(event.payload, null);

                if (_vm.$attrs['open-all']) {
                    _vm.$nextTick(() => {
                        _vm.updateAll(true);
                    });
                }
            }
        }
    },

    render() {
        var _vm = this;
        var scopedSlots = _vm._u([
            {
                key: 'label',
                fn: _vm.labelFn
            },
            {
                key: 'prepend',
                fn: _vm.prependFn
            },
            {
                key: 'append',
                fn: _vm.appendFn
            }
        ]);
        return (
            <v-treeview
                ref="tree"
                hoverable={_vm.hoverable}
                activatable={_vm.activatable}
                items={_vm.items}
                scopedSlots={scopedSlots}
                attrs={_vm.$attrs}
                on={_vm.$listeners}
            />
        );
    }
};
