import AbstractButton from './AbstractButton';
import _ from 'lodash';

export default {
    name: 'XBtn',
    extends: AbstractButton,
    render() {
        var _vm = this;

        return (
            <v-btn
                attrs={_.extend(
                    {
                        icon: _vm.iconOnly
                    },
                    _vm.btnStyle,
                    _vm.$attrs
                )}
                on={_vm.$listeners}
            >
                {!_.isNil(_vm.icon) ? (
                    <v-icon dense={_vm.$attrs.dense} small={_vm.$attrs.small} large={_vm.$attrs.large} left={!_.isNil(_vm.label)}>
                        {_vm.icon}
                    </v-icon>
                ) : null}
                {_vm.label}
            </v-btn>
        );
    }
};
