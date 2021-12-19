<script>
import _ from 'lodash';
import { VCol, VToolbar } from 'vuetify/lib';
import VScrollbar from 'vuescroll';

export default {
    name: 'XColPanel',
    components: { VCol, VToolbar, VScrollbar },
    props: {
        noBorder: { type: Boolean, default: false },
        scrollbar: { type: Boolean, default: false }
    },
    data() {
        return {
            ops: {
                vuescroll: {},
                scrollPanel: {},
                rail: {},
                bar: {
                    opacity: 0.5,
                    background: '#8b8b8b',
                    onlyShowBarOnScroll: false
                }
            }
        };
    },

    methods: {
        createHeader() {
            var _vm = this;
            var header = _vm.$slots.header;
            return _.isNil(header) ? undefined : <div>{header}</div>;
        },

        createContent() {
            var _vm = this;
            var clazz = 'mx-3 grow';
            !_vm.noBorder && (clazz += ' b');

            var content = _.isNil(_vm.$slots.default) ? <div>No Content</div> : _vm.$slots.default;
            content = _vm.scrollbar !== false ? <v-scrollbar ops={_vm.ops}>{content}</v-scrollbar> : content;

            return (
                <div class={clazz} style="height:300px; overflow-y:hidden">
                    {content}
                </div>
            );
        },

        createFooter() {
            var _vm = this;
            var footer = _vm.$slots.footer;
            var clazz = 'pa-1 mx-3 ';
            !_vm.noBorder && (clazz += ' b b-nt');
            return _.isNil(footer) ? undefined : (
                <div class={clazz}>
                    <div class="float-right">{footer}</div>
                </div>
            );
        }
    },

    render() {
        var _vm = this;
        var defaultSlots = [];
        var header = _vm.createHeader();
        header && defaultSlots.push(header);

        var content = _vm.createContent();
        content && defaultSlots.push(content);

        var footer = _vm.createFooter();
        footer && defaultSlots.push(footer);

        return (
            <v-col class="layout column pb-3" attrs={_vm.$attrs}>
                {defaultSlots}
            </v-col>
        );
    }
};
</script>
