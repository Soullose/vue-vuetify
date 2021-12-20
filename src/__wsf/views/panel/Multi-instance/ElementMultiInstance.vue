<template>
    <div>
        <v-form>
            <v-select
                v-model="loopCharacteristics"
                item-text="text"
                item-value="value"
                :items="CharacteristicsType"
                :rules="[(v) => !!v || '请选择会签类型']"
                label="会签类型"
                required
                dense
                solo
                @change="changeLoopCharacteristicsType"
            ></v-select>
            <template v-if="loopCharacteristics === 'ParallelMultiInstance' || loopCharacteristics === 'SequentialMultiInstance'">
                <v-form>
                    <v-text-field v-model="loopInstanceForm.loopCardinality" label="循环基数" clearable @change="updateLoopCardinality"></v-text-field>
                    <v-text-field v-model="loopInstanceForm.collection" label="集合" clearable @change="updateLoopBase"></v-text-field>
                    <v-text-field v-model="loopInstanceForm.elementVariable" label="元素变量" clearable @change="updateLoopBase"></v-text-field>
                    <v-text-field v-model="loopInstanceForm.completionCondition" label="完成条件" clearable @change="updateLoopCondition"></v-text-field>
                </v-form>
            </template>
        </v-form>
    </div>
</template>
<script>
export default {
    name: 'ElementMultiInstance',
    props: { bpmnModeler: Object, bpmnElement: Object },
    data: () => {
        return {
            loopCharacteristics: '',
            CharacteristicsType: [
                { text: '并行多实例', value: 'ParallelMultiInstance' },
                { text: '顺序多实例', value: 'SequentialMultiInstance' },
                { text: '循环实例', value: 'StandardLoop' },
                { text: '无', value: 'Null' }
            ],
            loopInstanceForm: {},
            defaultLoopInstanceForm: {
                completionCondition: '',
                loopCardinality: '',
                extensionElements: [],
                asyncAfter: false,
                asyncBefore: false,
                exclusive: false
            },
            element: Object
        };
    },
    watch: {
        bpmnElement: {
            immediate: true,
            handler(val) {
                this.element = val;
                var businessObject = val.businessObject;
                this.getElementLoop(businessObject);
            }
        }
    },
    methods: {
        getElementLoop(businessObject) {
            console.log('businessObject', businessObject);
            //无实例
            if (!businessObject.loopCharacteristics) {
                this.loopCharacteristics = 'Null';
                this.loopInstanceForm = {};
                return;
            }
            //循环实例
            if (businessObject.loopCharacteristics.$type === 'bpmn:StandardLoopCharacteristics') {
                this.loopCharacteristics = 'StandardLoop';
                this.loopInstanceForm = {};
                return;
            }
            if (businessObject.loopCharacteristics.isSequential) {
                this.loopCharacteristics = 'SequentialMultiInstance';
            } else {
                this.loopCharacteristics = 'ParallelMultiInstance';
            }
            // 合并配置
            this.loopInstanceForm = {
                ...this.defaultLoopInstanceForm,
                ...businessObject.loopCharacteristics,
                completionCondition: businessObject.loopCharacteristics?.completionCondition?.body ?? '',
                loopCardinality: businessObject.loopCharacteristics?.loopCardinality?.body ?? ''
            };
            this.multiLoopInstance = businessObject.loopCharacteristics;
            // 更新表单
            if (
                businessObject.loopCharacteristics.extensionElements &&
                businessObject.loopCharacteristics.extensionElements.values &&
                businessObject.loopCharacteristics.extensionElements.values.length
            ) {
                this.$set(this.loopInstanceForm, 'timeCycle', businessObject.loopCharacteristics.extensionElements.values[0].body);
            }
        },
        changeLoopCharacteristicsType(type) {
            console.log('会签类型', type);
            console.log('bpmnElement', this.element);
            var _vm = this;
            if (type === 'Null') {
                _vm.bpmnModeler.modeling.updateProperties(_vm.element, { loopCharacteristics: null });
                return;
            }
            // 配置循环
            if (type === 'StandardLoop') {
                const loopCharacteristicsObject = _vm.bpmnModeler.moddle.create('bpmn:StandardLoopCharacteristics');
                _vm.bpmnModeler.modeling.updateProperties(_vm.element, {
                    loopCharacteristics: loopCharacteristicsObject
                });
                _vm.multiLoopInstance = null;
                return;
            }
            // 时序
            if (type === 'SequentialMultiInstance') {
                _vm.multiLoopInstance = _vm.bpmnModeler.moddle.create('bpmn:MultiInstanceLoopCharacteristics', { isSequential: true });
            } else {
                _vm.multiLoopInstance = _vm.bpmnModeler.moddle.create('bpmn:MultiInstanceLoopCharacteristics');
            }
            _vm.bpmnModeler.modeling.updateProperties(_vm.element, {
                loopCharacteristics: _vm.multiLoopInstance
            });
        },
        updateLoopCardinality(cardinality) {
            var _vm = this;
            let loopCardinality = null;
            if (cardinality && cardinality.length) {
                loopCardinality = _vm.bpmnModeler.moddle.create('bpmn:FormalExpression', { body: cardinality });
            }
            _vm.bpmnModeler.modeling.updateModdleProperties(_vm.element, _vm.multiLoopInstance, { loopCardinality });
        },
        updateLoopCondition(condition) {
            var _vm = this;
            let completionCondition = null;
            if (condition && condition.length) {
                completionCondition = _vm.bpmnModeler.moddle.create('bpmn:FormalExpression', { body: condition });
            }
            _vm.bpmnModeler.modeling.updateModdleProperties(_vm.element, _vm.multiLoopInstance, { completionCondition });
        },
        updateLoopBase() {
            var _vm = this;
            _vm.bpmnModeler.modeling.updateModdleProperties(_vm.element, _vm.multiLoopInstance, {
                collection: _vm.loopInstanceForm.collection || null,
                elementVariable: _vm.loopInstanceForm.elementVariable || null
            });
        }
    },
    beforeDestroy() {
        this.multiLoopInstance = null;
        this.element = null;
    }
};
</script>
