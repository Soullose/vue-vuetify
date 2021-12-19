<template>
    <x-dialog scrollable title="预览XML" v-bind="$attrs" v-on="$listeners" @ok="ok" @cancel="cancel" width="900">
        <v-card>
            <highlightjs :code="xmlModel" autodetect :language="language" />
        </v-card>
    </x-dialog>
</template>
<script>
import { highlightjs } from '@/boost-vue/components/Bpmn/highlight';
export default {
    components: { highlightjs },
    props: {
        xmlModel: { type: String, requrired: true },
        language: { type: String, requrired: true }
    },
    methods: {
        ok() {
            this.$emit('close');
        },
        cancel() {
            this.$emit('close');
        }
    }
};
</script>
