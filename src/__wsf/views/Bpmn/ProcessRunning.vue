<template>
    <x-app>
        <v-row no-gutters>
            <x-col-panel no-border class="ml-n3">
                <v-toolbar slot="header" dense flat>
                    <v-btn text color="primary">停用</v-btn>
                    <v-btn text color="primary">恢复</v-btn>
                    <v-btn text color="primary" @click="check">查看</v-btn>
                    <v-btn text color="primary" @click="deleteProcessInstance">删除</v-btn>
                </v-toolbar>
                <x-grid :ds="dsProcessRunning" @row-selected="handleRowSelected" idField="taskId">
                    <x-grid-column headerName="流程名称" field="processName" />
                    <x-grid-column headerName="流程ID" field="processDefinitionId" />
                    <x-grid-column headerName="流程实例" field="taskId" />
                    <x-grid-column headerName="发起者" field="initiator" width="100" />
                    <x-grid-column headerName="当前任务" field="actName" />
                    <x-grid-column headerName="办理人" field="assignee" width="100" />
                    <x-grid-column headerName="流程开始时间" field="startTime" />
                    <x-grid-column headerName="是否挂起" :valueGetter="(data) => (data.suspended ? '是' : '否')" />
                </x-grid>
            </x-col-panel>
        </v-row>
    </x-app>
</template>
<script>
export default {
    data: () => {
        return { rowSelected: null };
    },
    datastores: {
        dsProcessRunning: 'workflow/queryRunningProcessInstance'
    },
    methods: {
        handleRowSelected(event) {
            var _vm = this;
            _vm.rowSelected = event.data;
        },
        deleteProcessInstance() {
            var _vm = this;
            var data = _vm.rowSelected;
            var processInstanceId = data.processInstanceId;
            console.log('data', data);
            console.log('data', processInstanceId);
            _vm.$http
                .url('workflow/deleteProcessInstance')
                .params({ processInstanceId: processInstanceId })
                .get()
                .then((v) => {
                    console.log(v.data);
                    if (v.data) {
                        _vm.$datastores.dsProcessRunning.retrieve();
                    }
                });
        },
        check() {
            var _vm = this;
            var processDefinitionId = _vm.rowSelected.processDefinitionId;
            var processInstanceId = _vm.rowSelected.processInstanceId;
            _vm.$http
                .url('workflow/check')
                .params({ processInstanceId: processInstanceId, processDefinitionId: processDefinitionId })
                .get()
                .then((response) => {
                    console.table(response.data);
                    var data = response.data;
                    var bpmnModel = data.bpmnModel;
                    var translationProcessVos = data.translationProcessVos;
                    var finishedFlowElement = data.finishedFlowElement;
                    var sequenceFlow = data.sequenceFlow;
                    var currentFlowElement = data.currentFlowElement;
                    _vm.$dialog.open(
                        import('./checkDialog.vue'),
                        {
                            xmlModel: bpmnModel,
                            translationProcessVOS: translationProcessVos,
                            finishedFlowElement: finishedFlowElement,
                            sequenceFlow: sequenceFlow,
                            currentFlowElement: currentFlowElement
                        },
                        {
                            ok: () => {},
                            cancel: () => {
                                console.log('');
                            }
                        }
                    );
                });
        }
    }
};
</script>
