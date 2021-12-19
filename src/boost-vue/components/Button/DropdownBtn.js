import _ from 'lodash';
import { VBtn, VIcon, VListItem, VListItemAvatar, VListItemContent, VListItemTitle, VMenu } from 'vuetify/lib';

export default {
    name: 'XDropdownBtn',
    components: { VBtn, VIcon, VListItem, VListItemAvatar, VListItemContent, VListItemTitle, VMenu },

    props: {
        actions: { type: Array, required: true },
        text: { type: Boolean, default: false },
        itemText: { type: String, default: 'name' },
        returnObject: { type: Boolean, default: false }
    },

    data: () => ({ current: 0 }),

    computed: {
        btnText() {
            return (i) => _.get(this.actions[i], this.itemText, 'No text');
        },

        btnIcon() {
            return (i) => _.get(this.actions[i], 'icon', 'mdi-blank');
        },

        btnCode() {
            return (i) => _.get(this.actions[i], 'code', i);
        }
    },

    methods: {
        onChange(index) {
            if (_.isNil(index)) {
                this.onClick();
            } else {
                this.current = index;
                var payload = this.returnObject ? this.actions[index] : this.btnCode(index);
                this.$emit('click', payload);
            }
        },

        onClick() {
            var index = this.current;
            var payload = this.returnObject ? this.actions[index] : this.btnCode(index);
            this.$emit('click', payload);
        }
    },

    render() {
        var _vm = this;

        var activator = {
            key: 'activator',
            fn: ({ attrs, on, value }) => {
                return (
                    <v-btn text={_vm.text} attrs={_vm.$attrs} on={{ click: _vm.onClick }}>
                        {_vm.btnText(_vm.current)}
                        <v-icon right small attrs={attrs} on={on}>
                            {value ? 'mdi-chevron-down' : 'mdi-chevron-up'}
                        </v-icon>
                    </v-btn>
                );
            }
        };

        var scopedSlots = _vm._u([activator]);

        var items = _.map(_vm.actions, (action, i) => {
            return (
                <v-list-item>
                    <v-list-item-icon class="mr-1">
                        <v-icon dense>{_vm.btnIcon(i)}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>{_vm.btnText(i)}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            );
        });

        return (
            <v-menu offsetY scopedSlots={scopedSlots}>
                <v-list dense class="w-sm">
                    <v-list-item-group value={_vm.current} on={{ change: _vm.onChange }}>
                        {items}
                    </v-list-item-group>
                </v-list>
            </v-menu>
        );
    }
};
