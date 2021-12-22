<template>
    <div>
        <v-form>
            <v-text-field label="节点key" v-model="elementBaseInfo.id" clearable @change="updateBaseInfo('id')" />
            <v-text-field label="节点名称" v-model="elementBaseInfo.name" clearable @change="updateBaseInfo('name')" />
            <v-textarea solo label="流程描述" v-model="documentation" @change="updateDocumentation" :disabled="_.isNil(this.element)" />
        </v-form>
    </div>
</template>
<script>
export default {
    name: 'ElementBaseInfo',
    props: { bpmnModeler: Object, bpmnElement: Object, businessObject: Object },
    data: () => ({ elementBaseInfo: {}, element: Object, documentation: '' }),
    watch: {
        businessObject: {
            immediate: false,
            handler(val) {
                var _vm = this;
                _vm.element = _vm.bpmnElement;
                if (val) {
                    _vm.resetBaseInfo();
                }
            }
        }
    },
    methods: {
        resetBaseInfo() {
            var _vm = this;
            _vm.elementBaseInfo = JSON.parse(JSON.stringify(_vm.businessObject));
        },
        updateBaseInfo(key) {
            var _vm = this;
            const attrObj = Object.create(null);
            attrObj[key] = _vm.elementBaseInfo[key];
            if (key === 'id') {
                _vm.bpmnModeler.modeling.updateProperties(_vm.bpmnElement, {
                    id: _vm.elementBaseInfo[key],
                    di: { id: `${_vm.elementBaseInfo[key]}_di` }
                });
            } else {
                _vm.bpmnModeler.modeling.updateProperties(_vm.bpmnElement, attrObj);
            }
        },
        updateDocumentation() {
            var _vm = this;
            console.log(_vm.documentation);
            var doc = _vm.documentation;
            const modeling = _vm.bpmnModeler.modeling;
            const documentation = _vm.bpmnModeler.bpmnFactory.create('bpmn:Documentation', { text: doc });
            modeling.updateProperties(_vm.bpmnElement, {
                documentation: [documentation]
            });
            // this.$refs.bpmn.updateDocumentation(this.element, this.documentation);
        }
    },
    beforeDestroy() {
        this.element = '';
    }
};
</script>
