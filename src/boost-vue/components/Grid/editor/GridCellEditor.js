import _ from 'lodash';

function findAllChildren(el, elements) {
    _.each(el.children, (child) => {
        elements.push(child);
        findAllChildren(child, elements);
    });
}

export default {
    name: 'XGridCellEditor',
    data() {
        return {
            data: {}
        };
    },

    computed: {
        field() {
            return _.get(this, 'params.colDef.field', null);
        },
        value() {
            var valueGetter = _.get(this.params.colDef, 'valueGetter', null);
            return _.isFunction(valueGetter) ? valueGetter(this) : _.get(this.data, this.field, 'NaN');
        },
        rowIndex() {
            return this.params.rowIndex;
        },
        scopedData() {
            return {
                data: this.data,
                value: this.value,
                rowIndex: this.rowIndex
            };
        }
    },

    created() {
        this.data = _.clone(this.params.data);
    },

    mounted() {
        _.defer(this.handleMounted);
    },

    methods: {
        getValue() {
            return this.data;
        },

        handleMounted() {
            _.defer(() => {
                this.$elements = [];
                findAllChildren(this.$el, this.$elements);

                var focused = _.find(this.$elements, (element) => {
                    element.focus();
                    return document.activeElement == element;
                });

                if (!_.isNil(focused) && _.toLower(focused.nodeName) == 'input') {
                    focused.select();
                }
            });
        },

        findAllElements(parent) {
            if (_.isNil(parent)) {
                parent = this.$el;
            }

            var elements = [];
            findAllChildren(parent, elements);
            return elements;
        },

        findAndFocusNext(elements, el) {
            var focused = _.find(
                elements,
                (element) => {
                    element.focus();
                    return document.activeElement == element;
                },
                _.isNil(el) ? 0 : _.indexOf(elements, el) + 1
            );

            if (!_.isNil(focused) && _.toLower(focused.nodeName) == 'input') {
                focused.select();
            }

            return focused;
        },

        findAndFocusPrevious(elements, el) {
            var focused = _.findLast(
                elements,
                (element) => {
                    element.focus();
                    return document.activeElement == element;
                },
                _.indexOf(elements, el) - 1
            );

            if (!_.isNil(focused) && _.toLower(focused.nodeName) == 'input') {
                focused.select();
            }

            return focused;
        },

        autoClick(selector) {
            console.log(this.$el.querySelector(selector));
            this.$el.querySelector(selector).click();
        }
    },

    render() {
        var _vm = this;

        var customEditor = _vm.params.colDef.cellEditorParams.render({
            data: _vm.data
        });

        return customEditor;
    }
};
