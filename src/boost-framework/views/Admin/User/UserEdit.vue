<template>
    <x-dialog v-bind="$attrs" width="900" v-on="$listeners">
        <v-container id="xxx">
            <v-menu :max-width="100" absoulute :position-x="10" :close-on-content-click="false">
                <template v-slot:activator="{ on }">
                    <div v-on="on" color="primary">AA</div>
                </template>
                <v-card>
                    <v-subheader>AAAAAAAAAAAA</v-subheader>
                    <v-card-text>
                        <v-form>
                            <v-text-field dense label="姓" />
                            <v-text-field dense label="cccccccccccccc名" />
                        </v-form>
                    </v-card-text>
                </v-card>
            </v-menu>
        </v-container>
    </x-dialog>
</template>
