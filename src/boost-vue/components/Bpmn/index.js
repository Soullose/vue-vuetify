import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';

import _ from 'lodash';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import DefaultEmptyXML from './BpmnFactory';
// import MyPropertiesPanel from './PropertiesPanel';

import '@/assets/style/bpmn.css';
import customTranslate from './translate/customTranslate';
// import activitiModdleDescriptor from './descriptor/activitiDescriptor.json';
// import activitiModdleExtension from './extension-moddle/index';

import flowableDescriptor from './descriptor/flowableDescriptor.json';
import flowableModdleExtension from './extension-moddle/flowable/index';

var Bpmn = {
    props: {
        value: { type: String, requrired: true },
        events: {
            type: Array,
            default: () => ['element.click']
        },
        shapeEvents: { type: Array, default: () => ['shape.added', 'shape.move.end', 'shape.removed', 'connect.end', 'connect.move'] },
        taskDefinitionKey: { type: Array }
    },
    data() {
        return {
            status: false,
            elementRegistry: null,
            i: 1
        };
    },
    computed: {
        additionalModules() {
            const Modules = [];
            //翻译模块
            var customTranslateModule = {
                translate: ['value', customTranslate]
            };
            Modules.push(customTranslateModule);
            Modules.push(flowableModdleExtension);
            return Modules;
        },
        moddleExtensions() {
            const Extensions = {};
            Extensions.flowable = flowableDescriptor;
            return Extensions;
        }
    },
    mounted() {
        this.init();
        this.importXML(this.value);
    },
    methods: {
        init() {
            if (this.bpmnModeler) return;
            this.bpmnModeler = new BpmnModeler({
                container: this.$refs['bpmn-canvas'],
                keyboard: {
                    bindTo: window
                },
                additionalModules: this.additionalModules,
                moddleExtensions: this.moddleExtensions
            });
            this.$emit('init-finished', this.bpmnModeler);
            this.initModelListeners();
        },
        async importXML(xml) {
            // console.log('modeler', xml);
            if (!_.isNil(xml) && xml !== '') {
                try {
                    let { warnings } = await this.bpmnModeler.importXML(xml);
                    if (warnings && warnings.length) {
                        warnings.forEach((warn) => console.warn(warn));
                    }
                } catch (e) {
                    console.error(`[Process Designer Warn]: ${e.message || e}`);
                }
            }
        },
        success() {
            console.log('加载成功');
            this.initModelListeners();
        },
        initModelListeners() {
            const EventBus = this.bpmnModeler.get('eventBus');
            const that = this;
            // let ee = this.events[0].replace(/\./g, '-');
            // console.log('ee', ee);
            // 注册需要的监听事件, 将. 替换为 - , 避免解析异常
            this.events.forEach((event) => {
                EventBus.on(event, function (eventObj) {
                    // console.log('eventObj', eventObj);
                    // console.log(event);
                    let eventName = event.replace(/\./g, '-');
                    let element = eventObj ? eventObj.element : null;
                    // console.log('eventName', eventName);
                    // console.log('element', element);
                    that.$emit(eventName, element, eventObj);
                });
            });
            this.shapeEvents.forEach(function (event) {
                that.bpmnModeler.on(event, (e) => {
                    var elementRegistry = that.bpmnModeler.get('elementRegistry');
                    var shape = e.element ? elementRegistry.get(e.element.id) : e.shape;
                    // console.log(shape);
                    let eventName = event.replace(/\./g, '-');
                    // console.log('shapeEventName', eventName);
                    if (event === 'shape.added') {
                        // console.log('新增了shape', shape);
                        // if (shape.type == 'bpmn:StartEvent') {
                        //     this.modifyModelName(shape, '开始');
                        // }
                        that.$emit(eventName, shape);
                    } else if (event === 'shape.move.end') {
                        // console.log('移动了shape', shape);
                    } else if (event === 'shape.removed') {
                        // console.log('删除或更换shape', shape);
                    } else if (event == 'connect.end') {
                        // console.log('connect.end', shape);
                    } else if (event == 'connect.move') {
                        // console.log('connect.move', shape);
                    }
                });
            });
            // 监听图形改变返回xml
            EventBus.on('commandStack.changed', async (event) => {
                var _vm = this;
                try {
                    // this.recoverable = this.bpmnModeler.get('commandStack').canRedo();
                    // let recoverable = this.bpmnModeler.get('commandStack').canRedo();
                    // this.revocable = this.bpmnModeler.get('commandStack').canUndo();
                    // console.log('3333', this.bpmnModeler.get('commandStack').canUndo());
                    // let redo = this.bpmnModeler.get('commandStack').redo();
                    this.recoverable = this.bpmnModeler.get('commandStack').canRedo();
                    this.revocable = this.bpmnModeler.get('commandStack').canUndo();
                    try {
                        const result = await this.bpmnModeler.saveXML({ format: true });
                        const { xml } = result;
                        // console.log(xml);
                        _vm.$emit('change', xml);
                    } catch (err) {
                        console.log(err);
                    }

                    // console.log('BpmnModelxml1', BpmnModelxml);
                    // this.$emit('BpmnModelxml', BpmnModelxml);
                    // console.log('listener_xml', xml);
                    // this.$emit('input', xml);
                    // this.$emit('change', xml);
                    this.$emit('commandStack-changed', event);
                } catch (e) {
                    console.error(`[流程设计器错误]: ${e.message || e}`);
                }
            });
            // 监听视图缩放变化
            this.bpmnModeler.on('canvas.viewbox.changed', ({ viewbox }) => {
                this.$emit('canvas-viewbox-changed', { viewbox });
                const { scale } = viewbox;
                this.defaultZoom = Math.floor(scale * 100) / 100;
            });
        },
        //恢复
        processRedo() {
            console.log('恢复');
            this.bpmnModeler.get('commandStack').redo();
        },
        //撤销
        processUndo() {
            console.log('撤销');
            this.bpmnModeler.get('commandStack').undo();
        },
        //重置流程图
        processRestart() {
            this.status = false;
            this.importXML(DefaultEmptyXML.create()).then(() => this.bpmnModeler.get('canvas').zoom(1, 'auto'));
        },
        //修改流程图属性
        modifyModel(shape, value) {
            const modeling = this.bpmnModeler.get('modeling');
            modeling.updateProperties(shape, value);
        },
        //所有节点下的文档描述
        updateDocumentation(shape, doc) {
            const modeling = this.bpmnModeler.get('modeling');
            // var elementRegistry = this.bpmnModeler.get('elementRegistry');
            // const shape = elementRegistry.get(shapeId);
            console.log('文档shape', shape);
            const documentation = this.bpmnModeler.get('bpmnFactory').create('bpmn:Documentation', { text: doc });
            modeling.updateProperties(shape, {
                documentation: [documentation]
            });
        },
        //添加和修改模块名称
        modifyModelName(shape, name) {
            const modeling = this.bpmnModeler.get('modeling');
            modeling.updateProperties(shape, { name: name });
        },
        createListenerObject(options, isTask) {
            const listenerObj = Object.create(null);
            listenerObj.class = options.class;
            listenerObj.event = options.event;
            return this.bpmnModeler.get('bpmnFactory').create(`flowable:${isTask ? 'TaskListener' : 'ExecutionListener'}`, listenerObj);
        },
        //添加监听器
        modifyModelListener(shape, listener) {
            console.log('shape', shape);
            const extensions = this.bpmnModeler.get('bpmnFactory').create('bpmn:ExtensionElements', { values: listener });
            console.log('extensions', extensions);
            const modeling = this.bpmnModeler.get('modeling');
            modeling.updateProperties(shape, {
                extensionElements: extensions
            });
        },
        //保存流程图
        async getXmlString(done) {
            const result = await this.bpmnModeler.saveXML({ format: true }, done);
            console.log('xml', result.xml);
            var xml = result.xml;
            // this.$emit('bpmn-Xml', result);
            return xml;
        }
    },
    watch: {
        value(xml) {
            // console.log('参数2', xml);
            //不开启会有小瑕疵(操作方面)
            // if (!this.status) {
            this.importXML(xml);
            //     this.status = true;
            // }
        }
    },
    render() {
        return (
            <div class="my-process-designer__container">
                <div class="my-process-designer__canvas" ref="bpmn-canvas"></div>
            </div>
        );
    }
};

export { Bpmn, DefaultEmptyXML };
