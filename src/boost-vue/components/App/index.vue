<template>
    <v-container fluid class="fill-height layout">
        <v-card class="layout column" clazz="mt-4">
            <slot><div>Content</div></slot>
        </v-card>
    </v-container>
</template>

<script>
import { VContainer, VCard } from 'vuetify/lib';
export default {
    name: 'XApp',
    components: { VContainer, VCard },
    props: {
        icon: { type: String, default: 'mdi-application' },
        title: { type: String, default: 'Untitle Application' },
        contentClass: { type: String, default: '' }
    }
};
</script>
