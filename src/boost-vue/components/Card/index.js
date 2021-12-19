import _ from 'lodash';

export default {
    name: 'XCard',

    props: {
        dataUrl: { type: String, require: true }
    },

    data() {
        return {
            rows: []
        };
    },

    render() {
        var _vm = this;

        var listeners = _.extend(
            {
                click() {
                    alert('XXX');
                }
            },
            _vm.$listeners
        );

        var createButton = function () {
            return <v-btn on={listeners} />;
        };

        var defaultComponents = [
            <v-card-title>{[createButton()]}</v-card-title>,
            <v-card-text>
                <v-data-table items={_vm.rows} />
            </v-card-text>,
            _vm.$slots.default
        ];

        console.log(_vm);
        console.log(_vm.$scopedSlots);
        return <v-card>{defaultComponents}</v-card>;
    },

    created() {
        this.rows = [
            {
                id: 1
            }
        ];
    }
};
