<template>
    <v-app-bar app fixed elevation="4" extension-height="32" dense height="48" color="primary darken-1" dark src="https://picsum.photos/1920/1080?random">
        <template v-slot:img="{ props }">
            <v-img v-bind="props" gradient="to top right, rgba(100,115,201,.7), rgba(25,32,72,.7)"></v-img>
        </template>
        <!-- 左侧菜单折叠 -->
        <v-app-bar-nav-icon @click="$emit('toggle-aside-menu')" />

        <!-- 系统菜单 -->
        <v-toolbar-items>
            <v-btn dense text v-for="menu in menus" :key="menu.id" link :to="{ path: menu.path }">
                {{ menu.name }}
            </v-btn>
        </v-toolbar-items>

        <v-spacer />

        <!-- 搜索栏 -->
        <div class="w-md">
            <v-text-field
                class="hidden-sm-and-down"
                label="搜索 ..."
                dense
                hide-details
                rounded
                solo
                color="primary"
                background-color="darken"
                flat
                prepend-inner-icon="mdi-home-search-outline"
            />
        </div>
        <v-menu offset-y left min-width="260" transition="slide-y-transition">
            <template v-slot:activator="{ on }">
                <v-btn icon v-on="on">
                    <v-badge color="red" light overlap dot bordered :content="messages.length">
                        <v-icon>mdi-email-outline</v-icon>
                    </v-badge>
                </v-btn>
            </template>
            <v-card>
                <v-list dense class="pa-0">
                    <v-subheader>消息中心</v-subheader>
                    <v-divider />
                    <v-list-item>
                        <v-list-item-avatar></v-list-item-avatar>
                    </v-list-item>
                </v-list>
            </v-card>
        </v-menu>

        <v-menu offset-y left min-width="260" transition="slide-y-transition">
            <template v-slot:activator="{ on }">
                <v-btn icon v-on="on">
                    <v-badge color="red" light overlap dot bordered :content="messages.length">
                        <v-icon>mdi-bell-outline</v-icon>
                    </v-badge>
                </v-btn>
            </template>
            <v-card>
                <v-list dense class="pa-0">
                    <v-subheader>系统通知</v-subheader>
                    <v-divider />
                    <v-list-item>
                        <v-list-item-avatar></v-list-item-avatar>
                    </v-list-item>
                </v-list>
            </v-card>
        </v-menu>

        <!--
        <v-expand-x-transition mode="in-out">
            <v-text-field
                v-if="showSearch"
                autofocus
                class="hidden-sm-and-down flex-grow-0 w"
                label="搜索 ..."
                dense
                hide-details
                rounded
                solo
                color="primary"
                background-color="grey lighten-3"
                flat
                prepend-inner-icon="mdi-home-search-outline"
                @blur="showSearch = !showSearch"
            />
            <v-tooltip bottom v-else>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        icon
                        @click="showSearch = !showSearch"
                        v-on="on"
                        v-bind="attrs"
                    >
                        <v-icon>mdi-home-search-outline</v-icon>
                    </v-btn>
                </template>
            </v-tooltip>
        </v-expand-x-transition>
        -->

        <!-- 工具按钮 -->
        <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
                <v-btn icon @click="$emit('search')" v-on="on" v-bind="attrs">
                    <v-icon>
                        {{ screenfull ? 'mdi-fullscreen-exit' : 'mdi-fullscreen' }}
                    </v-icon>
                </v-btn>
            </template>
            <span>{{ screenfull ? '退出全屏' : '全屏' }}</span>
        </v-tooltip>

        <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
                <v-btn icon @click="$emit('logout')" v-on="on" v-bind="attrs">
                    <v-icon>mdi-logout</v-icon>
                </v-btn>
            </template>
            <span>退出系统</span>
        </v-tooltip>

        <template v-slot:extension>
            <v-tabs height="32" optional>
                <v-tabs-slider color="darken-5"></v-tabs-slider>

                <v-tab v-for="bookmark in bookmarks" :key="bookmark.id" :to="{ path: bookmark.path }">
                    {{ bookmark.text }}
                    <v-icon x-small class="ml-1" @click.prevent="$emit('close-bookmark', bookmark)">mdi-close</v-icon>
                </v-tab>
            </v-tabs>
        </template>
    </v-app-bar>
</template>

<script>
export default {
    props: {
        menus: { type: Array, default: () => [] },
        bookmarks: { type: Array, default: () => [] }
    },

    data: () => ({
        searchText: '',
        screenfull: false,
        tab: null,
        messages: []
    })
};
</script>
