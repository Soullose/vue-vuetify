import _ from 'lodash';

export default {
    name: 'AbstractButton',
    props: {
        type: { type: String, default: null },
        icon: { type: String, default: null },
        label: { type: String, default: null },
        permission: { type: String, default: null },
        disabled: { type: Boolean, default: false }
    },
    computed: {
        iconOnly() {
            return !_.isNil(this.icon) && _.isNil(this.label);
        },
        btnStyle() {
            switch (this.type) {
                case 'toolbarButton':
                    return { color: 'primary', large: true };
                case 'formButton':
                    return { color: 'info', small: true };
                default:
                    return { color: 'default' };
            }
        },
        // 按钮可用状态
        disabledState() {
            var _disabled = true;

            if (_.isNil(this.permission)) {
                // 未设置按钮权限
                _disabled = false;
            } else {
                // 设置按钮权限，读取缓存的权限值
                var _found = _.find(this.$route.meta.permissions, {
                    name: this.permission
                });
                _disabled = _.isNil(_found);
            }

            return _disabled || this.disabled;
        }
    },

    methods: {}
};
