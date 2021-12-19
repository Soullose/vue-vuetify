import _ from 'lodash';
import { VBtn } from 'vuetify/lib';

const ButtonTypes = {
    add: { text: '增加' },
    delete: {
        text: '删除',
        icon: 'mdi-trash-can-outline',
        color: 'red'
    },
    ok: {
        text: '确定'
    },
    cancel: {},
    save: { text: '保存' },
    import: { text: '导入' },
    export: { text: '导出' }
};

export default {
    name: 'XBtn',
    props: {
        type: { type: String, default: null },
        size: { type: String, default: 'dense' }
    },
    components: { VBtn },

    computed: {
        buttonType() {
            return _.isNil(this.type) ? undefined : _.get(ButtonTypes, this.type, { icon: 'mdi-plus', text: 'Miss Type', color: 'error' });
        }
    },

    beforeMount() {
        _.set(this.$attrs, this.size, '');
    },

    render() {
        var _vm = this;
        var buttonType = _vm.buttonType;
        console.log(_vm.$listeners);

        return _.isNil(buttonType) ? (
            <v-btn attrs={_vm.$attrs} on={_vm.$listeners}>
                {_vm.$slots.default}
            </v-btn>
        ) : (
            <v-btn attrs={_vm.$attrs} on={_vm.$listeners}>
                <v-icon left>{_vm.buttonType.icon}</v-icon>
                {_vm.buttonType.text}
            </v-btn>
        );
    }
};
