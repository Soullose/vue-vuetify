<template>
    <div>AA</div>
</template>

<script>
import GridCellEditor from './GridCellEditor';

export default {
    mixins: [GridCellEditor],

    // on={{
    //     'click.prevent': () => {
    //         _.defer(() => _vm.$el.previousElementSiblisng.click());
    //     }
    // }}

    render() {
        return (
            <div class="d-flex align-center px-3 activator" style="justify-content: space-between !important;">
                <div>AAA</div>
                <v-btn small ref="button" icon>
                    <v-icon small color="primary">
                        mdi-pencil
                    </v-icon>
                </v-btn>
            </div>
        );
    }
};
</script>
