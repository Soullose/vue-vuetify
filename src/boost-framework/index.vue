<template>
    <v-app>
        <template v-if="$route.meta.authRequire">
            <fk-header
                key="__application__header"
                :menus="headerMenus"
                :bookmarks="bookmarks"
                @toggle-aside-menu="toggleAsideMenu"
                @close-bookmark="closeBookmark"
                @toggle-full-screen="toggleFullScreen"
                @logout="onLogout"
            />
            <v-navigation-drawer
                key="__application__aside"
                style="z-index: 99"
                app
                dark
                fixed
                width="240"
                permanent
                :miniVariant="theme.asideMenuFolded"
                :expandOnHover="theme.asideMenuFolded"
                _color="theme.asideMenuColor"
                _color2="primary darken-5"
                _class="darken-3"
            >
                <v-img
                    slot="img"
                    :src="require('@/assets/images/bg-aside-menu.jpg')"
                    gradient="to top right, rgba(0,0,0,.7), rgba(0,0,0,0.8)"
                    style="width: 100%; height: 100%"
                />
                <v-list class="py-3">
                    <v-list-item class="justify-space-between px-2">
                        <v-list-item-avatar>
                            <v-img :src="require('@/assets/logo.svg')" />
                        </v-list-item-avatar>
                        <v-list-item-content>
                            <v-list-item-title>
                                <div class="mr-2 font-weight-black text-h6">{{ software.name }}</div>
                            </v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action-text>
                            <span class="mr-2">{{ software.version }}</span>
                        </v-list-item-action-text>
                    </v-list-item>
                </v-list>
                <v-divider />

                <fk-aside-menu :menus="asideMenus($route.meta.systemId)" />
            </v-navigation-drawer>
            <v-main key="__application__main" class="grey lighten-3">
                <transition :name="'slide-' + slideDirection" mode="out-in">
                    <router-view />
                    <!-- <keep-alive> v-if="_.get($route, 'meta.keepAlive', false)
                    </keep-alive> -->
                </transition>
            </v-main>
            <fk-footer key="__application__footer" />
        </template>

        <template v-else>
            <router-view />
        </template>
    </v-app>
</template>

<script>
import _ from 'lodash';
import { mapGetters, mapState, mapMutations, mapActions } from 'vuex';
import FkHeader from './components/Header.vue';
import FkAsideMenu from './components/AsideMenu.vue';
import FkFooter from './components/Footer.vue';

export default {
    components: { FkHeader, FkAsideMenu, FkFooter },

    computed: {
        ...mapState('framework', ['software', 'theme', 'bookmarks', 'startUrl', 'slideDirection']),
        ...mapGetters('framework', ['headerMenus', 'asideMenus'])
    },

    methods: {
        ...mapMutations('framework', {
            toggleAsideMenu: 'TOGGLE_ASIDE_MENU',
            toggleFullScreen: 'TOGGLE_FULL_SCREEN',
            removeBookmark: 'REMOVE_BOOKMARK'
        }),

        ...mapActions('framework', ['logout']),

        closeBookmark(bookmark) {
            var index = this.bookmarks.indexOf(bookmark);
            if (bookmark.id === _.get(this.$route.meta, 'id', '')) {
                var d = index === this.bookmarks.length - 1 ? -1 : 1;
                var nextBookmark = this.bookmarks[index + d];
                var to = {};
                if (_.isNil(nextBookmark)) {
                    to.path = this.startUrl;
                } else {
                    to.path = nextBookmark.path;
                }

                _.defer(() => {
                    this.$router.push(to);
                });
            }
            this.removeBookmark(bookmark);
        },

        onLogout() {
            this.logout().then(() => {
                this.$router.push({ path: '/login' });
            });
        }
    }
};
</script>
