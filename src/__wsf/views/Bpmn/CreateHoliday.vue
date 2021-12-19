<template>
    <x-dialog title="请假申请单" v-bind="$attrs" v-on="$listeners" @open="onOpen" @ok="ok" @cancel="cancel" width="600">
        <v-form>
            <v-row dense>
                <v-col cols="6">
                    <v-text-field label="出差人" v-model="formData.people" />
                </v-col>
                <v-col cols="6">
                    <v-text-field label="部门名称" v-model="formData.depname" />
                </v-col>
                <v-col cols="6">
                    <v-text-field label="项目名称" v-model="formData.name" />
                </v-col>

                <v-col cols="6">
                    <v-text-field label="目的地" v-model="formData.path" />
                </v-col>
            </v-row>
        </v-form>
    </x-dialog>
</template>
<script>
export default {
    data: () => ({
        formData: {
            people: '',
            depname: '',
            name: '',
            path: ''
        }
    }),
    methods: {
        resetForm() {
            this.formData = {
                people: '',
                depname: '',
                name: '',
                path: ''
            };
        },
        onOpen() {
            this.resetForm();
        },
        ok() {
            console.log('确认事件', this.initData);
            console.log('formData', this.formData);
            this.$emit('close', { code: 'ok', data: this.formData });
        },
        cancel() {}
    }
};
</script>
