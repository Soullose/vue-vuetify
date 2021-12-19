<template>
    <x-dialog title="新增工作流类型" v-bind="$attrs" v-on="$listeners" width="400" @ok="ok" @cancel="cancel" @open="onOpen">
        <v-container>
            <x-form :cols="1">
                <x-form-item>
                    <v-text-field label="类型名称" v-model="formData.name" />
                </x-form-item>
            </x-form>
        </v-container>
    </x-dialog>
</template>

<script>
export default {
    data: () => ({
        formData: { name: '' }
    }),
    methods: {
        resetForm() {
            this.formData = {
                name: ''
            };
        },
        onOpen() {
            this.resetForm();
        },
        cancel() {
            this.$emit('close', { code: 'bpmnTypecancel' });
        },
        ok() {
            this.$emit('close', { code: 'bpmnTypeok', data: this.formData.name });
        }
    }
};
</script>
