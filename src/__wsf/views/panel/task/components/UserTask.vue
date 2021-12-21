<template>
    <div>
        <v-select v-model="itemValue" :items="items" label="用户类型" item-text="text" item-value="value" outlined dense @change="updateItem"></v-select>
        <template v-if="this.itemValue != null">
            <v-text-field :label="selected" clearable @change="updateElementTask"></v-text-field>
        </template>
    </div>
</template>
<script>
import { userSelect } from '../taskSelf';
export default {
    name: 'UserTask',
    props: { bpmnModeler: Object, bpmnElement: Object, businessObject: Object },
    data: () => ({
        items: userSelect,
        itemValue: null,
        item: {}
    }),
    computed: {
        selected: function () {
            console.log(this.itemValue);
            return '选择' + this.item.text;
        }
    },
    watch: {},
    methods: {
        updateItem(key) {
            var _vm = this;
            _vm.items.filter((v) => {
                if (v.value === key) {
                    _vm.item = v;
                }
            });
            console.log('选中的:', _vm.item);
        },
        updateElementTask(val) {
            var _vm = this;
            let taskAttr = Object.create(null);
            taskAttr[_vm.item.value] = val;
            _vm.bpmnModeler.modeling.updateProperties(_vm.bpmnElement, taskAttr);
        }
    }
};
</script>
