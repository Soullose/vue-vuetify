// import { VIcon } from 'vuetify/lib';

export default {
    name: 'XGridLineNumCellRender',
    render() {
        var _vm = this,
            params = _vm.params;

        return <span>{params.rowIndex + 1}</span>;
    }
};
