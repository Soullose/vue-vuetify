<template>
    <x-dialog title="保存流程设计图" v-bind="$attrs" v-on="$listeners" @open="onOpen" @ok="ok" @cancel="cancel" width="600">
        <v-form>
            <v-row dense>
                <v-col cols="6">
                    <v-text-field label="流程编号" v-model="formData.key" />
                </v-col>
                <v-col cols="6">
                    <v-text-field label="流程名称" v-model="formData.name" />
                </v-col>
                <v-col cols="12">
                    <v-textarea solo label="流程描述" v-model="formData.description" />
                </v-col>
            </v-row>
        </v-form>
    </x-dialog>
</template>
<script>
export default {
    data: () => ({
        formData: { key: '', name: '' }
    }),
    methods: {
        resetForm() {
            this.formData = {
                key: '',
                name: '',
                xml: null,
                typeId: '',
                description: ''
            };
        },
        onOpen() {
            this.resetForm();
        },
        ok() {
            this.$emit('close', { code: 'ok', data: this.formData });
        },
        cancel() {
            this.$emit('close');
        }
    }
};
</script>
