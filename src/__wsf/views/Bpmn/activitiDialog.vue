<template>
    <x-dialog title="测试提交" v-bind="$attrs" v-on="$listeners" @ok="ok" @cancel="cancel" fullscreen>
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
                            <template v-if="userTask === true">
                                <v-text-field label="处理人" v-model="assignee2" />
                            </template>
                        </v-col>
                        <v-col cols="12">
                            <v-textarea label="反馈意见" v-model="complateMess" />
                        </v-col>
                    </v-row>
                </v-form>
            </v-tab-item>
            <v-tab-item>
                <v-row>
                    <v-col sm="8">
                        <viewer
                            ref="viewer"
                            v-model="xmlModel"
                            :finishedFlowElement="finishedFlowElement"
                            :currentFlowElement="currentFlowElement"
                            :sequenceFlow="sequenceFlow"
                        />
                    </v-col>
                    <v-col>
                        <v-divider></v-divider>
                        <v-timeline align-top>
                            <v-timeline-item
                                v-for="(item, i) in translationProcessVOS"
                                :key="i"
                                :color="item.endTime != '' ? '#d7f6ce' : '#cff5fa'"
                                fill-dot
                                small
                            >
                                <v-card :color="item.endTime != '' ? '#d7f6ce' : '#cff5fa'" dark small>
                                    <v-card-title style="color: #000000">{{ item.name }}</v-card-title>
                                    <v-card-text>
                                        <div style="color: #000000">处理人:{{ item.assignee }}</div>
                                        <div style="color: #000000">状态:{{ item.processResult }}</div>
                                        <div style="color: #000000">审批意见:{{ item.comment == null ? '无' : item.comment }}</div>
                                        <div style="color: #000000">开始时间:{{ item.startTime }}</div>
                                        <div style="color: #000000">结束时间:{{ item.endTime }}</div>
                                        <div style="color: #000000">耗时:{{ item.hour }}小时</div>
                                    </v-card-text>
                                </v-card>
                            </v-timeline-item>
                        </v-timeline>
                    </v-col>
                </v-row>
            </v-tab-item>
        </v-tabs>
    </x-dialog>
</template>
<script>
// import { Bpmn } from '@/boost-vue/components/Bpmn';
import { Viewer } from '@/boost-vue/components/Bpmn/viewer';
export default {
    components: { Viewer },
    props: {
        processName: null,
        xmlModel: { type: String, requrired: true },
        translationProcessVOS: null,
        finishedFlowElement: { type: Array, requrired: true },
        currentFlowElement: { type: String, requrired: true },
        sequenceFlow: { type: Array, requrired: true },
        userTask: null
    },
    // created() {
    //     this.dsTransl.setData(this.translationProcessVOS);
    // },
    // datastores: {
    //     dsTransl: null
    // },
    data() {
        return { complateMess: '', assignee2: '' };
    },
    methods: {
        ok() {
            this.$emit('close', { code: 'ok', data: { data: { complateMess: this.complateMess, assignee2: this.assignee2 } } });
        },
        cancel() {
            this.$emit('close');
        }
    }
};
</script>
