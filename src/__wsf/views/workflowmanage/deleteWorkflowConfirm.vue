<template>
    <x-dialog title="删除" width="300" v-bind="$attrs" v-on="$listeners" @ok="ok" @cancel="cancel" ok-text="确认" cancel-text="取消">
        <v-subheader>是否删除 {{ this.workflowManageName }}</v-subheader>
    </x-dialog>
</template>
<script>
export default {
    props: { workflowManageName: null },
    methods: {
        ok() {
            this.$emit('close', { code: 'ok' });
            // this.$emit('close', { code: 'ok', data: value });
        },
        cancel() {
            this.$emit('close');
            // this.$emit('close', { code: 'ok' });
        }
    }
};
</script>
