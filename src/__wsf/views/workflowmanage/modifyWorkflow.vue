<template>
    <x-dialog title="修改" width="600" v-bind="$attrs" v-on="$listeners" @ok="ok" @cancel="cancel" ok-text="确认" cancel-text="取消">
        <v-form>
            <v-row dense>
                <v-col cols="6">
                    <v-text-field label="流程名称" v-model="this.formData.bpmnName" />
                </v-col>
                <v-col cols="6">
                    <v-text-field label="流程编号" v-model="this.formData.bpmnKey" />
                </v-col>
                <v-col cols="6">
                    <v-text-field label="表单路径" v-model="this.formData.path" />
                </v-col>

                <v-col cols="6">
                    <v-text-field label="版本" v-model="this.formData.bpmnVersion" />
                </v-col>
            </v-row>
        </v-form>
    </x-dialog>
</template>
<script>
export default {
    props: {
        formData: {
            bpmnName: '',
            bpmnKey: '',
            path: '',
            bpmnVersion: ''
        }
    },
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
