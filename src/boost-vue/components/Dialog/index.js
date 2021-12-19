export default {
    name: 'XDialog',
    props: {
        value: { type: Boolean, default: false },
        title: { type: String, default: 'Untitle' },
        icon: { type: String, default: 'mdi-application-cog' },
        okText: { type: String, default: '确定' },
        cancelText: { type: String, default: '取消' },
        fullscreen: { type: Boolean, default: false },
        closeCode: { type: String, default: undefined }
    },
    mounted() {
        // 页面显示成功后
        this.$emit('open');
    },

    watch: {
        value(val) {
            this.$emit(val ? 'open' : 'close');
        }
    },

    render() {
        var _vm = this,
            defaultSlots = _vm.$slots.default;
        return _vm.fullscreen ? (
            <v-dialog fullscreen value={_vm.value} attrs={_vm.$attrs} on={_vm.$listeners} persistent={true}>
                <v-card>
                    <v-toolbar dense dark color="primary">
                        <v-btn icon dark>
                            <v-icon>{_vm.icon}</v-icon>
                        </v-btn>
                        <v-toolbar-title>{_vm.title}</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-toolbar-items>
                            <v-btn dark text on={{ click: () => _vm.$emit('ok') }}>
                                {_vm.okText}
                            </v-btn>
                            <v-btn dark text on={{ click: () => _vm.$emit('cancel') }}>
                                {_vm.cancelText}
                            </v-btn>
                        </v-toolbar-items>
                    </v-toolbar>
                    <v-card-text>{defaultSlots}</v-card-text>
                </v-card>
            </v-dialog>
        ) : (
            <v-dialog value={_vm.value} attrs={_vm.$attrs} on={_vm.$listeners} persistent={true}>
                <v-card>
                    <v-toolbar dense flat>
                        <v-icon left>mdi-application-cog</v-icon>
                        {_vm.title}
                        <v-spacer />
                        <v-icon on={{ click: () => _vm.$emit('close', { code: _vm.closeCode }) }}>mdi-close</v-icon>
                    </v-toolbar>
                    <v-card-text class="px-3 pt-0 pb-3">{defaultSlots}</v-card-text>
                    <v-card-actions class="pb-4">
                        {_vm.$slots['left-actions']}
                        <v-spacer />
                        <v-btn color="primary" on={{ click: () => _vm.$emit('ok') }}>
                            <v-icon left>mdi-check</v-icon>
                            {_vm.okText}
                        </v-btn>
                        <v-btn on={{ click: () => _vm.$emit('cancel') }}>
                            <v-icon left>mdi-cancel</v-icon>
                            {_vm.cancelText}
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        );
    }
};
