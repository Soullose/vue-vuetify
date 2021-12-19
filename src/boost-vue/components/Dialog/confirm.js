export default {
    name: 'XConfirm',
    props: {
        value: { type: Boolean, default: false },
        title: { type: String, default: '提示' },
        message: { type: String, default: '' },
        width: { type: [String, Number], default: 400 },
        okText: { type: String, default: '确定' },
        cancelText: { type: String, default: '取消' }
    },
    render() {
        var _vm = this;

        return (
            <v-dialog value={_vm.value} attrs={_vm.$attrs} on={_vm.$listeners} persistent={true} width={_vm.width}>
                <v-card>
                    <v-card-title>
                        {_vm.title}
                        <v-spacer />
                        <v-icon
                            on={{
                                click: function () {
                                    _vm.$emit('close');
                                }
                            }}
                        >
                            mdi-close
                        </v-icon>
                    </v-card-title>

                    <v-card-text>
                        <v-icon large class="mr-3" color="blue">
                            mdi-chat-question-outline
                        </v-icon>
                        {_vm.message}
                    </v-card-text>

                    <v-card-actions class="pa-6">
                        <v-spacer />
                        {[_vm.makeConfirmActions()]}
                    </v-card-actions>
                </v-card>
            </v-dialog>
        );
    },
    methods: {
        makeConfirmActions() {
            var _vm = this;
            var actions = [
                <v-btn
                    color={'primary'}
                    on={{
                        click: function () {
                            _vm.$emit('close', { code: 'ok' });
                        }
                    }}
                >
                    <v-icon left={true} dense>
                        mdi-check
                    </v-icon>
                    {_vm.okText}
                </v-btn>,
                <v-btn
                    on={{
                        click: function () {
                            _vm.$emit('close', { code: 'cancel' });
                        }
                    }}
                >
                    <v-icon left={true} dense>
                        mdi-cancel
                    </v-icon>
                    {_vm.cancelText}
                </v-btn>
            ];

            return actions;
        }
    }
};
