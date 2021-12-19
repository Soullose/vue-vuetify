<template>
    <x-dialog v-bind="$attrs" v-on="$listeners" title="新增用户" width="900" @ok="ok" @cancel="cancel">
        <v-container>
            <v-form>
                <v-row>
                    <v-col cols="12"><v-text-field label="用户组" dense readonly /></v-col>

                    <v-col cols="4"><v-text-field label="姓" dense /></v-col>

                    <v-col cols="4"><v-text-field label="名" dense /></v-col>

                    <v-col cols="4"><v-text-field label="登录账号" dense /></v-col>

                    <v-col cols="12"><v-text-field label="电子邮件" dense /></v-col>

                    <v-col cols="12"><v-text-field label="联系电话" dense /></v-col>
                </v-row>
            </v-form>
        </v-container>
    </x-dialog>
</template>

<script>
export default {
    methods: {
        onOpen() {
            alert('xx');
        },

        ok() {
            this.$emit('close', { code: 'ok', data: {} });
        },

        cancel() {
            this.$emit('close', { code: 'cancel' });
        }
    }
};
</script>
