<template>
    <x-dialog title="查看" v-bind="$attrs" v-on="$listeners" @ok="ok" @cancel="cancel" fullscreen>
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
                    <v-timeline-item v-for="(item, i) in translationProcessVOS" :key="i" :color="item.endTime != '' ? '#d7f6ce' : '#cff5fa'" fill-dot small>
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
    </x-dialog>
</template>
<script>
import { Viewer } from '@/boost-vue/components/Bpmn/viewer';
export default {
    components: { Viewer },
    props: {
        xmlModel: { type: String, requrired: true },
        translationProcessVOS: null,
        finishedFlowElement: { type: Array, requrired: true },
        currentFlowElement: { type: String, requrired: true },
        sequenceFlow: { type: Array, requrired: true }
    },
    data() {
        return { complateMess: '', assignee2: '' };
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
