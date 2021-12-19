<template>
    <x-dialog title="查看流程信息" v-bind="$attrs" v-on="$listeners" @open="onOpen" @ok="ok" @cancel="cancel" fullscreen>
        <v-row>
            <v-col sm="8">
                <bpmn ref="bpmn" v-model="xmlModel" :readonly="readonly" :taskDefinitionKey="taskDefinitionKey" :watchonly="watchonly" />
            </v-col>
            <v-col sm="4">
                <v-timeline v-if="timeLine !== ''">
                    <v-timeline-item :key="tl.taskId" v-for="tl in timeLine">
                        <span slot="opposite">时间:{{ tl.startTime }}</span>
                        <v-card class="elevation-2">
                            <v-card-title class="headline">{{ tl.taskName }}</v-card-title>
                            <v-card-text>{{ tl.assignee }} {{ tl.endTime == '' ? '进行中' : '已完成' }}</v-card-text>
                        </v-card>
                    </v-timeline-item>
                </v-timeline>
            </v-col>
        </v-row>
    </x-dialog>
</template>
<script>
import _ from 'lodash';
import { Bpmn } from '@/boost-vue/components/Bpmn';
export default {
    components: { Bpmn },
    props: {
        BpmnKey: { type: String },
        assignee: { type: String },
        readonly: { type: Boolean },
        watchonly: { type: Boolean }
    },
    data: function () {
        return {
            timeLine: [],
            xmlModel: '',
            taskDefinitionKey: null
        };
    },
    methods: {
        ok() {
            this.$emit('close');
        },
        cancel() {
            this.$emit('close');
        },
        onOpen() {
            var _vm = this;

            this.$http
                .url('workflow/holidays/searchBpmnLinkAssignee')
                .params({ BpmnKey: this.BpmnKey, assignee: this.assignee })
                .get()
                .then((response) => {
                    console.log('ddd', typeof response.data.list);

                    console.log(_.isArray(response.data.list));
                    _vm.timeLine = response.data.list;
                    _vm.xmlModel = response.data.xml;
                    // _vm.readonly = true;
                    // _vm.watchonly = false;
                    _vm.taskDefinitionKey = response.data.list;
                });
        }
    }
};
</script>
