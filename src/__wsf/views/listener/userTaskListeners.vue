<template>
    <x-dialog
        title="添加任务监听器"
        v-bind="$attrs"
        v-on="$listeners"
        @open="onopen"
        @ok="ok"
        @cancel="cancel"
        ok-text="保存"
        cancel-text="关闭"
        width="400"
    ></x-dialog>
</template>
<script>
import { eventType } from './utilSelf';
export default {
    data: () => {
        return {
            listenerEventTypeObject: eventType
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
            _vm.$emit('close');
        }
    }
};
</script>
