<template>
    <span>{{ text }}</span>
</template>

<script>
import _ from 'lodash';
export default {
    computed: {
        text() {
            var items = _.get(this, 'params.colDef.cellRendererParams.items', null);
            if (items === null) {
                items = _.get(this, 'params.colDef.cellEditorParams.items', []);
            }

            if (_.isArray(items)) {
                return 'AAA';
            } else {
                var value = this.params.value;
                return _.get(items, value, value);
            }
        }
    }
};
</script>
