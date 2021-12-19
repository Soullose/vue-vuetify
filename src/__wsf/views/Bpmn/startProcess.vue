<template>
    <x-dialog title="开始启动流程" v-bind="$attrs" v-on="$listeners" @ok="ok" @cancel="cancel" fullscreen>
        <v-tabs vertical>
            <v-tab>
                <v-icon left>mdi-account-outline</v-icon>
                任务处理
            </v-tab>
            <v-tab>
                <v-icon left>mdi-calendar-check-outline</v-icon>
                流程图
            </v-tab>
            <v-tab-item>
                <v-form>
                    <v-row dense>
                        <v-col cols="12">
                            <v-text-field label="流程名称" v-model="processName" readonly />
                        </v-col>
                        <v-col cols="12">
                            <v-text-field label="处理人" v-model="candidateUsers" />
                        </v-col>
                    </v-row>
                </v-form>
            </v-tab-item>
            <v-tab-item>
                <v-row>
                    <v-col>
                        <bpmn ref="bpmn" v-model="bpmnModel" readonly="readonly" />
                    </v-col>
                </v-row>
            </v-tab-item>
        </v-tabs>
    </x-dialog>
</template>
<script>
import { Bpmn } from '@/boost-vue/components/Bpmn';
export default {
    components: { Bpmn },
    props: {
        processName: null,
        candidateUsers: null,
        userTask: null,
        bpmnModel: { type: String, requrired: true },
        readonly: { type: Boolean, default: true }
    },
    data() {
        return { complateMess: '', assignee2: '' };
    },
    methods: {
        ok() {
            this.$emit('close', { code: 'ok', data: { candidateUsers: this.candidateUsers } });
        },
        cancel() {
            this.$emit('close');
        }
    }
};
</script>
