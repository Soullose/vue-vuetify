<script>
import _ from 'lodash';
import GridCellEditor from './GridCellEditor';
export default {
    mixins: [GridCellEditor],
    data() {
        return {
            visible: false
        };
    },

    methods: {
        handleMounted() {
            this.$el.previousElementSibling.click();
        },

        onOk() {
            this.visible = false;
        },

        onCancel() {
            this.visible = false;
        },

        onKeydown(event) {
            if (event.key === 'Tab') {
                if (event.shiftKey == false) {
                    if (this.findAndFocusNext(this.$cardElements, event.target) == null) {
                        this.visible = false;
                    }
                } else {
                    if (this.findAndFocusPrevious(this.$cardElements, event.target) == null) {
                        this.visible = false;
                    }
                }
                event.preventDefault();
            } else if (event.key === 'Escape') {
                // this.params.api.stopEditing();
            }
        },

        beginEditing() {
            _.delay(() => {
                if (_.isNil(this.$cardElements)) {
                    this.$cardElements = this.findAllElements(this.$refs.card.$el);
                }
                var focused = this.findAndFocusNext(this.$cardElements);
                focused;
            }, 200);
        },

        endEditing() {
            this.$refs.button.$el.focus();
        },

        isPopup() {
            return false;
        }
    },

    watch: {
        visible(newValue) {
            if (newValue === true) {
                this.beginEditing();
            } else {
                this.endEditing();
            }
        }
    },

    render() {
        var _vm = this;
        // var _h = _vm.$createElement;
        // var _c = _vm._self._c || _h;
        // _g: bindObjectListener()

        function activatorScopedSlot() {
            // function appendScopedSlot() {
            //     return {
            //         key: 'prepend',
            //         fn: () => {
            //             return <v-icon color="primary">mdi-pencil-circle-outline</v-icon>;
            //         },
            //         proxy: true
            //     };
            // }

            function defaultSlot() {
                return _vm.params.colDef.cellRendererParams.render(_vm.scopedData);
            }

            return {
                key: 'activator',
                fn: ({ on, attrs }) => {
                    return [
                        <div class="d-flex align-center px-3 activator" style="justify-content: space-between !important;" on={on} attrs={attrs}>
                            {defaultSlot()}
                            <v-spacer />
                            <v-btn
                                small
                                ref="button"
                                icon
                                on={{
                                    'click.prevent': () => {
                                        _.defer(() => _vm.$el.previousElementSiblisng.click());
                                    }
                                }}
                            >
                                <v-icon small color="primary">
                                    mdi-pencil
                                </v-icon>
                            </v-btn>
                        </div>
                    ];
                }
            };
        }

        var scopedSlots = _vm._u([activatorScopedSlot()]);

        function defaultSlots() {
            var content = _.get(_vm.params.colDef, 'cellEditorParams.render', null);
            if (content === null) {
                return <span>empty</span>;
            } else {
                return content(_vm.scopedData);
            }
        }
        // close-on-click={false}

        // return (
        //     <v-card>
        //         <v-card-title>AAA</v-card-title>
        //     </v-card>
        // );

        // return (
        //     <v-card width={300}>
        //         <v-card-title>AAA</v-card-title>
        //         <v-card-text>Hello World</v-card-text>
        //     </v-card>
        // );

        return (
            <v-menu
                scopedSlots={scopedSlots}
                close-on-content-click={false}
                fixed
                bottom
                offset-y
                value={_vm.visible}
                on={{
                    input: (visible) => (_vm.visible = visible)
                }}
            >
                <v-card
                    ref="card"
                    on={{
                        keydown: _vm.onKeydown
                    }}
                >
                    <v-card-text>{defaultSlots()}</v-card-text>
                </v-card>
            </v-menu>
        );

        // <v-card-actions>
        //     <v-spacer />
        //     <v-btn rounded dense text color="primary">
        //         确定
        //     </v-btn>
        //     <v-btn rounded dense text>
        //         取消
        //     </v-btn>
        // </v-card-actions>;
    }
};
</script>
