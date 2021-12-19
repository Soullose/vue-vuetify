<template>
    <x-dialog title="查看流程图" v-bind="$attrs" v-on="$listeners" @ok="ok" @cancel="cancel" fullscreen>
        <v-row>
            <v-col sm="12">
                <bpmn ref="bpmn" v-model="xmlModel" readonly="readonly" />
            </v-col>
        </v-row>
    </x-dialog>
</template>
<script>
import { Bpmn } from '@/boost-vue/components/Bpmn';
export default {
    components: { Bpmn },
    props: {
        xmlModel: { type: String, requrired: true },
        readonly: { type: Boolean, default: false }
    },
    methods: {
        cancel() {
            this.$emit('close');
        },
        ok() {
            this.$emit('close');
        }
    }
};
</script>
