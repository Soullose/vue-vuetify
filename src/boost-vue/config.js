module.exports = {
    services: {
        // 日志服务
        log: {
            name: 'log',
            level: 'info' // error > info > debug > trace
        },

        // 数据访问服务
        http: {
            name: 'http'
        },

        // 本地数据存储服务
        ls: {
            name: 'ls',
            namespace: 'boost__', // 缓存的名字空间
            storage: 'local' // 缓存方式
        }
    }
};
