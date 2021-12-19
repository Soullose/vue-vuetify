<script>
import _ from 'lodash';
export default {
    props: {
        menus: { type: Array, default: () => [] }
    },

    computed: {
        menuText() {
            return (item) => _.get(item, 'name', 'Name');
        },

        menuPath() {
            return (item) => (_.get(item, 'path', '') === '' ? undefined : { path: item.path });
        },

        menuColor() {
            return '';
        },

        menuIcon() {
            return (item) => {
                var icon = _.get(item, 'icon', '');
                if (icon === '') {
                    icon = _.get(item, 'children', []).length === 0 ? 'mdi-circle-outline' : 'mdi-folder';
                }

                return icon;
            };
        }
    },

    render() {
        var _vm = this;
        return <v-list class="py-0">{_vm.renderMenus(_vm.menus, 0)}</v-list>;
    },
    methods: {
        renderMenus(menus, level) {
            var _vm = this;
            return _.map(menus, (menu) => {
                var children = _.get(menu, 'children', []);
                var leaf = children.length === 0;

                if (!leaf) {
                    children = _vm.renderMenus(children, level + 1);
                    var scopedSlots = _vm._u([
                        {
                            key: 'activator',
                            fn: () => [<v-list-item-title>{_vm.menuText(menu)}</v-list-item-title>],
                            proxy: true
                        },
                        {
                            key: 'prependIcon',
                            fn: () => [<v-icon>{_vm.menuIcon(menu)}</v-icon>],
                            proxy: true
                        }
                    ]);

                    return (
                        <v-list-group color="default" scopedSlots={scopedSlots}>
                            {children}
                        </v-list-group>
                    );
                } else {
                    // var icon = _.get(menu, 'icon', '') === '' ? <v-avatar>你</v-avatar> : ; {_vm.menuIcon(menu, level)}

                    return (
                        <v-list-item key={menu.id} to={_vm.menuPath(menu)} dense={level > 0}>
                            <v-list-item-icon>
                                <v-icon>{_vm.menuIcon(menu)}</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                                <v-list-item-title>{_vm.menuText(menu)}</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    );
                }
            });
        }
    }
};
</script>
