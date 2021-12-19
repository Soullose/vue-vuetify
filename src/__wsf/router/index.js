module.exports = [
    { path: '/bpmn/customModel', name: '画图模式', component: () => import('../views/customModel.vue') },
    { path: '/bpmn/viewBpmn', name: '查看流程图', component: () => import('../views/viewBpmn.vue') },
    { path: '/bpmn/viewTest', name: '流程测试', component: () => import('../views/Bpmn/viewTest.vue') },
    { path: '/bpmn/processRunning', name: '执行中的流程', component: () => import('../views/Bpmn/ProcessRunning.vue') },
    { path: '/bpmn/queryMyUnfinishedTask', name: '查询待办任务', component: () => import('../views/Bpmn/queryMyUnfinishedTask.vue') }
];
