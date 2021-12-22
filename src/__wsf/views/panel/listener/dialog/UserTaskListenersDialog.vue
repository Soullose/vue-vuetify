<template>
    <x-dialog title="添加任务监听器" v-bind="$attrs" v-on="$listeners" @open="onopen" @ok="ok" @cancel="cancel" ok-text="保存" cancel-text="关闭" width="400">
        <v-form>
            <v-select
                v-model="listenerForm.event"
                item-text="text"
                item-value="value"
                :items="listenerEventTypeObject"
                :rules="[(v) => !!v || '请选择事件类型']"
                label="事件类型"
                required
                outlined
                dense
            ></v-select>
            <v-text-field v-model="listenerForm.id" label="监听器ID" placeholder="监听器ID" outlined dense required clearable></v-text-field>
            <v-select
                v-model="listenerForm.listenerType"
                item-text="text"
                item-value="value"
                :items="listenerTypeObject"
                :rules="[(v) => !!v || '请选择监听器类型']"
                label="监听器类型"
                required
                outlined
                dense
            ></v-select>
            <v-text-field
                v-model="listenerForm.class"
                v-if="listenerForm.listenerType === 'classListener'"
                label="Java类"
                :rules="[(v) => !!v || '请输入javaClass']"
                outlined
                dense
                required
                clearable
            ></v-text-field>
            <v-text-field
                v-model="listenerForm.expression"
                v-if="listenerForm.listenerType === 'expressionListener'"
                label="表达式"
                :rules="[(v) => !!v || '请输入表达式']"
                outlined
                dense
                required
                clearable
            ></v-text-field>
            <v-text-field
                v-model="listenerForm.delegateExpression"
                v-if="listenerForm.listenerType === 'delegateExpressionListener'"
                label="代理表达式"
                :rules="[(v) => !!v || '请输入代理表达式']"
                outlined
                dense
                required
                clearable
            ></v-text-field>
            <template v-if="listenerForm.listenerType === 'scriptListener'">
                <!-- <v-text-field v-model="listenerForm.scriptFormat" label="脚本格式" :rules="[(v) => !!v || '请填写脚本格式']" required clearable></v-text-field> -->
                <v-select
                    v-model="listenerForm.scriptFormat"
                    :items="scriptTypeItems"
                    item-text="text"
                    item-value="value"
                    label="脚本格式"
                    :rules="[(v) => !!v || '请填写脚本格式']"
                    outlined
                    dense
                    required
                    clearable
                ></v-select>
                <v-select
                    v-model="listenerForm.scriptType"
                    item-text="text"
                    item-value="value"
                    :items="[
                        { text: '内联脚本', value: 'inlineScript' },
                        { text: '外部脚本', value: 'externalScript' }
                    ]"
                    :rules="[(v) => !!v || '请选择脚本类型']"
                    label="脚本类型"
                    outlined
                    dense
                    required
                    clearable
                ></v-select>
                <v-textarea
                    v-model="listenerForm.value"
                    v-if="listenerForm.scriptType === 'inlineScript'"
                    label="脚本内容"
                    :rules="[(v) => !!v || '请填写脚本内容']"
                    outlined
                    dense
                    required
                    clearable
                ></v-textarea>
                <v-text-field
                    v-model="listenerForm.resource"
                    v-if="listenerForm.scriptType === 'externalScript'"
                    label="资源地址"
                    :rules="[(v) => !!v || '请填写资源地址']"
                    outlined
                    dense
                    required
                    clearable
                ></v-text-field>
            </template>
        </v-form>
    </x-dialog>
</template>
<script>
import { eventType, listenerType } from '../utilSelf';
import { scriptTypeItems } from '../../task/taskSelf';
export default {
    data: () => {
        return {
            listenerEventTypeObject: eventType,
            listenerTypeObject: listenerType,
            scriptTypeItems: scriptTypeItems,
            listenerForm: {}
        };
    },
    methods: {
        onopen() {
            var _vm = this;
            console.log('onopen', _vm.listenerEventTypeObject);
        },
        cancel() {
            this.$emit('close');
        },
        ok() {
            var _vm = this;
            console.log('this:', _vm);
            _vm.$emit('close', { code: 'ok', data: _vm.listenerForm });
        }
    }
};
</script>
