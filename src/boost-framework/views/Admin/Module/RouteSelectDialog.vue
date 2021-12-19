<template>
    <x-dialog title="路由选择" v-bind="$attrs" width="1000" height="800" v-on="$listeners" @cancel="$emit('close')" @ok="$emit('close')">
        <v-row no-gutters class="px-0" style="height: 500px">
            <x-col-panel cols="auto w-lg" class="ml-n3 pb-0" scrollbar>
                <template slot="header">
                    <v-toolbar flat dense>
                        <v-subheader>包</v-subheader>
                    </v-toolbar>
                </template>

                <x-list :ds="dsPackage" class="pt-0" @selected="dsRoute.setData($event.routes)">
                    <template v-slot:default="{ item }">
                        <v-list-item>
                            <v-list-item-avatar>
                                <v-icon class="primary lighten-3" dark>mdi-package</v-icon>
                            </v-list-item-avatar>
                            <v-list-item-content>
                                <v-list-item-title>{{ item.name }}</v-list-item-title>
                            </v-list-item-content>

                            <v-list-item-action-text>
                                {{ item.routes.length }}
                            </v-list-item-action-text>
                        </v-list-item>
                    </template>
                </x-list>
            </x-col-panel>

            <x-col-panel class="mx-n3 pb-0" no-border>
                <template slot="header">
                    <v-toolbar dense flat>
                        <v-subheader>页面</v-subheader>
                        <v-spacer />
                        <div>
                            <v-text-field
                                flat
                                hide-details
                                outlined
                                dense
                                v-model="filterText"
                                @change="$refs.grid.setQuickFilter($event)"
                                append-icon="mdi-account"
                            />
                        </div>
                    </v-toolbar>
                </template>
                <x-grid ref="grid" :ds="dsRoute">
                    <x-grid-column headerName="名称" field="name" editable="false" />
                    <x-grid-column headerName="路径" field="path" flex />
                    <x-grid-column headerName="需要授权" field="authRequire" type="bool" />
                </x-grid>
            </x-col-panel>
        </v-row>

        <!-- <template slot="left-actions"></template> -->
    </x-dialog>
</template>

<script>
import _ from 'lodash';

export default {
    datastores: {
        dsPackage: { autoLoad: false },
        dsRoute: { autoLoad: false }
    },

    data: () => ({
        filterText: ''
    }),

    computed: {
        x() {
            return 'xxxxxxxxxxxx';
        },
        packageName() {
            return (item) => {
                return { name: _.keys(item).first() };
            };
        }
    },

    created() {
        this.dsPackage.setData(
            _.chain(this.$router.getRoutes())
                .map((route) => {
                    return {
                        id: _.uniqueId('$_'),
                        file: route.meta.file,
                        name: route.name,
                        path: route.path,
                        authRequire: route.meta.authRequire
                    };
                })
                .groupBy('file')
                .transform((result, value, key) => {
                    result.push({
                        name: key,
                        routes: value
                    });
                }, [])
                .value()
        );
    }
};
</script>
