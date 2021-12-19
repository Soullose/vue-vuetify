import _ from 'lodash';

export default {
    create: function (processId, diagramId, planeId, processName, type) {
        if (_.isNil(processId)) type = 'flowable';
        const TYPE_TARGET = {
            activiti: 'http://activiti.org/bpmn',
            camunda: 'http://bpmn.io/schema/bpmn',
            flowable: 'http://flowable.org/bpmn'
        };
        //http://bpmn.io/bpmn  ${TYPE_TARGET[type]}
        _.isNil(processId) && (processId = _.uniqueId('bpmn_process_'));
        _.isNil(diagramId) && (diagramId = _.uniqueId('bpmn_diagram_'));
        _.isNil(planeId) && (planeId = _.uniqueId('bpmn_plane_'));
        _.isNil(processName) && (processName = _.uniqueId('processName'));

        return `<?xml version="1.0" encoding="UTF-8"?>
    <bpmn2:definitions  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
                        xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" 
                        xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
                        xmlns:${type}="${TYPE_TARGET[type]}"
                        xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
                        xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
                        xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd"
                        id="diagram_${processId}" 
                        targetNamespace="${TYPE_TARGET[type]}" >
    <bpmn2:process id="${processId}" name="${processName}" isExecutable="true" >
        <bpmn2:extensionElements>
            <${type}:executionListener class="com.example.processengine.listener.EndExecutionListener" event="end" />
        </bpmn2:extensionElements>
        <bpmn2:startEvent id="Start" name="开始" ${type}:initiator="applyUserId" />
    </bpmn2:process>
        <bpmndi:BPMNDiagram id="${diagramId}">
            <bpmndi:BPMNPlane id="${planeId}" bpmnElement="${processId}">
                <bpmndi:BPMNShape id="Start_di" bpmnElement="Start">
                        <dc:Bounds x="142" y="212" width="36" height="36" />
                    <bpmndi:BPMNLabel>
                        <dc:Bounds x="149" y="255" width="22" height="14" />
                    </bpmndi:BPMNLabel>
                </bpmndi:BPMNShape>
            </bpmndi:BPMNPlane>
        </bpmndi:BPMNDiagram>
    </bpmn2:definitions>`;
    }
};
