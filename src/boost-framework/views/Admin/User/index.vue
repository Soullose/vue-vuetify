<template>
    <x-app title="用户管理" icon="mdi-account">
        <v-row no-gutters>
            <x-col-panel cols="auto w-lg">
                <v-toolbar slot="header" dense flat>
                    <v-subheader>用户组</v-subheader>
                </v-toolbar>
                <x-treeview :ds="dsGroup" dense auto-selected />
            </x-col-panel>

            <x-col-panel class="auto w-lg ml-n3" no-border>
                <v-toolbar slot="header" flat dense>
                    <x-btn stock="add" @click="onAddUser" />
                </v-toolbar>
                <x-grid :ds="dsUser" no-line-num>
                    <x-grid-column headerName="编号" width="120"></x-grid-column>
                    <x-grid-column headerName="姓名" flex :valueGetter="(data) => data.firstName + data.lastName" type="object">
                        <template v-slot:render="{ data, value }">
                            <v-icon left>
                                {{ data.sex === 'male' ? 'mdi-face-outline' : 'mdi-face-woman-outline' }}
                            </v-icon>
                            {{ value }}
                        </template>
                    </x-grid-column>
                    <x-grid-column headerName="电话"></x-grid-column>

                    <x-grid-column headerName="电子邮件"></x-grid-column>
                    <x-grid-column headerName="登录名"></x-grid-column>
                    <x-grid-column headerName="账号锁定"></x-grid-column>
                </x-grid>
            </x-col-panel>
        </v-row>
    </x-app>
</template>

<script>
export default {
    // <sekect @selected="dsUsers.retrieve(asdsad) => users" />

    datastores: {
        dsGroup: {
            retrieveUrl: 'code/groups'
        },
        dsUser: {
            retrieveUrl: 'admin/users',
            autoLoad: false
        }
    },

    data: () => ({
        selectedItem: 1,
        items: [
            { text: 'Real-Time', icon: 'mdi-clock' },
            { text: 'Audience', icon: 'mdi-account' },
            { text: 'Conversions', icon: 'mdi-flag' }
        ],
        newRow: {}
    }),

    methods: {
        handleDataAutoLoaded() {},

        onAddUser() {
            this.$dialog.open(import('./UserCreateDialog'), {}, {});
        },

        addUser() {
            this.newRow = this.dsUser.add([
                { lastName: '', parentId: 1001 },
                { lastName: '', parentId: 9001 }
            ])[0];
        },

        modifyUser() {
            // this.dsUser.watch();
            this.dsUser.modify(this.dsUser.data, { firstName: 'TTT', lastName: 'UUUU' });
        },

        removeUser() {
            this.dsUser.removeIf((row) => row.lastName === '');
        }
    }
};
</script>
