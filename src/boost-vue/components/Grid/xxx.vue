<script>
// <template>
//     <x-data-loader v-model="loaded" @data-loaded="loaded(users, roles, groups)">
//         <x-data dataUrl="" name="users" />
//         <x-data dataUrl="" name="roles" />
//         <x-data dataUrl="" name="groups" />

//         <x-app v-if="loaded">
//             <div>
//                 <x-grid data="users" />
//             </div>
//         </x-app>
//     </x-data-loader>
// </template>
// import { defineComponent } from '@vue/composition-api';

export default {
    data: () => ({
        loaded: false
    }),
    setup() {
        this.$http.get();
    }
};
</script>
