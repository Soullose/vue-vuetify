import _ from 'lodash';
export default {
    name: 'XGridCellRender',
    created() {},

    computed: {
        field() {
            return _.get(this, 'params.colDef.field', null);
        }
    },

    render() {
        var _vm = this,
            params = _vm.params;

        return <span>{params.colDef.cellRendererParams.render(_vm.params)}</span>;
    },

    methods: {}
};
