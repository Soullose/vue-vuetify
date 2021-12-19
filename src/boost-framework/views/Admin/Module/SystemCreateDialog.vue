<template>
    <x-dialog title="新增系统" v-bind="$attrs" width="600" v-on="$listeners" @ok="onOk" @cancel="onCancel" @open="onOpen">
        <v-form>
            <v-row dense>
                <v-col cols="4">
                    <v-text-field label="系统编号" v-model="formData.number" />
                </v-col>
                <v-col cols="4">
                    <v-text-field label="系统名称" v-model="formData.name" />
                </v-col>
                <v-col cols="4">
                    <v-text-field label="系统图标" v-model="formData.icon" />
                </v-col>

                <v-col cols="12">
                    <v-text-field label="开始地址" v-model="formData.startUrl" />
                </v-col>
                <v-col cols="12">
                    <v-checkbox label="导航区域不显示" v-model="formData.hidden" />
                </v-col>
            </v-row>
        </v-form>
    </x-dialog>
</template>

<script>
import _ from 'lodash';

export default {
    data: () => ({
        formData: {
            number: '',
            name: '',
            icon: 'mdi-application',
            startUrl: '',
            hidden: true
        }
    }),

    methods: {
        onOpen() {
            this.formData.number = _.uniqueId('XX__');
        },

        onCancel() {
            this.$emit('close');
        },

        onOk() {
            this.$emit('close', { code: 'ok', data: this.formData });
        }
    }
};
</script>
