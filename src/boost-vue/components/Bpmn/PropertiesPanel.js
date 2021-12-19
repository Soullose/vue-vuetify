export default {
    name: 'MyPropertiesPanel',
    props: {
        bpmnModeler: Object
    },
    data() {
        return {};
    },
    created() {},
    watch: {
        bpmnModeler() {
            this.initModels();
        }
    },
    methods: {
        initModels() {
            console.log('右侧', this.bpmnModeler);
        }
    },
    render() {
        return <div></div>;
    }
};
