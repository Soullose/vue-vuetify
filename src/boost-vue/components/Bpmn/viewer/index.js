import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import BpmnViewer from 'bpmn-js/lib/Viewer';
import '@/assets/style/bpmn.css';
import _ from 'lodash';

var Viewer = {
    props: {
        value: { type: String, requrired: true },
        finishedFlowElement: { type: Array, requrired: true },
        currentFlowElement: { type: String, requrired: true },
        sequenceFlow: { type: Array, requrired: true }
    },
    data() {
        return {
            status: false,
            elementRegistry: null,
            i: 1
        };
    },
    mounted() {
        this.init();
        this.importViewXML(this.value);
    },
    methods: {
        init() {
            if (this.bpmnViewer) return;
            console.log('init-viewer');
            this.bpmnViewer = new BpmnViewer({
                container: this.$refs['bpmn-canvas']
            });
        },
        importViewXML(xml) {
            console.log('importViewXML-viewer');
            if (!_.isNil(xml) && xml !== '') {
                this.bpmnViewer
                    .importXML(xml)
                    .then(() => {
                        const canvas = this.bpmnViewer.get('canvas');
                        canvas.zoom('fit-viewport', 'auto');
                        const allShapes = this.bpmnViewer.get('elementRegistry').getAll();
                        console.log('所有节点', allShapes);
                        console.log('已完成的节点', this.finishedFlowElement);
                        console.log('当前的节点', this.currentFlowElement);
                        if (!_.isNil(this.finishedFlowElement)) {
                            for (const key in this.finishedFlowElement) {
                                console.log('key', key);
                                canvas.addMarker(this.finishedFlowElement[key], 'highlight');
                            }
                        }
                        if (!_.isNil(this.sequenceFlow)) {
                            for (const key in this.sequenceFlow) {
                                console.log('key', this.sequenceFlow[key]);
                                canvas.addMarker(this.sequenceFlow[key], 'sequenceFlow');
                            }
                        }
                        if (!_.isNil(this.currentFlowElement)) {
                            canvas.addMarker(this.currentFlowElement, 'nodeSuccess');
                        }
                    })
                    .catch((e) => {
                        console.log(`[流程设计器错误]:${e.message || e}`);
                    });
            }
        }
    },
    // watch: {
    //     value(xml) {
    //         console.log('watch-Viewer', xml);
    //         console.log('已完成的节点', this.finishedFlowElement);
    //         console.log('当前的节点', this.currentFlowElement);
    //         this.importViewXML(xml);
    //     }
    // },
    render() {
        return (
            <div class="my-process-designer__container">
                <div class="my-process-designer__canvas" ref="bpmn-canvas"></div>
            </div>
        );
    }
};
export { Viewer };
