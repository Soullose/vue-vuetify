<template>
    <x-app>
        <v-row no-gutters>
            <x-col-panel cols="auto w-lg" scrollbar>
                <v-toolbar slot="header" dense flat>
                    <v-spacer />
                    <v-btn text color="primary" @click="addSystem">新增</v-btn>
                    <v-btn text color="primary" @click="modifySystem">修改</v-btn>
                    <!-- <x-dropdown-btn text color="primary" @click="modifySystem">修改</x-dropdown-btn> -->
                </v-toolbar>
                <x-list :ds="dsSystem" class="py-0" two-line>
                    <template v-slot:default="{ item }">
                        <v-list-item>
                            <v-list-item-avatar>
                                <v-icon class="primary lighten-3" dark>mdi-folder-outline</v-icon>
                            </v-list-item-avatar>

                            <v-list-item-content>
                                <v-list-item-title>{{ item.text }}</v-list-item-title>
                                <v-list-item-subtitle>
                                    <div class="text-caption">一周前</div>
                                </v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action class="hover-show">
                                <span>
                                    <v-btn icon @click.prevent="modifySystem(item)">
                                        <v-icon small color="success lighten-1">mdi-pencil</v-icon>
                                    </v-btn>
                                    <v-btn icon @click.prevent="removeSystem(item)">
                                        <v-icon small color="error lighten-1">mdi-delete-forever-outline</v-icon>
                                    </v-btn>
                                </span>
                            </v-list-item-action>
                        </v-list-item>
                    </template>
                </x-list>
            </x-col-panel>

            <x-col-panel class="ml-n3">
                <v-toolbar slot="header" dense flat>
                    <x-dropdown-btn
                        text
                        dense
                        color="primary"
                        @click="addModule"
                        :actions="[
                            {
                                code: 'module',
                                text: '新增模块',
                                icon: 'mdi-account'
                            },
                            {
                                code: 'function',
                                text: '新增功能'
                            },
                            {
                                code: 'xxx',
                                text: '新增功能sdsdsd'
                            }
                        ]"
                    ></x-dropdown-btn>
                    <v-btn text dense color="primary">修改</v-btn>
                    <v-btn text dense color="error">删除</v-btn>
                </v-toolbar>

                <!-- <x-treeview dense :ds="dsModule" item-text="text" :item-disabled="(item) => item.number.length > 4" /> -->

                <!-- :item-text="(item) => item.number + ' - ' + item.text" -->
                <x-grid :ds="dsModule" no-line-num treeData>
                    <x-grid-column headerName="模块名称" field="text" type="tree,object" width="360">
                        <template v-slot:render="{ data }">
                            {{ data.number + ' - ' + data.text }}
                        </template>

                        <template v-slot:editor="{ data }">
                            <v-text-field label="模块编号" v-model="data.number" />
                            <v-text-field label="模块名称" v-model="data.text" />
                        </template>
                    </x-grid-column>
                    <x-grid-column headerName="开始地址" field="path" flex type="object">
                        <template v-slot:render="{ data }">
                            {{ 'http:/' + data.path }}
                        </template>

                        <template v-slot:editor="{ data }">
                            <v-text-field v-model="data.path" />
                            <v-text-field v-model="data.text" />
                        </template>
                    </x-grid-column>

                    <x-grid-column headerName="类型" />
                    <x-grid-column headerName="图标" field="text" type="bool" />
                </x-grid>
            </x-col-panel>
        </v-row>
    </x-app>
</template>

<script>
import _ from 'lodash';

export default {
    datastores: {
        dsSystem: {
            retrieveUrl: 'framework/systems',
            autoLoad: false
        },
        dsModule: 'framework/menus'
    },

    data() {
        return { selectedSystem: [] };
    },

    methods: {
        handleDataAutoLoaded() {
            this.dsSystem.setData(_.filter(this.dsModule.data, (m) => m.parentId === null));
        },

        addModule(code) {
            if (code === 'function') {
                this.$dialog.open(import('./RouteSelectDialog'), {}, {});
            } else if (code === 'module') {
                alert('module');
            }
        },

        addSystem() {
            this.$dialog.open(
                import('./SystemCreateDialog'),
                {},
                {
                    ok: (data) => {
                        this.dsSystem.add(_.clone(data));
                    }
                }
            );
        },

        removeSystem(system) {
            this.dsSystem.remove(system);
        },

        modifySystem(system) {
            this.$dialog.open(
                import('./SystemEditDialog'),
                {
                    system
                },
                {
                    ok: (data) => {
                        this.dsSystem.modify(system, data);
                    }
                }
            );
        }
    }
};
</script>
