<script>
// //
// <template>
//     //
//     <div>
//         // header //
//         <slot :x="AAA">
//             //
//             <div>我是子组件：{{ AAA }}</div>
//             //
//         </slot>
//         // footer //
//     </div>
//     //
// </template>
import _ from 'lodash';
import DataComponent from '../Base/DataComponent';
// usage:
// <x-select data="system/users" />

export default {
    name: 'XSelect',
    extends: DataComponent,

    props: {
        noReturnObject: { type: Boolean, default: false },
        autoSelect: { type: [String, Boolean, Function], default: 'first' } // last
    },

    computed: {
        items() {
            return _.isString(this.dataSource) ? this.buffer : this.dataSource;
        }
    },

    data() {
        return {
            AAA: 'XXXXXXXXXXXX'
        };
    },

    // data: () => ({
    //     selected: []
    // }),

    render() {
        // var _vm = this;
        // // var scopedSlots = _vm.$scopedSlots;
        // console.log(_vm);
        // // 子组件可以通过_vm.scope.*获取
        // // tt为具名插槽
        // var s1 = _vm.$scopedSlots.s1;
        // console.log(s1);
        // // var scopedSlots = _vm._u([
        // //     {
        // //         key: 'prepend',
        // //         fn: tt
        // //     }
        // // ]);
        // s1 = s1({
        //     p: {
        //         value: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXxxxxx'
        //     }
        // });
        // console.log(s1);
        // return <div>{[_vm.$slots.default, s1[0]]}</div>;
        // return (
        //     <v-select
        //         items={_vm.data}
        //         attrs={_vm.$attrs}
        //         on={_vm.$listeners}
        //     >
        //     </v-select>
        // );
        // return <v-btn>AA</v-btn>;

        var _vm = this;
        // console.log('_vm: ', _vm);
        // console.log('_vm.$slots: ', _vm.$slots);
        // console.log('_vm.$scopedSlots: ', _vm.$scopedSlots);
        // console.log('_vm.scope', _vm.scope);

        // 创建插槽自用
        // var s1 = _vm.$scopedSlots.s1({
        //     item: 'aa'
        // });
        // scopedSlots['prepend-item'] = function () {
        //     return (
        //         <v-list-item>
        //             <v-list-item-content>AAA</v-list-item-content>
        //         </v-list-item>
        //     );
        // };

        // const slots = ['prepend-item', 'no-data', 'append-item']
        //     .filter((slotName) => this.$slots[slotName])
        //     .map((slotName) =>
        //         this.$createElement(
        //             'template',
        //             {
        //                 slot: slotName
        //             },
        //             this.$slots[slotName]
        //         )
        //     );

        // 传递
        // var scopedSlots = ['prepend-item', 'item'].filter(
        //     _vm.$scopedSlots,
        //     () => {}
        // );

        // var _c = _vm._c;

        // var scopedSlots = _vm._u([
        //     {
        //         key: 'selection',
        //         fn: function (ref) {
        //             var item = ref.item;
        //             var index = ref.index;
        //             return [
        //                 index === 0
        //                     ? _c('v-chip', [_c('span', [_vm._v(_vm._s(item))])])
        //                     : _vm._e(),
        //                 index === 1
        //                     ? _c(
        //                           'span',
        //                           { staticClass: 'grey--text text-caption' },
        //                           [
        //                               _vm._v(
        //                                   ' (+' +
        //                                       _vm._s(_vm.value.length - 1) +
        //                                       ' others) '
        //                               )
        //                           ]
        //                       )
        //                     : _vm._e()
        //             ];
        //         }
        //     },
        //     {
        //         key: 'prepend-item',
        //         fn: function () {
        //             return [
        //                 _c(
        //                     'v-list-item-action',
        //                     [_c('v-icon', [_vm._v(_vm._s(_vm.SS))])],
        //                     1
        //                 ),
        //                 _c(
        //                     'v-list-item-content',
        //                     [_c('v-list-item-title', [_vm._v('Select All')])],
        //                     1
        //                 )
        //             ];
        //         },
        //         proxy: true
        //     }
        // ]);

        // console.log(_vm.createPrependItem());
        var scopedSlots2 = _vm._u([_vm.createPrependItem()]);

        return <v-select items={_vm.data} scopedSlots={scopedSlots2} attrs={_vm.$attrs} returnObject={!_vm.noReturnObject} on={_vm.$listeners}></v-select>;
    },

    methods: {
        handleDataChanged(data) {
            if (data.length !== 0) {
                var autoSelect = this.autoSelect;
                if (autoSelect === 'first' || autoSelect === true) {
                    this.$emit('input', _.first(data));
                } else if (autoSelect === 'last') {
                    this.$emit('input', _.last(data));
                } else if (_.isFunction(autoSelect)) {
                    this.$emit('input', _.first(_.filter(data, autoSelect)));
                }
            }
        },

        createSlotIfNotExist(key, fn, proxy) {
            proxy = _.isNil(proxy) ? false : proxy;
            var _vm = this;
            if (!_.has(_vm.$scopedSlots, key)) {
                return { key, fn, proxy };
            } else {
                return {
                    key,
                    fn: _.get(_vm.$scopedSlots, key),
                    proxy
                };
            }
        },

        createPrependItem() {
            return _.get(this.$attrs, 'multiple', false) !== false
                ? this.createSlotIfNotExist(
                      'prepend-item',
                      function () {
                          return [
                              <v-list-item>
                                  <v-list-item-action>
                                      <v-icon></v-icon>
                                  </v-list-item-action>
                                  <v-list-item-content>全选</v-list-item-content>
                              </v-list-item>,
                              <v-divider class="mt-2"></v-divider>
                          ];
                      },
                      true
                  )
                : null;
        }
    }
};
</script>
