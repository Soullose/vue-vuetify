export default class CustomPalette {
    constructor(bpmnFactory, create, elementFactory, palette, translate) {
        this.bpmnFactory = bpmnFactory;
        this.create = create;
        this.elementFactory = elementFactory;
        this.translate = translate;

        palette.registerProvider(this);
    }

    getPaletteEntries() {
        // console.log(element);
        const { bpmnFactory, create, elementFactory, translate } = this;

        function createTask(type) {
            return function (event) {
                const businessObject = bpmnFactory.create(type);
                businessObject['custom'] = 1;
                const shape = elementFactory.createShape({
                    type: type,

                    businessObject
                });
                console.log(shape); // 只在拖动或者点击时触发
                create.start(event, shape);
            };
        }

        return {
            'create.lindaidai-task': {
                group: 'model',
                className: 'bpmn-icon-user-task',
                // className: 'bpmn-icon-user-task',
                title: translate('创建一个类型为用户任务的节点'),
                action: {
                    dragstart: createTask('bpmn:UserTask'),
                    click: createTask('bpmn:UserTask')
                }
            }
        };
    }
}

CustomPalette.$inject = ['bpmnFactory', 'create', 'elementFactory', 'palette', 'translate'];
