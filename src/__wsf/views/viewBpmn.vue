<template>
    <x-app>
        <v-row no-gutters>
            <x-col-panel cols="auto w-lg">
                <v-toolbar slot="header" dense flat>
                    <v-spacer />
                    <v-btn text color="primary" @click="createBpmnType">新增</v-btn>
                    <v-btn text color="primary" @click="modifyBpmnType" :disabled="_.isNil(selectedBpmnType)">修改</v-btn>
                    <v-btn text color="primary" :disabled="_.isNil(selectedBpmnType)">删除</v-btn>
                </v-toolbar>
                <x-list :ds="dsBpmnType" @selected="onSelectedBpmnType" class="py-0" mandatory>
                    <template v-slot:default="{ item }">
                        <v-list-item color="primary">
                            <v-list-item-avatar>
                                <v-icon class="primary lighten-3" dark>mdi-folder-outline</v-icon>
                            </v-list-item-avatar>

                            <v-list-item-content>
                                <v-list-item-title>{{ item.typeName }}</v-list-item-title>
                                <!-- <v-list-item-subtitle>{{ item.code }}</v-list-item-subtitle> -->
                            </v-list-item-content>
                            <!-- <v-list-item-action class="hover-show">
                                <v-btn icon @click="deleteCategory(item)">
                                    <v-icon small color="error lighten-1">mdi-delete-forever-outline</v-icon>
                                </v-btn>
                            </v-list-item-action> -->
                        </v-list-item>
                    </template>
                </x-list>
            </x-col-panel>

            <x-col-panel no-border class="ml-n3">
                <v-toolbar slot="header" dense flat>
                    <v-btn text color="primary" @click="createNewBpmn" :disabled="_.isNil(selectedBpmnType)">新增</v-btn>
                    <v-btn text color="primary" @click="modifyWorkflow" :disabled="_.isNil(rowSelected)">修改</v-btn>
                    <v-btn text color="primary" @click="deleteWorkflow" :disabled="_.isNil(rowSelected)">删除</v-btn>
                    <v-btn text color="primary" @click="designerBpmn" :disabled="_.isNil(rowSelected)">设计</v-btn>
                    <v-btn text color="primary" @click="deployedBpmn" :disabled="_.isNil(rowSelected)">部署</v-btn>
                    <v-btn text color="primary" @click="viewBpmn" :disabled="_.isNil(rowSelected)">查看</v-btn>
                    <!-- <v-btn text color="primary" @click="testView">测试查看</v-btn> -->
                </v-toolbar>
                <x-grid :ds="dsBpmn" @row-selected="handleRowSelected" no-line-num>
                    <x-grid-column headerName="流程名称" field="bpmnName" />
                    <x-grid-column headerName="流程编号" field="bpmnKey" type="object">
                        <!-- <template v-slot:render="{ data }">
                            {{ data.bpmnKey }}
                        </template>

                        <template v-slot:editor="{ data }">
                            <v-text-field v-model="data.bpmnName" />
                            <v-text-field v-model="data.bpmnKey" />
                        </template> -->
                    </x-grid-column>
                    <x-grid-column headerName="部署ID" field="processDefinitionId"></x-grid-column>
                    <x-grid-column headerName="部署情况" width="120" field="deployed" type="object">
                        <template v-slot:render="{ data }">
                            {{ data.processDefinitionId == '' || data.processDefinitionId == null ? '未部署' : '已部署' }}
                        </template>
                    </x-grid-column>
                    <x-grid-column headerName="版本" field="bpmnVersion" width="100"></x-grid-column>
                    <x-grid-column headerName="流程说明" field="description"></x-grid-column>
                    <x-grid-column headerName="表单路径" field="path"></x-grid-column>
                    <x-grid-column headerName="本地路径" field="bpmnLocalPath"></x-grid-column>
                    <x-grid-column headerName="创建时间" field="createDate"></x-grid-column>
                </x-grid>
            </x-col-panel>
        </v-row>
    </x-app>
</template>
<script>
import _ from 'lodash';
import DefaultEmptyXML from '@/boost-vue/components/Bpmn/BpmnFactory';
export default {
    watch: {
        selectedBpmnType(v) {
            console.log('watch', v);
            var _vm = this;
            if (_.isNil(v)) return;
            // _vm.$datastores.dsBpmnType.retrieve({ id: v.id });
            _vm.$datastores.dsBpmn.retrieve({ typeId: v.id });
            _vm.rowSelected = null;
        },
        selectWorkflow(vv) {
            console.log('vv-wewqe', vv);
        }
    },
    // 'workflow/holidays/queryBasicBpmn'
    datastores: {
        dsBpmnType: 'workflow/manager/queryBpmnType',
        dsBpmn: {
            retrieveUrl: 'workflow/manager/queryBpmnByType?typeId={typeId}',
            autoLoad: false
        }
        // dsBpmn: 'workflow/bpmn/queryBpmn'
    },
    data() {
        return {
            selectedItem: 0,
            selectedBpmnType: null,
            selectWorkflow: null,
            rowSelected: null
        };
    },
    methods: {
        deployDisabled() {},
        handleRowSelected(event) {
            console.log('选中数据', event.data);
            this.rowSelected = event.data;
        },
        handleDataAutoLoaded() {
            console.log('handleDataAutoLoaded', this.$datastores.dsBpmnType.data[this.selectedItem]);
            var _vm = this;
            if (_.isNil(this.$datastores.dsBpmnType.data[this.selectedItem])) return;
            _vm.$datastores.dsBpmn.retrieve({ typeId: this.$datastores.dsBpmnType.data[this.selectedItem].id });

            console.log('dsBpmnType', this.$datastores.dsBpmnType.data[this.selectedItem]);
        },
        onSelectedBpmnType(selected) {
            console.log('selected', selected);
            var _vm = this;
            _vm.selectedBpmnType = selected;
        },
        createBpmnType() {
            this.$dialog.open(
                import('./Bpmn/BpmnType.vue'),
                {},
                {
                    bpmnTypeok: (v) => {
                        console.log('bpmnTypeokxxx', v);
                        this.$http
                            .url('workflow/manager/createBpmnType')
                            .params({ name: v })
                            .get()
                            .then((response) => {
                                this.dsBpmnType.add(response.data, false);
                            });
                    },
                    bpmnTypecancel: () => {
                        console.log('bpmnTypeokxxxcancel');
                    }
                }
            );
        },

        modifyBpmnType() {
            this.$http.url('workflow/holidays/path').params({}).get();
            // this.$dialog.open(
            //     import('./ModifySystem'),
            //     {
            //         system: {
            //             name: 'XXXXXXXXXXXXXXxx'
            //         }
            //     },
            //     {
            //         ok: () => {
            //             alert('Modify Completed');
            //         }
            //     }
            // );
        },
        createNewBpmn() {
            this.$dialog.open(
                import('./Bpmn/saveBpmn.vue'),
                {},
                {
                    ok: (v) => {
                        v.typeId = this.selectedBpmnType.id;
                        console.log(v);
                        this.$http
                            .url('workflow/manager/createWorkflowManager')
                            .data(v)
                            .post()
                            .then((response) => {
                                console.log(response.data);
                                this.dsBpmn.add(response.data, false);
                                // this.$http
                                //     .url('workflow/holidays/path')
                                //     .data(response.data)
                                //     .post()
                                //     .then((response) => {
                                //         console.log(response.data);
                                //     });
                            });
                    }
                }
            );
        },
        modifyWorkflow() {
            var _vm = this;
            this.$dialog.open(
                import('./workflowmanage/modifyWorkflow.vue'),
                { formData: _vm.rowSelected },
                {
                    ok: (v) => {
                        console.log(v);
                    }
                }
            );
        },
        deleteWorkflow() {
            var _vm = this;
            console.log('删除选中数据', _vm.rowSelected);
            if (!_.isNil(_vm.rowSelected.deploymentId)) {
                console.log('已部署禁止删除');
                _vm.$alert.warning('已部署禁止删除');
            } else {
                this.$dialog.open(
                    import('./workflowmanage/deleteWorkflowConfirm.vue'),
                    { workflowManageName: _vm.rowSelected.bpmnName },
                    {
                        ok: (v) => {
                            console.log(v);
                        }
                    }
                );
            }
        },
        designerBpmn() {
            var _vm = this;
            console.log('设计流程图');
            // var DefaultEmptyBpmn = DefaultEmptyXML.create(null, null, null, _vm.rowSelected.bpmnName);
            // console.log('DefaultEmptyBpmn', DefaultEmptyBpmn);
            if (_.isNil(_vm.rowSelected.deploymentId)) {
                this.$dialog.open(
                    import('./customModel.vue'),
                    { defProcessName: _vm.rowSelected.bpmnName, defProcessId: _vm.rowSelected.id },
                    {
                        ok(value) {
                            value.workflowId = _vm.rowSelected.id;
                            _vm.$http
                                .url('workflow/manager/designerWorkflow')
                                .data(value)
                                .post()
                                .then((response) => {
                                    console.log(response.data);
                                    this.dsBpmn.modify(_vm.rowSelected, response.data);
                                });
                        }
                    }
                );
            } else {
                this.$http
                    .url('workflow/getXml')
                    .params({ deploymentId: _vm.rowSelected.deploymentId })
                    .get()
                    .then((response) => {
                        console.log('response', response.data);
                        this.$dialog.open(
                            import('./customModel.vue'),
                            { defProcessName: _vm.rowSelected.bpmnName, defProcessId: _vm.rowSelected.id, process: response.data },
                            {
                                ok(value) {
                                    value.workflowId = _vm.rowSelected.id;
                                    _vm.$http
                                        .url('workflow/manager/designerWorkflow')
                                        .data(value)
                                        .post()
                                        .then((response) => {
                                            console.log(response.data);
                                            this.dsBpmn.modify(_vm.rowSelected, response.data);
                                        });
                                }
                            }
                        );
                    });
            }
        },
        //部署工作流
        deployedBpmn() {
            var _vm = this;
            console.log('部署工作流', _vm.rowSelected);
            this.$http
                .url('workflow/deployProcess')
                .params({ id: _vm.rowSelected.id })
                .get()
                .then((response) => {
                    this.dsBpmn.modify(_vm.rowSelected, response.data);
                });
        },
        //查看已经部署的流程图
        viewBpmn() {
            var _vm = this;
            console.log('查看', _vm.$datastores.dsBpmn);
            if (_.isNil(_vm.rowSelected.deploymentId)) {
                console.log('未部署');
                _vm.$alert.warning('未部署');
            } else {
                _vm.$alert.info('已部署');
                this.$http
                    .url('workflow/getXml')
                    .params({ deploymentId: _vm.rowSelected.deploymentId })
                    .get()
                    .then((response) => {
                        console.log('response', response.data);
                        this.$dialog.open(
                            import('./Bpmn/viewBpmnModel.vue'),
                            { xmlModel: response.data, readonly: true },
                            {
                                ok: () => {
                                    console.log('xxx');
                                }
                            }
                        );
                    });
            }
            // this.$http
            //     .url('workflow/holidays/getXml')
            //     .params({ key: 'testholidaylistener' })
            //     .get()
            //     .then((response) => {
            //         console.log('response', response.data);
            //         this.$dialog.open(
            //             import('./Bpmn/viewBpmnModel.vue'),
            //             { xmlModel: response.data, readonly: true },
            //             {
            //                 ok: () => {
            //                     console.log('xxx');
            //                 }
            //             }
            //         );
            //     });
        },
        testView() {
            this.$http
                .url('workflow/holidays/readLocalXml')
                // .params({ key: 'testholidaylistener' })
                .get()
                .then((response) => {
                    console.log('response', response.data);
                    this.$dialog.open(
                        import('./Bpmn/viewBpmnModel.vue'),
                        { xmlModel: response.data, readonly: true },
                        {
                            ok: () => {
                                console.log('xxx');
                            }
                        }
                    );
                });
        }
    }
};
</script>
