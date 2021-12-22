// 初始化表单数据
export function initListenerForm(listener) {
    let self = {
        ...listener
    };
    if (listener.script) {
        self = {
            ...listener,
            ...listener.script,
            scriptType: listener.script.resource ? 'externalScript' : 'inlineScript'
        };
    }
    if (listener.event === 'timeout' && listener.eventDefinitions) {
        if (listener.eventDefinitions.length) {
            let k = '';
            for (let key in listener.eventDefinitions[0]) {
                console.log(listener.eventDefinitions, key);
                if (key.indexOf('time') !== -1) {
                    k = key;
                    self.eventDefinitionType = key.replace('time', '').toLowerCase();
                }
            }
            console.log(k);
            self.eventTimeDefinitions = listener.eventDefinitions[0][k].body;
        }
    }
    return self;
}

export function initListenerType(listener) {
    let listenerType;
    if (listener.class) listenerType = 'classListener';
    if (listener.expression) listenerType = 'expressionListener';
    if (listener.delegateExpression) listenerType = 'delegateExpressionListener';
    if (listener.script) listenerType = 'scriptListener';
    return {
        ...JSON.parse(JSON.stringify(listener)),
        ...(listener.script ?? {}),
        listenerType: listenerType
    };
}
// 返回 flowable:TaskListener 或者 flowable:ExecutionListener
export function isTaskListener(isTask) {
    return `flowable:${isTask ? 'TaskListener' : 'ExecutionListener'}`;
}

export const listenerType = [
    { text: 'Java 类', value: 'classListener' },
    { text: '表达式', value: 'expressionListener' },
    { text: '代理表达式', value: 'delegateExpressionListener' },
    { text: '脚本', value: 'scriptListener' }
];
// {
//     classListener: 'Java 类',
//     expressionListener: '表达式',
//     delegateExpressionListener: '代理表达式',
//     scriptListener: '脚本'
// }

export const eventType = [
    { text: '创建', value: 'create' },
    { text: '指派', value: 'assignment' },
    { text: '完成', value: 'complete' },
    { text: '删除', value: 'delete' },
    { text: '更新', value: 'update' },
    { text: '超时', value: 'timeout' }
];
// {
//     create: '创建',
//     assignment: '指派',
//     complete: '完成',
//     delete: '删除',
//     update: '更新',
//     timeout: '超时'
// };

export const fieldType = {
    string: '字符串',
    expression: '表达式'
};
