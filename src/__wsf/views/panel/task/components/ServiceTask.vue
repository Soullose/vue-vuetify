<template>
    <div>
        <v-select
            v-model="serviceFormat"
            label="服务类型"
            :items="items"
            item-text="text"
            item-value="value"
            outlined
            dense
            @change="updateServiceTask"
        ></v-select>
        <template v-if="this.serviceFormat != null">
            <v-text-field v-model="serviceTaskForm.value" :label="selected" clearable @change="updateServiceTask"></v-text-field>
        </template>
    </div>
</template>
<script>
import { serviceTypeItems } from '../taskSelf';
export default {
    name: 'ServiceTask',
    props: { bpmnModeler: Object, bpmnElement: Object, businessObject: Object },
    data: () => ({
        items: serviceTypeItems,
        item: null,
        serviceTaskForm: {},
        serviceFormat: null,
        defServiceTaskForm: {}
    }),
    computed: {
        selected: function () {
            console.log(this.item);
            return '选择' + this.item.text;
        }
    },
    // watch: { businessObject: { immediate: true, handler() {} }, serviceFormat: {} },
    methods: {
        updateServiceTaskType(type) {
            var _vm = this;
            let serviceTaskAttr = Object.create(null);
            console.log('服务任务类型:', type);
            _vm.items.filter((v) => {
                if (v.value === type) {
                    _vm.item = v;
                }
            });
            var businessObject = _vm.businessObject;
            console.log('businessObject-:', businessObject);
            _vm.bpmnModeler.modeling.updateProperties(_vm.bpmnElement, _vm.defServiceTaskForm);
        },
        updateServiceTask() {
            var aa = [];
            var _vm = this;
            _vm.items.filter((v) => {
                if (v.value === _vm.serviceFormat) {
                    _vm.item = v;
                }
            });
            let serviceTaskAttr = Object.create(null);
            serviceTaskAttr[_vm.serviceFormat] = _vm.serviceTaskForm.value || '';
            var a = { class: _vm.serviceTaskForm.value };
            console.log('a:', a);
            console.log('serviceTaskAttr:', serviceTaskAttr);
            aa.push(serviceTaskAttr);
            console.log('aa:', aa);
            _vm.bpmnModeler.modeling.updateProperties(_vm.bpmnElement, aa[0]);
        }
    }
};
</script>
