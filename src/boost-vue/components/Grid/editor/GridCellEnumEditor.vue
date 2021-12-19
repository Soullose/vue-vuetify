<template>
    <v-select :items="items" v-model="data[field]" solo dense hide-details flat autofocus :menu-props="{ bottom: true, offsetY: true }" />
</template>

<script>
import _ from 'lodash';
import GridCellEditor from './GridCellEditor';

export default {
    mixins: [GridCellEditor],

    mounted() {
        _.defer(() => {
            this.$el.querySelector('.v-menu').click();
        });
    },

    computed: {
        items() {
            var items = _.get(this, 'params.colDef.cellEditorParams.items', null);
            if (items === null) {
                items = _.get(this, 'params.colDef.cellRendererParams.items', []);
            }
            return _.isObject(items) ? _.map(items, (value, key) => ({ value: key, text: value })) : items;
        }
    },

    methods: {
        getValue() {
            return _.pick(this.data, this.field);
        },

        handleMounted() {
            this.autoClick('.v-menu');
        },

        handleKeydown(event) {
            if (event.key === 'Tab') {
                if (event.shiftKey == false) {
                    if (this.findAndFocusNext(event.target) == null) {
                        this.params.api.tabToNextCell();
                    }
                } else {
                    if (this.findAndFocusPrevious(event.target) == null) {
                        this.params.api.tabToPreviousCell();
                    }
                }
                event.preventDefault();
            }
        }
    }
};
</script>
