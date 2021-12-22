<template>
    <x-dialog title="新增工作流" v-bind="$attrs" v-on="$listeners" @open="onopen" @ok="ok" @cancel="cancel" fullscreen ok-text="保存" cancel-text="关闭">
        <v-row>
            <v-col sm="10">
                <bpmn ref="bpmn" v-model="bpmnModel" @change="BpmnModelxml" @redo="redo" @init-finished="initModeler" />
            </v-col>
            <v-col sm="2">
                <v-card class="mx-auto" style="margin: 6px 0px 0px 0px">
                    <v-expansion-panels accordion hover tile v-model="panel" multiple>
                        <v-expansion-panel>
                            <v-expansion-panel-header>常规</v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <element-base-info :bpmn-modeler="bpmnInstances" :bpmn-element="element" :business-object="businessObject"></element-base-info>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                        <template v-if="processType === 'bpmn:ServiceTask'">
                            <v-expansion-panel>
                                <v-expansion-panel-header>服务任务</v-expansion-panel-header>
                                <v-expansion-panel-content>
                                    <service-task :bpmn-modeler="bpmnInstances" :bpmn-element="element" :business-object="businessObject"></service-task>
                                </v-expansion-panel-content>
                            </v-expansion-panel>
                        </template>
                        <template v-if="processType === 'bpmn:ScriptTask'">
                            <v-expansion-panel>
                                <v-expansion-panel-header>脚本任务</v-expansion-panel-header>
                                <v-expansion-panel-content>
                                    <script-task :bpmn-modeler="bpmnInstances" :bpmn-element="element" :business-object="businessObject"></script-task>
                                </v-expansion-panel-content>
                            </v-expansion-panel>
                        </template>
                        <template v-if="processType === 'bpmn:UserTask'">
                            <v-expansion-panel>
                                <v-expansion-panel-header>审核者</v-expansion-panel-header>
                                <v-expansion-panel-content>
                                    <user-task :bpmn-modeler="bpmnInstances" :bpmn-element="element" :business-object="businessObject"></user-task>
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
                                    <element-listeners
                                        :bpmn-modeler="bpmnInstances"
                                        :bpmn-element="element"
                                        :business-object="businessObject"
                                    ></element-listeners>
                                    <!-- <v-data-table dense :headers="elementHeaders" :items="elementListenersList" hide-default-footer class="elevation-1">
                                        <template v-slot:[`item.actions`]="{ item }">
                                            <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
                                        </template>
                                    </v-data-table>
                                    <v-divider class="mx-4"></v-divider>
                                    <v-btn block color="primary" @click="openElementListenerForm(null)">添加监听器</v-btn> -->
                                </v-expansion-panel-content>
                            </v-expansion-panel>
                        </template>
                        <template v-if="processType === 'bpmn:UserTask'">
                            <v-expansion-panel>
                                <v-expansion-panel-header>任务监听器</v-expansion-panel-header>
                                <v-expansion-panel-content>
                                    <user-task-listeners
                                        :bpmn-modeler="bpmnInstances"
                                        :bpmn-element="element"
                                        :business-object="businessObject"
                                    ></user-task-listeners>
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
import ElementMultiInstance from './panel/Multi-instance/ElementMultiInstance.vue';
import ElementBaseInfo from './panel/base/ElementBaseInfo.vue';
import ElementListeners from './panel/listener/elementListeners.vue';
import UserTaskListeners from './panel/listener/userTaskListeners.vue';
import UserTask from './panel/task/components/UserTask.vue';
import ScriptTask from './panel/task/components/ScriptTask.vue';
import ServiceTask from './panel/task/components/ServiceTask.vue';

export default {
    components: { Bpmn, ElementMultiInstance, ElementBaseInfo, UserTask, ScriptTask, ServiceTask, UserTaskListeners, ElementListeners },
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
        processType: '',
        formData: { workflowXml: '', workflowId: '' },
        snackbar: false,
        text: '',
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
        },
        businessObject: {}
    }),
    // mounted() {
    //     this.bpmnModel = DefaultEmptyXML.create(null, null, null, this.defProcessName);
    //     // _.delay(() => {
    //     //     this.xml = bpmnFactory.create(null, null, null, this.defProcessName);
    //     //     console.log('bpmnFactory', this.xml);
    //     // }, 500);
    // },

    computed: {},
    watch: {},
    methods: {
        initModeler(modeler) {
            var _vm = this;
            setTimeout(() => {
                console.log('modeler', modeler);
                _vm.modeler = modeler;
                _vm.initModels();
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
                e;
                _vm.initFormOnChanged(null);
            });
            // 监听选择事件，修改当前激活的元素以及表单
            _vm.modeler.on('selection.changed', ({ newSelection }) => {
                console.log('selection.changed');
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
            _vm.businessObject = activatedElement.businessObject;
            _vm.element = activatedElement;
            _vm.processType = activatedElement.type;
        },
        BpmnModelxml(bpmnXml) {
            this.changeBpmnModelXml = bpmnXml;
        },
        cancel() {
            this.$emit('close');
        },
        ok() {
            var _vm = this;
            _vm.$refs.bpmn.getXmlString().then((v) => {
                // console.log('异步', v);
                _vm.formData.workflowXml = v;
                console.log('结果111', _vm.formData);
                _vm.$emit('close', { code: 'ok', data: this.formData });
            });
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
