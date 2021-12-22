<template>
    <div>
        <v-data-table dense :headers="elementHeaders" :items="elementListenersList" hide-default-footer class="elevation-1">
            <template v-slot:[`item.actions`]="{ item }">
                <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
            </template>
        </v-data-table>
        <v-divider class="mx-4"></v-divider>
        <v-btn block color="primary" @click="openElementListenerForm(null)">添加监听器</v-btn>
    </div>
</template>
<script>
import { initListenerType, isTaskListener } from './utilSelf';
export default {
    name: 'ElementListeners',
    props: { bpmnModeler: Object, bpmnElement: Object, businessObject: Object },
    data: () => {
        return {
            elementHeaders: [
                { text: '事件类型', value: 'event' },
                { text: '监听器类型', value: 'listenerType' },
                { text: '操作', value: 'action', sortable: false }
            ],
            bpmnElementListeners: [],
            elementListenersList: []
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
            _vm.bpmnElementListeners = _vm.businessObject?.extensionElements?.values?.filter((ex) => ex.$type === 'flowable:ExecutionListener') ?? [];
            _vm.elementListenersList = _vm.bpmnElementListeners.map((listener) => initListenerType(listener));
        },
        openElementListenerForm(v) {
            var _vm = this;
            if (v == null) {
                console.log('新增');
                _vm.$dialog.open(
                    import('./dialog/ElementListenersDialog.vue'),
                    {},
                    {
                        ok(v) {
                            console.log(v);
                            _vm.elementListenersList.push(v);
                            _vm.saveElementListener(v);
                        }
                    }
                );
            }
        },
        saveElementListener(data) {
            var _vm = this;
            const elementListenerObj = Object.create(null);
            elementListenerObj.class = data.class;
            elementListenerObj.event = data.event;
            const elementListenerObject = _vm.bpmnModeler.bpmnFactory.create(`${isTaskListener(false)}`, elementListenerObj);
            _vm.bpmnElementListeners.push(elementListenerObject);
            const extensions = _vm.bpmnModeler.bpmnFactory.create('bpmn:ExtensionElements', { values: _vm.bpmnElementListeners });
            _vm.bpmnModeler.modeling.updateProperties(_vm.bpmnElement, {
                extensionElements: extensions
            });
        },
        deleteItem(item) {
            const index = this.elementListenersList.indexOf(item);
            console.log('index', index);
            confirm('Are you sure you want to delete this item?') && this.elementListenersList.splice(index, 1);
        }
    }
};
</script>
