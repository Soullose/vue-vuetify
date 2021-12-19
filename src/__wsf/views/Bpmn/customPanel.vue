<template>
    <v-card class="mx-auto">
        <v-expansion-panels accordion multiple hover tile v-model="panel">
            <v-expansion-panel>
                <v-expansion-panel-header>常规</v-expansion-panel-header>
                <v-expansion-panel-content>
                    <x-form>
                        <v-text-field label="ID" v-model="processId" clearable />
                        <v-text-field label="名称" v-model="processName" clearable />

                        <v-text-field v-if="processType === 'bpmn:Process'" label="版本标签" v-model="versionTag" />
                        <v-switch v-model="isExecutable" label="可执行" class="ma-2"></v-switch>
                    </x-form>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>
    </v-card>
</template>
