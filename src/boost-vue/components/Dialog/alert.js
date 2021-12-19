export default {
    name: 'XAlert',
    props: {
        value: { type: Boolean, default: false },
        message: { type: String, default: '' },
        timeout: { type: Number, default: 2000 },
        type: { type: String, default: 'info' },
        showIcon: { type: Boolean, default: false }
    },
    methods: {
        getAlertProps(type) {
            const props = {
                info: { color: 'blue darken-2', icon: 'mdi-information-outline' },
                success: { color: 'green darken-2', icon: 'mdi-information-outline' },
                warning: { color: 'yellow darken-2', icon: 'mdi-information-outline' },
                error: { color: 'red darken-2', icon: 'mdi-information-outline' }
            };
            return props[type] ? props[type] : props.info;
        }
    },
    render() {
        var _vm = this;

        var props = this.getAlertProps(this.type);

        const messageBtn = () => {
            return (
                <v-btn
                    small
                    icon
                    on={{
                        click: function () {
                            _vm.$emit('close');
                        }
                    }}
                >
                    <v-icon small>mdi-close</v-icon>
                </v-btn>
            );
        };
        const messageIcon = () => {
            if (_vm.showIcon) {
                return <v-icon class="mr-3">{props.icon}</v-icon>;
            } else {
                return '';
            }
        };

        return (
            <v-snackbar
                value={_vm.value}
                timeout={_vm.timeout}
                bottom
                right
                color={props.color}
                on={{
                    input: () => {
                        this.$emit('close');
                    }
                }}
                scopedSlots={{
                    action() {
                        return messageBtn();
                    }
                }}
            >
                {[messageIcon()]}
                {_vm.message}
            </v-snackbar>
        );
    }
};
