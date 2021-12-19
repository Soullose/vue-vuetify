import _ from 'lodash';

var Default = {};

// 建树规则：根据父子关系建树
// id       String              树节点ID，数据项的字段名
// name     Function | String   树节点显示名称，动态函数 Function(Object) String 或 数据项的字段名
// parentId String              树节点的父ID，数据项的字段名
// root     String | Number     树的根节点的数据，默认为null
var defaultByParentIdOptions = {
    id: 'id',
    name: 'name',
    disabled: 'disabled',
    parentId: 'parentId',
    root: null
};

/*********************************** 第1种方式：父子关系树 ***********************************/
// 根据ParentId检索Children
function fnByParentId(options, items, parentId) {
    var parts = _.partition(items, (item) => item[options.parentId] === parentId);

    var trees = _.map(parts[0], (item) =>
        _.extend({}, item, {
            $id: item[options.id],
            $name: _.isFunction(options.name) ? options.name(item) : item[options.name],
            $disabled: _.isFunction(options.disabled) ? options.disabled(item) : item[options.disabled],
            $children: fnByParentId(options, parts[1], item[options.id])
        })
    );

    return trees;
}

function makeTreeByParentId(options, data) {
    // 排序并获取不重复的数据集合
    var items = _.sortedUniqBy(data, (item) => item[options.id] + '$' + item[options.parentId]);

    return fnByParentId(options, items, options.root);
}

// 根据父子关系建树
Default.buildTreeByParentId = function (options) {
    return _.partial((options, data) => makeTreeByParentId(options, data), _.extend({}, defaultByParentIdOptions, options));
};
/*************************************************************************/

// 建树规则：根据ID层级建树
// id       String              树节点ID，数据项的字段名
// name     Function | String   树节点显示名称，动态函数 Function(Object) String 或 数据项的字段名
// offset   Number              ID层级间相差的字段数量
var defaultByIdOptions = {
    id: 'id',
    name: 'name',
    disabled: 'disabled',
    offset: 4
};

/*********************************** 第2种方式：ID层级树 ***********************************/
// 根据ParentId检索Children
function fnById(options, items, prefix) {
    var parts = _.partition(items, (item) => _.startsWith(item[options.id], prefix) && item[options.id].length === prefix.length + options.offset);

    var trees = _.map(parts[0], (item) =>
        _.extend({}, item, {
            $id: item[options.id],
            $name: _.isFunction(options.name) ? options.name(item) : item[options.name],
            $disabled: _.isFunction(options.disabled) ? options.disabled(item) : item[options.disabled],
            $children: fnById(options, parts[1], item[options.id])
        })
    );

    return trees;
}

function makeTreeById(options, data) {
    // 排序并获取不重复的数据集合
    var items = _.sortedUniqBy(data, (item) => item[options.id]);

    return fnById(options, items, '');
}

// 根据ID层级建树
Default.buildTreeById = function (options) {
    return _.partial((options, data) => makeTreeById(options, data), _.extend({}, defaultByIdOptions, options));
};
/*************************************************************************/

// 建树规则：根据指定字段建树
// fields   Array               指定树的每个层级的规则
//      id      String              树节点ID，数据项的字段名
//      name    Function | String   树节点显示名称，动态函数 Function(Object,Number) String 或 数据项的字段名
var defaultByFieldsOptions = {
    fields: [{ id: 'id', name: 'name', disabled: 'disabled' }]
};

/*********************************** 第3种方式：根据指定字段建树 ***********************************/
// 根据ParentId检索Children
function fnByFields(options, items, level, prefix) {
    var field = _.nth(options.fields, level);
    if (_.isNil(field)) return [];

    var uniqs = _.uniqBy(items, (item) => item[field.id]);

    var trees = _.map(uniqs, (uniq) => {
        var parts = _.partition(items, (item) => item[field.id] === uniq[field.id]);

        var newPrefix = prefix + (prefix.length > 0 ? '$' : '') + uniq[field.id];

        return _.extend(
            {},
            {
                $id: newPrefix,
                $name: _.isFunction(field.name) ? field.name(uniq, level) : uniq[field.name],
                $disabled: _.isFunction(field.disabled) ? field.disabled(uniq, level) : uniq[field.disabled],
                $children: fnByFields(options, parts[0], level + 1, newPrefix)
            }
        );
    });

    return trees;
}

function makeTreeByFields(options, data) {
    // 从参数列表中获取所有的id
    var fields = _.map(options.fields, 'id');

    // 根据字段进行排序，并获取不重复的集合
    var items = _.sortedUniqBy(data, (item) =>
        _.join(
            _.map(fields, (id) => item[id]),
            '$'
        )
    );

    return fnByFields(options, items, 0, '');
}

// 根据ID层级建树
Default.buildTreeByFields = function (options) {
    return _.partial((options, data) => makeTreeByFields(options, data), _.extend({}, defaultByFieldsOptions, options));
};
/*************************************************************************/

export default Default;
