<template>
    <div>
        <v-data-table dense :headers="userTaskHeaders" :items="userTaskListenersList" hide-default-footer class="elevation-1">
            <template v-slot:[`item.actions`]="{ item }">
                <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
            </template>
        </v-data-table>
        <v-divider class="mx-4"></v-divider>
        <v-btn block color="primary" @click="openUserTaskListenerForm(null)">添加监听器</v-btn>
    </div>
</template>
<script>
import { initListenerType, isTaskListener } from './utilSelf';
export default {
    name: 'UserTaskListeners',
    props: { bpmnModeler: Object, bpmnElement: Object, businessObject: Object },
    data: () => {
        return {
            userTaskHeaders: [
                { text: '事件类型', value: 'event' },
                { text: '监听器类型', value: 'listenerType' },
                { text: '操作', value: 'action', sortable: false }
            ],
            bpmnUserTaskListeners: [],
            userTaskListenersList: []
        };
    },
    watch: {
        businessObject: {
            immediate: true,
            handler(val) {
                val && this.$nextTick(() => this.resetListenersList());
            }
        }
    },
    methods: {
        resetListenersList() {
            console.log('resetListenersList');
            var _vm = this;
            _vm.bpmnUserTaskListeners = _vm.businessObject?.extensionElements?.values?.filter((ex) => ex.$type === 'flowable:TaskListener') ?? [];
            _vm.userTaskListenersList = _vm.bpmnUserTaskListeners.map((listener) => initListenerType(listener));
        },
        openUserTaskListenerForm(v) {
            var _vm = this;
            if (v == null) {
                console.log('新增');
                _vm.$dialog.open(
                    import('./dialog/UserTaskListenersDialog.vue'),
                    {},
                    {
                        ok(v) {
                            console.log(v);
                            _vm.userTaskListenersList.push(v);
                            _vm.saveUserTaskListener(v);
                        }
                    }
                );
            }
        },
        saveUserTaskListener(data) {
            var _vm = this;
            const userListenerObj = Object.create(null);
            userListenerObj.class = data.class;
            userListenerObj.event = data.event;
            const userListenerObject = _vm.bpmnModeler.bpmnFactory.create(`${isTaskListener(true)}`, userListenerObj);
            _vm.bpmnUserTaskListeners.push(userListenerObject);
            const extensions = _vm.bpmnModeler.bpmnFactory.create('bpmn:ExtensionElements', { values: _vm.bpmnUserTaskListeners });
            _vm.bpmnModeler.modeling.updateProperties(_vm.bpmnElement, {
                extensionElements: extensions
            });
        },
        deleteItem() {}
    }
};
</script>
