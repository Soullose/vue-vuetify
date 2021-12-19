<template>
    <x-app title="流程测试">
        <v-row no-gutters>
            <x-col-panel no-border>
                <v-toolbar slot="header" dense flat>
                    <v-btn text color="primary" @click="create">新增</v-btn>
                    <v-btn text color="primary" @click="commit">提交</v-btn>
                    <v-btn text color="primary" @click="remove">删除</v-btn>
                    <v-btn text color="primary" @click="watch">查看</v-btn>
                    <v-btn text color="primary" @click="searchStart">查询发起</v-btn>
                    <v-btn text color="primary" @click="search">查询代办</v-btn>
                </v-toolbar>
                <x-grid :ds="dsWorkflow" @row-selected="handleRowSelected">
                    <x-grid-column field="people" headerName="出差人" width="120"></x-grid-column>
                    <x-grid-column field="depname" headerName="部门名称" width="120"></x-grid-column>
                    <x-grid-column field="name" headerName="项目名称" width="120"></x-grid-column>
                    <x-grid-column field="path" headerName="目的地" width="120"></x-grid-column>
                    <x-grid-column field="" headerName="出发时间" width="120"></x-grid-column>
                    <x-grid-column field="" headerName="天数" width="80"></x-grid-column>
                    <x-grid-column field="" headerName="工具" width="100"></x-grid-column>
                    <x-grid-column field="" headerName="流程状态" width="120"></x-grid-column>
                </x-grid>
            </x-col-panel>
        </v-row>
    </x-app>
</template>
<script>
import _ from 'lodash';
export default {
    datastores: {
        dsWorkflow: {
            retrieveUrl: 'workflow/holidays/getAllHoliday',
            autoload: true
        }
    },
    data() {
        return { rowSelected: null };
    },
    methods: {
        handleRowSelected(event) {
            this.rowSelected = event.data;
        },
        create() {
            console.log('创建');
            this.$dialog.open(
                import('./CreateHoliday.vue'),
                {},
                {
                    ok: (data) => {
                        console.log('CreateHoliday', data);
                        this.$http
                            .url('workflow/holidays/saveData')
                            .data(data)
                            .post()
                            .then((response) => {
                                console.log(response);
                                this.dsWorkflow.add(response.data, false);
                            });
                    },
                    cancel: () => {
                        console.log('CreateHolidaycancel');
                    }
                }
            );
        },
        commit() {
            var _vm = this;
            _vm.$http
                .url('workflow/startProcessBef')
                .params({ processDefinitionId: 'Process_1637830352905:1:1468063762447384576' })
                .get()
                .then((v) => {
                    console.log('开始流程前查询', v.data);
                    var data = v.data;
                    var bpmnModel = data.bpmnModel;
                    var userTask = data.userTask;
                    var candidateUsers = data.candidateUsers;
                    var processName = data.processDefinitionName;
                    _vm.$dialog.open(
                        import('./startProcess.vue'),
                        { processName: processName, candidateUsers: candidateUsers, userTask: userTask, bpmnModel: bpmnModel },
                        {
                            ok: (v) => {
                                console.log('id', v);
                                var candidateUsers = v.candidateUsers;
                                var b = _.isArray(candidateUsers);
                                console.log(b);
                                if (!b) {
                                    candidateUsers = candidateUsers.split(',');
                                    console.log(candidateUsers);
                                }
                                _vm.$http
                                    .url('workflow/startProcess')
                                    .data({
                                        deploymentId: '1468063761314922496',
                                        applyUserId: '赵一',
                                        candidateUsers: candidateUsers,
                                        formData: {
                                            name: '测试111',
                                            destination: '上海',
                                            count: '3000'
                                        }
                                    })
                                    .post();
                            }
                        }
                    );
                });
            // console.log('commit提交', _vm.rowSelected.id);
            // this.$dialog.open(
            //     import('./commitDialog.vue'),
            //     { id: _vm.rowSelected.id },
            //     {
            //         ok: (v) => {
            //             console.log('id', v);
            //             this.$http
            //                 .url('workflow/startProcess')
            //                 .params({ id: '6c79d480-4354-11ec-bc7e-380025e5ff7e', userId: v.user, applyUserId: _vm.rowSelected.people })
            //                 .get();
            //         }
            //     }
            // );
        },
        remove() {
            console.log('移除数据');
            var _vm = this;
            this.$http
                .url('workflow/holidays/delete')
                .params({ id: this.rowSelected.id })
                .get()
                .then(() => {
                    _vm.$datastores.dsWorkflow.retrieve();
                });
            // this.$dialog.open(
            //     import('./commitDialog.vue'),
            //     {},
            //     {
            //         ok: (id) => {
            //             console.log('id', id);
            //         }
            //     }
            // );
        },
        watch() {
            console.log('查看');
            this.$dialog.open(
                import('./WatchHolidayBpmn.vue'),
                { BpmnKey: 'testholidaylistener', assignee: '王思凡', readonly: true, watchonly: false },
                {
                    ok: () => {
                        console.log('xxx');
                    }
                }
            );
            // });
        },
        searchStart() {
            this.$http
                .url('workflow/holidays/queryStartBy')
                .params({ userId: 'wangsifan' })
                .get()
                .then((response) => {
                    console.log('queryStartBy-data', response.data);
                });
        },
        search() {
            this.$http
                .url('workflow/holidays/tasks')
                .params({ userId: '王思凡' })
                .get()
                .then((response) => {
                    console.log('tasks-data', response.data);
                });
        }
    }
};
</script>
