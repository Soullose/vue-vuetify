import _ from 'lodash';
import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../store';

Vue.use(VueRouter);

const UNAUTHORIZED = '401';
const NOT_FOUND = '404';
const LOGIN = 'Login';

// 自动加载路由
var routes = [];
const routeContext = require.context('../', true, /router\/index\.js$/);
routeContext.keys().forEach((path) => {
    if (path.startsWith('./router')) {
        return;
    } else {
        const route = routeContext(path);
        var file = _.chain(path).split('/').slice(1, -2).join('/').value();
        enhance(route, file);
        routes = _.concat(routes, route);
    }
});

function enhance(routes, file) {
    _.each(routes, (route) => {
        route.meta = {
            file: file,
            authRequire: _.get(route, 'authRequire', true),
            rawPath: route.path
        };
        // route.permissions = null;

        if (!_.isNil(route.children)) {
            enhance(route.children);
        }
    });
}

const router = new VueRouter({
    routes
});

function findPage(rawPath) {
    return _.find(_.get(store.state, 'framework.pages'), (page) => page.path === rawPath);
}

function userLogined() {
    return store.getters['framework/userLogined'];
}

function addBookmark(path) {
    if (_.get(path, 'meta.authRequire', true) && _.get(path, 'meta.id', null) !== null) {
        var bookmark = _.pick(path.meta, ['id', 'systemId', 'icon', 'text']);
        bookmark.path = path.path;
        store.commit('framework/ADD_BOOKMARK', bookmark);
    }
}

function calcSlideDirection(to, from) {
    var fromId = _.get(from, 'meta.id', 0);
    if (fromId === 0) {
        return 'new'; // 左侧进入，右侧移出
    }
    var toId = _.get(to, 'meta.id', 0);

    var bookmarks = _.get(store.state, 'framework.bookmarks');
    var bookmark = _.find(bookmarks, (bookmark) => bookmark.id === fromId || bookmark.id === toId);
    return bookmark.id === fromId ? 'left' : 'right';
}

function setSlideDirection(direction) {
    store.commit('framework/SET_SLIDE_DIRECTION', direction);
}

router.beforeEach((to, from, next) => {
    if (to.name === LOGIN) {
        if (userLogined()) {
            console.log('User has been logined');
            next(false);
        } else {
            next(true);
        }
    } else if (_.get(to, 'meta.authRequire', true)) {
        if (!userLogined()) {
            next({ name: LOGIN, query: { redirect: to.fullPath } });
        } else {
            var page = findPage(to.meta.rawPath);
            if (_.isNil(page)) {
                // 本地有路由，但服务器未添加
                next(true);
                console.warn('Page undefined, but exists [path=%s]', to.path);
            } else {
                var permissions = page.permissions;

                if (!_.isNil(permissions)) {
                    to.meta.permissions = permissions;
                    to.meta.id = _.get(page, 'id', null);
                    to.meta.systemId = _.get(page, 'systemId', null);
                    to.meta.text = _.get(page, 'name', 'Untitle');

                    addBookmark(to);
                    setSlideDirection(calcSlideDirection(to, from));

                    next(true);
                } else {
                    console.debug('Page unauthorized [path=%s]', to.path);
                    _.defer(() => {
                        router.push({ name: UNAUTHORIZED });
                    });
                }
            }
        }
    } else {
        next(true);
    }
});

export default router;
