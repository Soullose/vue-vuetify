<template>
    <x-app>
        <v-row no-gutters>
            <x-col-panel no-border class="ml-n3">
                <v-toolbar slot="header" dense flat>
                    <v-col cols="2" sm="6" md="3">
                        <v-text-field dense label="请输入名称" v-model="name"></v-text-field>
                    </v-col>
                    <v-btn text color="primary" @click="query">查询</v-btn>
                    <v-btn text color="primary" @click="claim">认领</v-btn>
                    <v-btn text color="primary" @click="activiti">流转</v-btn>
                    <v-btn text color="primary" @click="check">查看</v-btn>
                </v-toolbar>
                <x-grid :ds="dsProcessRunning" @row-selected="handleRowSelected" idField="taskId">
                    <x-grid-column headerName="流程编号" field="processDefaultId" />
                    <x-grid-column headerName="当前环节" field="activitiName" />
                    <x-grid-column headerName="办理人" field="assignee" />
                    <x-grid-column headerName="任务节点ID" field="activitiKey" width="150" />
                    <x-grid-column headerName="流程名称" field="processName" />
                    <x-grid-column headerName="流程实例" field="processInstanceId" width="300" />
                    <x-grid-column headerName="发起人" field="startUser" width="100" />
                    <x-grid-column headerName="开始时间" field="startTime" width="130" />
                </x-grid>
            </x-col-panel>
        </v-row>
    </x-app>
</template>
<script>
export default {
    data: () => {
        return { name: '', rowSelected: null };
    },
    datastores: {
        dsProcessRunning: { retrieveUrl: 'workflow/queryMyTask?userId={userId}', autoLoad: false }
    },
    methods: {
        handleRowSelected(event) {
            var _vm = this;
            _vm.rowSelected = event.data;
        },
        query() {
            var _vm = this;
            _vm.$datastores.dsProcessRunning.retrieve({ userId: _vm.name });
        },
        claim() {
            var _vm = this;
            var data = _vm.rowSelected;
            var name = _vm.name;
            var taskId = data.taskId;
            console.log('data', data);
            console.log('name', name);
            _vm.$http
                .url('workflow/claim')
                .params({ taskId: taskId, user: name })
                .get()
                .then((v) => {
                    if (v.data) {
                        _vm.$datastores.dsProcessRunning.retrieve();
                    }
                });
        },
        activiti() {
            var _vm = this;
            var flowElementId = _vm.rowSelected.activitiKey;
            var processDefaultId = _vm.rowSelected.processDefaultId;
            var processInstanceId = _vm.rowSelected.processInstanceId;
            this.$http
                .url('workflow/queryHisActInstance')
                .params({ flowElementId: flowElementId, processDefinitionId: processDefaultId, processInstanceId: processInstanceId })
                .get()
                .then((response) => {
                    var data = response.data;
                    console.log('finishedFlowElement', data.finishedFlowElement);
                    console.log('currentFlowElement', data.currentFlowElement);
                    _vm.$dialog.open(
                        import('./activitiDialog.vue'),
                        {
                            processName: _vm.rowSelected.processName + '：' + _vm.rowSelected.activitiName,
                            xmlModel: data.bpmnModel,
                            translationProcessVOS: data.translationProcessVOS,
                            finishedFlowElement: data.finishedFlowElement,
                            currentFlowElement: data.currentFlowElement,
                            userTask: data.userTask,
                            sequenceFlow: data.sequenceFlow
                        },
                        {
                            ok: (v) => {
                                console.log('bpmnTypeokxxx', v.data);
                                this.$http
                                    .url('workflow/commit')
                                    .data({ processInstanceId: _vm.rowSelected.processInstanceId, formData: null, comment: v.data.complateMess })
                                    .post()
                                    .then((response) => {
                                        console.log(response);
                                    });
                            },
                            cancel: () => {
                                console.log('');
                            }
                        }
                    );
                });
        },
        check() {
            var _vm = this;
            var processDefinitionId = _vm.rowSelected.processDefaultId;
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
