import _ from 'lodash';
import http from '../../boost-vue/services/Http';

function buildMenus(items, parentId, systemId) {
    var parts = _.partition(items, (item) => item.parentId == parentId);

    return _.filter(
        _.map(parts[0], (root) => {
            var menu = _.pick(root, ['id', 'number', 'name', 'path', 'icon']);

            var _systemId = systemId == null ? root.id : systemId;

            var children = buildMenus(parts[1], root.id, _systemId);

            _.forEach(root.pages, (page) => {
                // page novisible?
                page.systemId = _systemId;
                console.log(page);

                if (!_.isNil(page.permissions)) {
                    var pageMenu = _.pick(page, ['id', 'number', 'name', 'path', 'icon']);
                    children.push(pageMenu);
                }
            });

            if (children.length == 0) {
                return null;
            } else {
                menu.children = children;
                return menu;
            }
        }),
        (menu) => !_.isNil(menu)
    );
}

export default {
    namespaced: true,
    state: {
        pages: [],

        // 系统默认的起始地址
        startUrl: '/desktop',
        user: {},

        // 系统菜单
        menus: [],

        software: {
            name: '企业信息门户',
            version: '0.0.1'
        },

        // 框架状态，外观
        theme: {
            asideMenuFolded: false
        },

        // 页签
        bookmarks: [],

        // 路由方向
        slideDirection: 'left'
    },
    getters: {
        headerMenus(state) {
            return state.menus;
        },

        asideMenus(state) {
            return (systemId) => {
                var menu = _.find(state.menus, (menu) => menu.id === systemId);
                return _.isNil(menu) ? [] : menu.children;
            };
        },

        userLogined(state) {
            return !_.isNil(state.user);
        },

        loginedUrl(state) {
            return state.startUrl;
        }
    },
    mutations: {
        INIT_SESSION_DATA(state, { user, modules }) {
            state.user = user;
            state.pages = _.flatten(_.map(modules, (module) => module.pages));

            // 合并
            state.pages.forEach((page) => {
                page.permissions = _.isNil(user) ? undefined : _.get(user.permissions, page.id, undefined);
            });

            state.menus = buildMenus(modules, null, null);
            console.log(state.menus);
        },

        CLEAN_SESSION_DATA(state) {
            state.user = null;
            state.menus = null;
            state.pages = null;
        },

        SET_SYSTEM_MENUS(state, payload) {
            state.systemMenus = payload;
        },

        // SET_APPLICATION_MENUS(state, payload) {},

        TOGGLE_ASIDE_MENU(state) {
            state.theme.asideMenuFolded = !state.theme.asideMenuFolded;
        },

        TOGGLE_FULL_SCREEN() {
            alert('TOGGLE_FULL_SCREEN');
        },

        INIT_BOOKMARK() {},

        ADD_BOOKMARK(state, payload) {
            var found = _.find(state.bookmarks, (bookmark) => bookmark.id === payload.id);
            if (_.isNil(found)) {
                state.bookmarks.push(payload);
            } else {
                if (!_.isEqual(found, payload)) {
                    //
                }
            }
        },

        REMOVE_BOOKMARK(state, payload) {
            var index = _.findIndex(state.bookmarks, (bookmark) => payload.id == bookmark.id);
            state.bookmarks.splice(index, 1);
        },

        SAVE_BOOKMARK() {},

        SET_SLIDE_DIRECTION(state, payload) {
            state.slideDirection = payload;
        }
    },
    actions: {
        init(context) {
            // return http
            //     .url('framework?method=init')
            //     .post()
            //     .then((response) => {
            //         console.log(response.data);
            //         context.commit('INIT_SESSION_DATA', response.data);
            //     });
        },

        login(context, payload) {
            return new Promise((resolve) => {
                http.url('login')
                    .data(payload)
                    .post()
                    .then(() => {
                        http.url('framework?method=init')
                            .post()
                            .then((response) => {
                                context.commit('INIT_SESSION_DATA', response.data);
                                resolve();
                            });
                    });
            });
        },

        logout(context, payload) {
            return http
                .url('logout')
                .post()
                .then(() => {
                    context.commit('CLEAN_SESSION_DATA');
                });
        }
    }
};
