module.exports = [
    {
        path: '/',
        name: 'Home',
        redirect: '/desktop'
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import(/* webpackChunkName: "login" */ '../views/Login'),
        authRequire: false
    },
    {
        path: '/401',
        name: '401',
        component: () => import(/* webpackChunkName: "401" */ '../views/401'),
        authRequire: false
    },
    {
        path: '*',
        name: '404',
        component: () => import(/* webpackChunkName: "404" */ '../views/404'),
        authRequire: false
    },

    /* ADMIN */

    {
        path: '/admin',
        redirect: '/admin/users'
    },
    {
        path: '/admin/modules',
        name: '系统管理',
        component: () => import(/* webpackChunkName: "admin_system" */ '../views/Admin/Module')
    },
    {
        path: '/admin/users_lc',
        name: '用户管理',
        component: () => import(/* webpackChunkName: "admin_user" */ '../views/Admin/User')
    },
    {
        path: '/admin/roles',
        name: '角色管理',
        component: () => import(/* webpackChunkName: "admin_role" */ '../views/Admin/User')
    },

    /* DESKTOP */
    {
        path: '/desktop',
        redirect: '/desktop/office'
    },
    {
        path: '/desktop/office',
        name: '个人办公',
        component: () => import(/* webpackChunkName: "desktop_office" */ '../views/Desktop/Office')
    },
    {
        path: '/desktop/messages',
        name: '我的消息',
        component: () => import(/* webpackChunkName: "desktop_message" */ '../views/Desktop/Message')
    },
    {
        path: '/desktop/schedules',
        name: '我的日程',
        component: () => import(/* webpackChunkName: "desktop_schedule" */ '../views/Desktop/Schedule')
    },
    {
        path: '/desktop/tasks',
        name: '我的待办',
        component: () => import(/* webpackChunkName: "desktop_task" */ '../views/Desktop/Task')
    },
    {
        path: '/bpmn',
        redirect: '/bpmn/viewBpmn'
        // component: () => import(/* webpackChunkName: "desktop_task" */ '../views/Desktop/Task')
    }
];
