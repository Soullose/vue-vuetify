// import DataComponent from '../Base/DataComponent';
import _ from 'lodash';
import { VList, VListItemGroup, VListItem, VListItemTitle } from 'vuetify/lib';

export default {
    name: 'XList',
    components: { VList, VListItemGroup, VListItem, VListItemTitle },
    props: { ds: Object, /* required: true, */ default: null },
    computed: {
        data() {
            return this.ds.data;
        }
    },
    methods: {
        onChange(index) {
            this.$emit('selected', _.isNil(index) ? null : this.data[index]);
        }
    },
    render() {
        var _vm = this;
        var itemRender = _vm.$scopedSlots.default;
        var itemSlots = _.isNil(itemRender) ? undefined : _.map(_vm.data, (item) => itemRender({ item }));

        var listeners = {
            change: _vm.onChange
        };

        return (
            <v-list attrs={_vm.$attrs}>
                <v-list-item-group on={listeners}>
                    {_vm.$slots.prepend}
                    {itemSlots}
                </v-list-item-group>
                {_vm.$slots.append}
            </v-list>
        );
    }
};
