<template>
    <x-dialog title="新增工作流" v-bind="$attrs" v-on="$listeners" @open="onopen" @ok="ok" @cancel="cancel" fullscreen ok-text="保存" cancel-text="关闭">
        <v-row>
            <v-col sm="10">
                <bpmn
                    ref="bpmn"
                    v-model="bpmnModel"
                    @xml-imported="imported"
                    @change="BpmnModelxml"
                    @element-click="elementClick"
                    @shape-added="shapeAdded"
                    @redo="redo"
                    @init-finished="initModeler"
                />
            </v-col>
            <v-col sm="2">
                <v-card class="mx-auto" style="margin: 6px 0px 0px 0px">
                    <v-expansion-panels accordion hover tile v-model="panel" multiple>
                        <v-expansion-panel>
                            <v-expansion-panel-header>常规</v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <v-form>
                                    <v-text-field label="节点key" v-model="elementBaseInfo.id" clearable @change="updateBaseInfo('id')" />
                                    <v-text-field label="节点名称" v-model="elementBaseInfo.name" clearable @change="updateBaseInfo('name')" />
                                    <v-textarea
                                        solo
                                        label="流程描述"
                                        v-model="documentation"
                                        @change="updateDocumentation"
                                        :disabled="_.isNil(this.elementObj)"
                                    />
                                    <!-- <v-text-field v-if="processType === 'bpmn:Process'" label="版本标签" v-model="versionTag" /> -->
                                    <!-- <v-switch v-model="isExecutable" label="可执行" class="ma-2"></v-switch> -->
                                    <!-- <v-btn @click="add">添加</v-btn> -->
                                </v-form>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                        <template v-if="processType === 'bpmn:UserTask'">
                            <v-expansion-panel>
                                <v-expansion-panel-header>审核者</v-expansion-panel-header>
                                <v-expansion-panel-content>
                                    <v-select :items="userSelect" label="用户类型" item-text="name" item-value="id" outlined dense @change="select"></v-select>
                                    <template v-if="this.itemSelect != null">
                                        <v-text-field :label="selected" clearable @change="updateElementTask"></v-text-field>
                                    </template>
                                </v-expansion-panel-content>
                            </v-expansion-panel>
                        </template>
                        <template v-if="processType.indexOf('Task') !== -1">
                            <v-expansion-panel>
                                <v-expansion-panel-header>会签配置</v-expansion-panel-header>
                                <v-expansion-panel-content>
                                    <element-multi-instance :bpmn-modeler="bpmnInstances" :bpmn-element="element" />
                                </v-expansion-panel-content>
                            </v-expansion-panel>
                        </template>
                        <template>
                            <v-expansion-panel>
                                <v-expansion-panel-header>执行监听器</v-expansion-panel-header>
                                <v-expansion-panel-content>
                                    <v-data-table dense :headers="elementHeaders" :items="elementListenersList" hide-default-footer class="elevation-1">
                                        <template v-slot:[`item.actions`]="{ item }">
                                            <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
                                        </template>
                                    </v-data-table>
                                    <v-divider class="mx-4"></v-divider>
                                    <v-btn block color="primary" @click="openElementListenerForm(null)">添加监听器</v-btn>
                                </v-expansion-panel-content>
                            </v-expansion-panel>
                        </template>
                        <template v-if="processType === 'bpmn:UserTask'">
                            <v-expansion-panel>
                                <v-expansion-panel-header>任务监听器</v-expansion-panel-header>
                                <v-expansion-panel-content>
                                    <v-data-table dense :headers="userTaskHeaders" :items="userTaskListenersList" hide-default-footer class="elevation-1">
                                        <template v-slot:[`item.actions`]="{ item }">
                                            <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
                                        </template>
                                    </v-data-table>
                                    <v-divider class="mx-4"></v-divider>
                                    <v-btn block color="primary" @click="openUserTaskListenerForm(null)">添加监听器</v-btn>
                                </v-expansion-panel-content>
                            </v-expansion-panel>
                        </template>
                    </v-expansion-panels>
                </v-card>
                <v-btn @click="previewProcessXML">预览XML</v-btn>
            </v-col>
        </v-row>
        <v-snackbar v-model="snackbar" top :timeout="5000" color="error">
            {{ text }}
            <template v-slot:action="{ attrs }">
                <v-btn dark text v-bind="attrs" @click="snackbar = false">关闭</v-btn>
            </template>
        </v-snackbar>
        <!-- <v-navigation-drawer v-model="drawer" absolute temporary right>
            <v-list-item>
                <v-list-item-avatar>
                    <v-img src="https://randomuser.me/api/portraits/men/78.jpg"></v-img>
                </v-list-item-avatar>

                <v-list-item-content>
                    <v-list-item-title>John Leider</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-navigation-drawer> -->
    </x-dialog>
</template>

<script>
import _ from 'lodash';
import { Bpmn, DefaultEmptyXML } from '@/boost-vue/components/Bpmn';
import { initListenerType } from './listener/utilSelf';
import ElementMultiInstance from './panel/Multi-instance/ElementMultiInstance.vue';
export default {
    components: { Bpmn, ElementMultiInstance },
    props: {
        defProcessName: null,
        defProcessId: null,
        process: null
        //bpmnId: null
    },
    data: () => ({
        bpmnModel: null,
        changeBpmnModelXml: null,
        panel: [0],
        modeler: Object,
        element: null,
        elementObj: null,
        // processKey: '',
        // processName: '',
        processType: '',
        documentation: '',
        versionTag: '',
        isExecutable: false,
        formData: { workflowXml: '', workflowId: '' },
        listenerForm: {},
        shap: null,
        elementBaseInfo: {},
        userSelect: [
            { id: 'assignee', name: '指定人' },
            { id: 'candidateUsers', name: '候选用户' },
            { id: 'candidateGroups', name: '候选角色' }
        ],
        itemSelect: null,
        elementHeaders: [
            { text: '事件类型', value: 'event' },
            { text: '监听器类型', value: 'listenerType' },
            { text: '操作', value: 'action', sortable: false }
        ],
        userTaskHeaders: [
            { text: '事件类型', value: 'event' },
            { text: '监听器类型', value: 'listenerType' },
            { text: '操作', value: 'action', sortable: false }
        ],
        snackbar: false,
        text: '',
        editingListenerIndex: -1,
        bpmnElementListeners: [],
        elementListenersList: [],
        bpmnUserTaskListeners: [],
        userTaskListenersList: [],
        bpmnInstances: {
            modeler: Object,
            modeling: Object,
            moddle: Object,
            eventBus: Object,
            bpmnFactory: Object,
            elementFactory: Object,
            elementRegistry: Object,
            replace: Object,
            selection: Object
        }
    }),
    // mounted() {
    //     this.bpmnModel = DefaultEmptyXML.create(null, null, null, this.defProcessName);
    //     // _.delay(() => {
    //     //     this.xml = bpmnFactory.create(null, null, null, this.defProcessName);
    //     //     console.log('bpmnFactory', this.xml);
    //     // }, 500);
    // },

    computed: {
        selected: function () {
            return '选择' + this.itemSelect.name;
        }
    },
    watch: {
        elementBaseInfo: {
            immediate: false,
            handler(val) {
                console.log('handler', val);
                // this.$nextTick(() => this.resetListenersList());
                // this.resetListenersList();
                val && this.$nextTick(() => this.resetListenersList());
            }
        }
    },
    methods: {
        resetListenersList() {
            console.log('resetListenersList');
            var _vm = this;
            // this.bpmnElement = window.bpmnInstances.bpmnElement;
            // this.otherExtensionList = [];
            this.bpmnElementListeners = _vm.element.businessObject?.extensionElements?.values?.filter((ex) => ex.$type === 'flowable:ExecutionListener') ?? [];
            _vm.elementListenersList = this.bpmnElementListeners.map((listener) => initListenerType(listener));
        },
        initModeler(modeler) {
            var _vm = this;
            setTimeout(() => {
                console.log('modeler', modeler);
                _vm.modeler = modeler;
                _vm.initModels();
                // this.$refs.bpmn.initFormOnChanged(null);
            }, 10);
        },
        initModels() {
            var _vm = this;
            // 初始化 modeler
            if (!_vm.modeler) {
                // 避免加载时 流程图 并未加载完成
                _vm.timer = setTimeout(() => {
                    _vm.initModels();
                }, 10);
                return;
            }
            if (_vm.timer) clearTimeout(_vm.timer);
            _vm.bpmnInstances = {
                modeler: _vm.modeler,
                modeling: _vm.modeler.get('modeling'),
                moddle: _vm.modeler.get('moddle'),
                eventBus: _vm.modeler.get('eventBus'),
                bpmnFactory: _vm.modeler.get('bpmnFactory'),
                elementFactory: _vm.modeler.get('elementFactory'),
                elementRegistry: _vm.modeler.get('elementRegistry'),
                replace: _vm.modeler.get('replace'),
                selection: _vm.modeler.get('selection')
            };
            _vm.getActiveElement();
        },
        getActiveElement() {
            var _vm = this;
            // 初始第一个选中元素 bpmn:Process
            _vm.initFormOnChanged(null);
            _vm.modeler.on('import.done', (e) => {
                _vm.initFormOnChanged(null);
            });
            // 监听选择事件，修改当前激活的元素以及表单
            _vm.modeler.on('selection.changed', ({ newSelection }) => {
                _vm.initFormOnChanged(newSelection[0] || null);
            });
            _vm.modeler.on('element.changed', ({ element }) => {
                // 保证 修改 "默认流转路径" 类似需要修改多个元素的事件发生的时候，更新表单的元素与原选中元素不一致。
                if (element && element.id === this.element.id) {
                    _vm.initFormOnChanged(element);
                }
            });
        },
        initFormOnChanged(element) {
            var _vm = this;
            let activatedElement = element;
            if (!activatedElement) {
                activatedElement =
                    _vm.bpmnInstances.elementRegistry.find((el) => el.type === 'bpmn:Process') ??
                    _vm.bpmnInstances.elementRegistry.find((el) => el.type === 'bpmn:Collaboration');
            }
            if (!activatedElement) return;
            console.log(`
                    ----------
            select element changed:
                      id:  ${activatedElement.id}
                    type:  ${activatedElement.businessObject.$type}
                    ----------
                    `);
            console.log('businessObject: ', activatedElement.businessObject);
            _vm.element = activatedElement;
            _vm.elementBaseInfo = JSON.parse(JSON.stringify(activatedElement.businessObject));
            _vm.processType = activatedElement.type;
            const documentations = activatedElement?.businessObject?.documentation;
            var documentation = documentations && documentations.length ? documentations[0].text : '';
            console.log('documentation:', documentation);
            // window.bpmnInstances.bpmnElement = activatedElement;
            // this.bpmnElement = activatedElement;
            // this.elementId = activatedElement.id;
            // this.elementType = activatedElement.type.split(':')[1] || '';
            // this.elementBusinessObject = JSON.parse(JSON.stringify(activatedElement.businessObject));
            // this.conditionFormVisible = !!(
            //     this.elementType === 'SequenceFlow' &&
            //     activatedElement.source &&
            //     activatedElement.source.type.indexOf('StartEvent') === -1
            // );
            // this.formVisible = this.elementType === 'UserTask' || this.elementType === 'StartEvent';
        },
        shapeAdded(shape) {
            console.log('新增', shape);
            // this.elementBaseInfo.id = shape.id;
            // this.elementBaseInfo.name = shape.name;
            // this.elementBaseInfo.processType = shape.type;
        },
        imported(model, shape) {
            console.log('model', model);
            console.log('shape', shape);
            this.modeler = model;
            // this.elementBaseInfo.id = shape.id;
            // this.elementBaseInfo.name = shape.name;
            // this.elementBaseInfo.processType = shape.type;
        },
        elementClick(element, elementObj) {
            var _vm = this;
            console.log('elementObj', elementObj);
            console.log('F-element', element);
            console.log('businessObject', element.businessObject);
            _vm.shap = element.businessObject;
            _vm.element = element;
            _vm.elementObj = elementObj;
            // this.elementBaseInfo.id = element.id;
            // this.elementBaseInfo.name = element.businessObject.name;
            _vm.processType = element.type;
            console.log('点击了' + element.type + _vm.processKey);
            // this.$refs.bpmn.updateDocumentation(this.processKey, '说明文档啦啦啦');
            _vm.elementBaseInfo = JSON.parse(JSON.stringify(element.businessObject));
            console.log('elementBaseInfo', _vm.elementBaseInfo);
            var elementListener = this.shap?.extensionElements?.values?.filter((ex) => ex.$type === 'flowable:ExecutionListener') ?? [];
            console.log('elementListener:', elementListener);
            _vm.bpmnElementListeners = elementListener;
            _vm.elementListenersList = _vm.bpmnElementListeners.map((listener) => initListenerType(listener));
        },
        BpmnModelxml(bpmnXml) {
            // console.log('新图', bpmnXml);
            this.changeBpmnModelXml = bpmnXml;
        },
        cancel() {
            // this.xml = bpmnFactory.create();
            this.$emit('close');
            // this.$emit('close', { code: 'ok' });
        },
        ok() {
            var _vm = this;
            _vm.$refs.bpmn.getXmlString().then((v) => {
                // console.log('异步', v);
                _vm.formData.workflowXml = v;
                console.log('结果111', _vm.formData);
                _vm.$emit('close', { code: 'ok', data: this.formData });
            });
            // this.$emit('close', { code: 'ok', data: value });
        },
        redo() {
            this.$refs.bpmn.processRestart();
        },
        openPanel() {
            console.log('打开拓展面板');
        },
        onopen() {
            if (_.isNil(this.process)) {
                console.log('初始化', this.process);
                this.bpmnModel = DefaultEmptyXML.create(null, null, null, this.defProcessName);
            } else {
                console.log('初始化1', this.process);
                this.bpmnModel = this.process;
            }
        },
        add() {
            var otherExtensionList = [];
            this.listenerForm.event = 'start';
            this.listenerForm.listenerType = 'classListener';
            this.listenerForm.class = 'com.example.processengine.listener.StartExecutionListener';
            const listenerObject = this.$refs.bpmn.createListenerObject(this.listenerForm, false);
            console.log('listenerObject', listenerObject);
            console.log('otherExtensionList', otherExtensionList);
            this.$refs.bpmn.modifyModelListener(this.element, otherExtensionList.concat(listenerObject));
        },
        saveElementListener(data) {
            var _vm = this;
            const listenerObject = this.$refs.bpmn.createListenerObject(data, false);
            _vm.bpmnElementListeners.push(listenerObject);
            _vm.$refs.bpmn.modifyModelListener(_vm.element, _vm.bpmnElementListeners);
            console.log('listenerObject', listenerObject);
            console.log('elementListenersList', _vm.elementListenersList);
        },
        updateBaseInfo(key) {
            const attrObj = Object.create(null);
            attrObj[key] = this.elementBaseInfo[key];
            console.log('key', attrObj[key]);
            this.$refs.bpmn.modifyModel(this.element, attrObj);
        },
        updateDocumentation() {
            console.log(this.documentation);
            this.$refs.bpmn.updateDocumentation(this.element, this.documentation);
        },
        select(v) {
            console.log('vv', v);
            var _vm = this;
            this.userSelect.filter(function (item, index, arr0) {
                if (item.id == v) {
                    console.log('item', item);
                    console.log(index);
                    console.log(arr0);
                    _vm.itemSelect = item;
                }
            });
            console.log('item', _vm.itemSelect);
        },
        updateElementTask(event) {
            var _vm = this;
            let taskAttr = Object.create(null);
            taskAttr[_vm.itemSelect.id] = event;
            console.log(taskAttr);
            this.$refs.bpmn.modifyModel(this.element, taskAttr);
            _vm.testNode();
        },
        testNode() {
            var _vm = this;
            let taskAttr = Object.create(null);
            taskAttr['test'] = 'test123456789';
            console.log(taskAttr);
            _vm.$refs.bpmn.modifyModel(this.element, taskAttr);
        },
        openElementListenerForm(v) {
            var _vm = this;
            // console.log('v:', v);
            // console.log('elementObj:', _vm.elementObj);
            // var elementObj = _vm.elementObj;
            // if (elementObj == null) {
            //     this.snackbar = true;
            //     this.text = '请在流程图上点击一个组件';
            //     return;
            // }
            if (v == null) {
                console.log('新增');
                _vm.$dialog.open(
                    import('./listener/elementListeners.vue'),
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
        openUserTaskListenerForm(v) {
            var _vm = this;
            console.log('v:', v);
            console.log('elementObj:', _vm.elementObj);
            var elementObj = _vm.elementObj;
            if (elementObj == null) {
                this.snackbar = true;
                this.text = '请在流程图上点击一个组件';
                return;
            }
            if (v == null) {
                console.log('新增');
                _vm.$dialog.open(
                    import('./listener/userTaskListeners.vue'),
                    {},
                    {
                        ok(v) {
                            console.log(v);
                            // _vm.elementListenersList.push(v);
                            // _vm.saveElementListener(v);
                        }
                    }
                );
            }
        },
        deleteItem(item) {
            const index = this.elementListenersList.indexOf(item);
            console.log('index', index);
            confirm('Are you sure you want to delete this item?') && this.elementListenersList.splice(index, 1);
        },
        previewProcessXML() {
            var _vm = this;
            var xml = this.changeBpmnModelXml ?? this.bpmnModel;
            console.log(xml);
            _vm.$dialog.open(
                import('./highlightjs/highlightDialog.vue'),
                { xmlModel: xml, language: 'xml' },
                {
                    ok: () => {}
                }
            );
        }
    }
};
</script>
