<template>
    <x-dialog title="添加执行监听器" v-bind="$attrs" v-on="$listeners" @open="onopen" @ok="ok" @cancel="cancel" ok-text="保存" cancel-text="关闭" width="400">
        <v-form>
            <v-select v-model="event" :items="eventItems" :rules="[(v) => !!v || '请选择事件类型']" label="事件类型" required @change="eventChange"></v-select>
            <v-select
                v-model="type"
                item-text="text"
                item-value="value"
                :items="listenerForm.elementListenerType"
                :rules="[(v) => !!v || '请选择监听器类型']"
                label="监听器类型"
                required
                @change="listenerTypeChange"
            ></v-select>
            <v-text-field
                v-model="listenerForm.class"
                v-if="listenerForm.listenerType === 'classListener'"
                label="Java类"
                :rules="[(v) => !!v || '请输入javaClass']"
                required
                clearable
            ></v-text-field>
            <v-text-field
                v-model="listenerForm.expression"
                v-if="listenerForm.listenerType === 'expressionListener'"
                label="表达式"
                :rules="[(v) => !!v || '请输入表达式']"
                required
                clearable
            ></v-text-field>
            <v-text-field
                v-model="listenerForm.delegateExpression"
                v-if="listenerForm.listenerType === 'delegateExpressionListener'"
                label="代理表达式"
                :rules="[(v) => !!v || '请输入代理表达式']"
                required
                clearable
            ></v-text-field>
            <template v-if="listenerForm.listenerType === 'scriptListener'">
                <v-text-field v-model="listenerForm.scriptFormat" label="脚本格式" :rules="[(v) => !!v || '请填写脚本格式']" required clearable></v-text-field>
                <v-select
                    item-text="text"
                    item-value="value"
                    :items="[
                        { text: '内联脚本', value: 'inlineScript' },
                        { text: '外部脚本', value: 'externalScript' }
                    ]"
                    :rules="[(v) => !!v || '请选择脚本类型']"
                    label="脚本类型"
                    required
                    @change="scriptTypeChange"
                ></v-select>
                <v-text-field
                    v-model="listenerForm.value"
                    v-if="this.scriptType === 'inlineScript'"
                    label="脚本内容"
                    :rules="[(v) => !!v || '请填写脚本内容']"
                    required
                    clearable
                ></v-text-field>
                <v-text-field
                    v-model="listenerForm.resource"
                    v-if="this.scriptType === 'externalScript'"
                    label="资源地址"
                    :rules="[(v) => !!v || '请填写资源地址']"
                    required
                    clearable
                ></v-text-field>
            </template>
        </v-form>
    </x-dialog>
</template>
<script>
import { listenerType } from '../utilSelf';
export default {
    // props: { elementListenerType: null },
    data: () => {
        return {
            type: null,
            // elementListenerType: listenerType,
            event: null,
            eventItems: ['start', 'end'],
            scriptFormat: null,
            scriptType: null,
            listenerForm: { listenerType: null, elementListenerType: listenerType }
        };
    },
    methods: {
        onopen() {
            var _vm = this;
            console.log('onopen', _vm.listenerForm.listenerType);
        },
        cancel() {
            this.$emit('close');
        },
        ok() {
            var _vm = this;
            console.log('listenerForm:', _vm.listenerForm);
            _vm.$emit('close', { code: 'ok', data: _vm.listenerForm });
            // _vm.listenerForm = {};
            console.log(_vm.$options.data().listenerForm);
            _vm.listenerForm = _vm.$options.data().listenerForm;
            _vm.event = _vm.$options.data().event;
            _vm.type = _vm.$options.data().type;
            // _vm.elementListenerType = _vm.$options.data().elementListenerType;
        },
        eventChange() {
            var _vm = this;
            _vm.listenerForm.event = _vm.event;
            console.log(_vm.event);
        },
        listenerTypeChange(v) {
            var _vm = this;
            console.log('type', _vm.type);
            _vm.listenerForm.listenerType = v;
            // _vm.$set(this.listenerForm, 'listenerType', v);
            console.log(v);
            console.log(_vm.listenerForm);
        },
        scriptTypeChange(v) {
            var _vm = this;
            _vm.scriptType = v;
            console.log(v);
        }
    }
};
</script>
