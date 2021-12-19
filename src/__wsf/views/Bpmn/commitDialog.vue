<template>
    <x-dialog title="测试提交" v-bind="$attrs" v-on="$listeners" @open="onOpen" @ok="ok" @cancel="cancel" width="600">
        <v-form>
            <v-row dense>
                <v-col cols="12">
                    <v-text-field label="ID" v-model="this.id" />
                </v-col>
                <v-col cols="12">
                    <v-text-field label="审批人" v-model="userId" />
                </v-col>
            </v-row>
        </v-form>
    </x-dialog>
</template>
<script>
export default {
    data: () => ({
        userId: ''
    }),
    props: { id: null },
    methods: {
        ok() {
            this.$emit('close', { code: 'ok', data: { id: this.id, user: this.userId } });
        },
        cancel() {
            this.$emit('close');
        },
        onOpen() {}
    }
};
</script>
