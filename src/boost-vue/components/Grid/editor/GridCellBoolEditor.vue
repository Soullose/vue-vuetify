<template>
    <div tabindex="1" @click.prevent="print">
        <v-switch dense v-model="data[field]" />
    </div>
</template>

<script>
import GridCellEditor from './GridCellEditor';

export default {
    mixins: [GridCellEditor],
    methods: {
        print() {
            console.log('xxxxxxxxxxxxxxxxxx');
        }
    }
};
</script>
