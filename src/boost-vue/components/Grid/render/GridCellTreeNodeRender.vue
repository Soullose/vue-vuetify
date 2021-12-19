<script>
import _ from 'lodash';
// <template>
//     <div>AAA</div>
// </template>

export default {
    computed: {
        itemLevel() {
            return 0;
        },

        itemIcon() {
            return _.isNil(this.params.node.allChildrenCount) ? 'mdi-blank' : this.params.node.expanded ? 'mdi-folder-open-outline' : 'mdi-folder-outline';
        },

        itemColor() {
            return 'yellow darken-4';
        },
        level() {
            return this.params.node.level;
        },
        itemValue() {
            return this.params.value;
        }
    },
    methods: {
        toggleNodeExpanded(event) {
            this.params.api.setRowNodeExpanded(this.params.node, !this.params.node.expanded);
            event.stopPropagation();
        }
    },
    render() {
        var _vm = this;

        var listeners = _.isNil(_vm.params.node.allChildrenCount)
            ? {}
            : {
                  click: _vm.toggleNodeExpanded
              };

        var customRender = _.get(_vm.params.colDef, 'cellRendererParams.render');

        var render = _.isNil(customRender) ? <span>{_vm.itemValue}</span> : customRender(_vm.params);

        return (
            <span>
                <span style={'padding-left: ' + _vm.level * 24 + 'px'} />
                <v-icon left color={_vm.itemColor} on={listeners}>
                    {_vm.itemIcon}
                </v-icon>
                {render}
            </span>
        );
    }
};
</script>
