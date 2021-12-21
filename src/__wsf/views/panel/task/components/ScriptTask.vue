<template>
    <div>
        <v-form>
            <v-select
                v-model="scriptTaskForm.scriptFormat"
                label="脚本类型"
                :items="items"
                item-text="text"
                item-value="value"
                outlined
                dense
                @change="updateScriptTask"
            ></v-select>
            <v-textarea v-model="scriptTaskForm.script" label="脚本" auto-grow clearable solo @change="updateScriptTask"></v-textarea>
            <v-text-field
                v-model="scriptTaskForm.resultVariable"
                label="流程变量"
                placeholder="流程变量"
                clearable
                solo
                @change="updateScriptTask"
            ></v-text-field>
        </v-form>
    </div>
</template>
<script>
import { scriptTypeItems } from '../taskSelf';
export default {
    name: 'ScriptTask',
    props: { bpmnModeler: Object, bpmnElement: Object, businessObject: Object },
    data: () => ({
        element: Object,
        items: scriptTypeItems,
        itemValue: null,
        item: {},
        defaultScriptTaskForm: {
            scriptFormat: '',
            script: '',
            resource: '',
            resultVariable: ''
        },
        scriptTaskForm: {}
    }),
    watch: {
        businessObject: {
            immediate: true,
            handler(val) {
                var _vm = this;
                _vm.element = _vm.bpmnElement;
                if (val) {
                    _vm.resetScriptTaskForm();
                }
            }
        }
    },
    methods: {
        resetScriptTaskForm() {
            var _vm = this;
            for (let key in _vm.defaultScriptTaskForm) {
                let value = _vm.businessObject[key] || _vm.defaultScriptTaskForm[key];
                _vm.$set(_vm.scriptTaskForm, key, value);
            }
        },
        updateScriptTask() {
            var _vm = this;
            let scriptTaskAttr = Object.create(null);
            scriptTaskAttr.scriptFormat = _vm.scriptTaskForm.scriptFormat || null;
            scriptTaskAttr.resultVariable = _vm.scriptTaskForm.resultVariable || null;
            scriptTaskAttr.script = _vm.scriptTaskForm.script || null;
            _vm.bpmnModeler.modeling.updateProperties(_vm.bpmnElement, scriptTaskAttr);
        }
    },
    beforeDestroy() {
        this.element = '';
    }
};
</script>
