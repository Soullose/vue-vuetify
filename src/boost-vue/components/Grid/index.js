import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import _ from 'lodash';
import { AgGridVue } from 'ag-grid-vue';
import 'ag-grid-enterprise';

import GridCellRender from './render/GridCellRender';
import GridCellBoolRender from './render/GridCellBoolRender';
import GridCellEnumRender from './render/GridCellEnumRender';
import GridCellLineNumRender from './render/GridCellLineNumRender';
import GridCellTreeNodeRender from './render/GridCellTreeNodeRender';

import GridCellEditor from './editor/GridCellEditor';
import GridCellBoolEditor from './editor/GridCellBoolEditor';
import GridCellDialogEditor from './editor/GridCellDialogEditor';
import GridCellEnumEditor from './editor/GridCellEnumEditor';
import GridCellMenuEditor from './editor/GridCellMenuEditor';

import localeText from './locale/locale.cn';

// const GRID_ATTRS_COPY = ['rowSelection'];

// function buildGridOptions(props, options) {
//     _.extend(_.pick(props, GRID_ATTRS_COPY));
// }

const COLUMN_ATTRS_COPY = ['headerName', 'field'];
const COLUMN_ATTRS_MAP = {
    width: (val) => ({ width: _.parseInt(val) }),
    flex: () => ({ flex: 1 }),
    valueGetter: (val) => ({
        valueGetter: (params) => val(params.data)
    }),
    filter: () => ({ filter: true }),
    type: (val) => ({ type: _.split(val, ',') }),
    editable: (val) => ({ editable: val === 'true' ? true : false })
};

function columnPropsParse(props) {
    var def = _.pick(props, COLUMN_ATTRS_COPY);

    _.each(COLUMN_ATTRS_MAP, (fn, key) => {
        _.has(props, key) && _.extend(def, fn(props[key]));
    });

    return def;
}

function parseEditorParams(props, def) {
    _.each(props, (value, key) => {
        if (_.startsWith(key, 'editor-')) {
            var path = _.split(_.kebabCase(key), '-');
            path[0] = 'cellEditorParams';
            _.set(def, path, value);
        }
    });
}

// 定义行号列
function defineLineNumColumn() {
    return {
        headerName: '№',
        width: 80,
        resizable: false,
        sortable: false,
        suppressMovable: true,
        colId: 'rowIndex',
        editable: false,
        cellRendererFramework: 'GridCellLineNumRender'
    };
}

export default {
    name: 'XGrid',
    props: {
        idField: { type: String, default: 'id' }, // 用于表示数据的唯一值字段
        parentIdField: { type: String, default: 'parentId' }, // 用于表示数据的父节点
        ds: { type: Object, required: true },
        height: { type: Number, default: 400 },
        noLineNum: { type: Boolean, default: false } /* 是否显示行号 */,
        rowSelection: { type: String, default: 'single' },
        treeData: { type: Boolean, default: false }
    },

    components: {
        GridCellRender,
        GridCellBoolRender,
        GridCellEnumRender,
        GridCellLineNumRender,
        GridCellTreeNodeRender,
        GridCellEditor,
        GridCellBoolEditor,
        GridCellDialogEditor,
        GridCellEnumEditor,
        GridCellMenuEditor
    },

    data() {
        var _vm = this;
        var data = {
            options: {
                // pagination: true, // 分页
                singleClickEdit: true, // 单击开始编辑
                suppressRowDeselection: true,
                headerHeight: 40,
                animateRows: true, // 行动画
                // stopEditingWhenCellsLoseFocus: true // 表格失去焦点，自动停止编辑,
                rowGroupPanelShow: true,
                treeData: _vm.treeData, // 显示树
                getDataPath: function (data) {
                    return _vm.dataPath(data);
                },
                localeText
            },

            columnTypes: {
                bool: {
                    width: 100,
                    cellRendererFramework: 'GridCellBoolRender',
                    cellEditorFramework: 'GridCellBoolEditor'
                },

                enum: {
                    cellRendererFramework: 'GridCellEnumRender',
                    cellEditorFramework: 'GridCellEnumEditor'
                },

                object: {
                    cellEditorFramework: 'GridCellMenuEditor'
                },

                tree: {
                    cellRendererFramework: 'GridCellTreeNodeRender'
                }
            },

            // columnDefs: [{ cellRendererFramework: 'GridCellRender' }],
            defaultColDef: {
                // type: ['string'], ?colType
                defaultWidth: 120,
                minWidth: 80,
                sortable: true,
                headerName: 'Header Name',
                editable: false,
                resizable: true,
                filter: true,
                enableRowGroup: true
            },

            autoGroupColumnDef: {
                pinned: 'left',
                lockPinned: true,
                headerName: '分组',
                flex: 1,
                cellRendererFramework: 'GridCellTreeNodeRender'
            },

            selected: [],

            rowSelectedTimeout: null
        };

        return data;
    },

    computed: {
        style: () => 'height: 100%',
        data() {
            return this.ds.data;
        },
        rowNodeId() {
            return (data) => _.get(data, this.idField, undefined);
        },
        rowNodeParentId() {
            return (data) => _.get(data, this.parentIdField, undefined);
        },
        dataPath() {
            return (data) => {
                var _dataPath = _.get(this, '$dataPath', undefined);
                _dataPath === undefined && _.set(this, '$dataPath', _dataPath);

                var rowNodeId = this.rowNodeId(data);
                var path = _.get(_dataPath, rowNodeId, this.calcDataPath(data));

                return path;
            };
        }
    },

    beforeMount() {
        // Grid Options
        this.options.rowSelection = this.rowSelection;
        // buildGridOptions(this, this.options);

        var columnSlots = this.$slots.default;
        var columns = _.filter(columnSlots, (column) => column.componentOptions.tag === 'x-grid-column');
        var columnDefs = _.map(columns, (column) => {
            var attrs = column.data.attrs,
                scopedSlots = column.data.scopedSlots;

            var def = columnPropsParse(attrs);

            if (_.has(scopedSlots, 'render')) {
                // 自定义CellRender
                def.cellRendererFramework = 'GridCellRender';
                def.cellRendererParams = {
                    render: scopedSlots.render
                };
            }

            if (_.has(scopedSlots, 'editor')) {
                def.editable = true;
                // def.cellEditorFramework = 'GridCellEditor';
                def.cellEditorParams = {
                    render: scopedSlots.editor
                };
            }

            // if (def.editable == true) {
            def.valueSetter = ({ data, newValue }) => {
                var dirty = false;

                if (!_.isObject(newValue)) {
                    //
                } else {
                    var difference = _.transform(
                        newValue,
                        (result, value, key) => {
                            data[key] !== value && (result[key] = value);
                        },
                        {}
                    );
                    dirty = _.isEmpty(difference) ? false : true;
                    dirty && this.ds.modify(data, newValue, true);
                    this.$skipModify = true; // 组件自动刷新
                }

                return dirty;
            };

            // 处理编辑参数
            parseEditorParams(attrs, def);

            return def;
        });

        !this.noLineNum && columnDefs.unshift(defineLineNumColumn()); // 显示行号

        // 将树形单元格移动到Auto
        if (this.treeData) {
            var treeColumnDef = _.first(
                _.remove(columnDefs, (def) => {
                    return _.indexOf(def.type, 'tree') !== -1;
                })
            );
            treeColumnDef.cellRendererFramework = 'GridCellTreeNodeRender';
            _.extend(this.autoGroupColumnDef, treeColumnDef);
        }

        this.columnDefs = columnDefs;
    },

    created() {},

    render() {
        var _vm = this;

        return (
            <AgGridVue
                rowData={_vm.ds.data}
                style={_vm.style}
                columnDefs={_vm.columnDefs}
                defaultColDef={_vm.defaultColDef}
                autoGroupColumnDef={_vm.autoGroupColumnDef}
                columnTypes={_vm.columnTypes}
                rowSelection={_vm.rowSelection}
                getRowNodeId={_vm.rowNodeId}
                immutableData={false}
                class="ag-theme-alpine"
                gridOptions={_vm.options}
                // tabToNextCell={_vm.tabToNextCell}
                on={{
                    'grid-ready': _vm.handleGridReady,
                    'row-selected': _vm.handleRowSelected
                    // 'cell-key-down': _vm.handleCellKeyDown,
                    // 'cell-key-press': _vm.handleCellKeyPress
                }}
            ></AgGridVue>
        );
    },

    methods: {
        /* Keyboard Navigator */
        tabToNextCell(params) {
            console.log(params);
        },

        handleCellKeyDown() {
            console.log('keydown');
        },

        handleCellKeyPress() {
            console.log('keypress');
        },

        /* Tree */
        calcDataPath(row) {
            var id = this.rowNodeId(row);
            var parentId = this.rowNodeParentId(row);
            var path = [];

            while (!_.isNil(parentId)) {
                var parentPath = _.get(this.$dataPath, parentId, undefined);
                if (_.isNil(parentPath)) {
                    var parent = _.find(this.data, (row) => {
                        return this.rowNodeId(row) == parentId;
                    });

                    if (_.isNil(parent)) {
                        parentId = undefined;
                    } else {
                        path.unshift(parentId);
                        parentId = this.rowNodeParentId(parent);
                    }
                } else {
                    path = _.concat(parentPath, path);
                }
            }

            path.push(id);

            _.each(path, (rowId, index) => {
                if (_.get(this.$dataPath, rowId, undefined) == undefined) {
                    _.set(this.$dataPath, rowId, _.slice(path, index + 1));
                }
            });

            return path;
        },

        /* GRID METHOD */
        removeSelected() {
            var selectedRowNodes = this.api.getSelectedNodes();
            var selectedIds = _.map(selectedRowNodes, (rowNode) => rowNode.id);
            var data = _.filter(this.ds.data, (rowData) => selectedIds.indexOf(_.get(rowData, this.idField, undefined)) < 0);
            this.$emit('update:data', data);
        },

        remove(selectRows) {
            var selectedIds = _.map(_.toArray(selectRows), (row) => _.get(row, this.idField));
            var data = _.filter(this.ds.data, (rowData) => selectedIds.indexOf(_.get(rowData, this.idField, undefined)) < 0);
            // this.$emit('update:data', data);
            this.ds.remove(data);
        },

        setQuickFilter(text) {
            this.api.setQuickFilter(text);
        },

        /* GRID EVENT */
        handleGridReady(event) {
            this.api = event.api;
            this.columnApi = event.columnApi;
        },
        handleRowSelected: _.debounce(
            function (event) {
                console.log('点击', event.node);
                console.log('选中1', this.api.getSelectedRows());
                this.$emit('row-selected', event.node);
            },
            100,
            { leading: true, trailing: false }
        )
        // handleRowSelected(event) {
        //     console.log('llll', event.node);
        //     // console.log('handleRowSelected', event.node);
        //     // if (this.rowSelectedTimeout) clearTimeout(this.rowSelectedTimeout);
        //     // this.rowSelectedTimeout = setTimeout(() => {
        //     //     console.log('gridComponent handleRowSelected:', params.node.data);
        //     //     this.selected = this.api.getSelectedRows();
        //     //     this.rowSelectedTimeout = null;
        //     // }, 100);
        // }
    },

    watch: {
        'ds.event'(event) {
            switch (event.name) {
                case 'remove':
                    alert('xx');
                    break;
                case 'modify':
                    if (!_.get(this, '$skipModify', false)) {
                        this.api.stopEditing(true); // cancel current cell editing
                        _.delay(() => this.api.redrawRows(event.payload), 50);
                    } else {
                        //
                    }
                    this.$skipModify = false;
                    break;
                case 'add':
                    _.defer(() => {
                        var added = event.payload;
                        var row = _.first(added);
                        if (!_.isNil(row)) {
                            var node = this.api.getRowNode(this.rowNodeId(row));
                            node.setSelected(true);
                            // this.api.startEditingCell({ rowIndex: 1, colKey: 'firstName' });
                        }
                    });
            }
        },

        'ds.data'() {
            // alert('xxxxxxxxxxxxxx');
        }
    }
};
