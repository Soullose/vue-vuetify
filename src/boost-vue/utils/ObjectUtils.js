import _ from 'lodash';

// 基于lodash定义类定义函数
function defineClass(constructor, prototypes, statics) {
    constructor.prototype = prototypes;
    constructor.prototype.constructor = constructor;
    _.extend(constructor, statics);
    return constructor;
}

// 基于lodash定义子类定义函数
function defineSubclass(superclass, constructor, methods, statics) {
    constructor.prototype = Object.create(superclass.prototype);
    constructor.prototype.constructor = constructor;

    _.extend(constructor.prototype, methods);
    constructor.prototype.__super__ = superclass.prototype;
    _.extend(constructor, statics);

    return constructor;
}

// Object属性定义工厂方法
var PropertiesBuilder = defineClass(
    function (object) {
        this.object = object;
        this.descriptors = {};
    },
    {
        build: function () {
            Object.defineProperties(this.object, this.descriptors);
        },

        define: function (name, getter, setter, options) {
            this.descriptors[name] = _.extend(
                {
                    enumerable: false,
                    get: getter,
                    set: setter
                },
                options
            );
            return this;
        }
    }
);

// Object属性定义函数
function defineProperties(object) {
    return new PropertiesBuilder(object);
}

//
function defineWrappedClass(keys, constructor, prototype, statics) {
    var _prototype = _.isNil(prototype) ? {} : prototype;

    var builder = _.transform(
        keys,
        (result, key) => {
            if (_.isString(key)) {
                result.define(key, function () {
                    return _.get(this.data, key, undefined);
                });
            } else if (_.isFunction(key)) {
                result.define(key.name, key);
            }
        },
        defineProperties(_prototype)
    );

    builder.build();

    var _constructor = _.isFunction(constructor)
        ? constructor
        : function (data) {
              this.data = data;
          };

    return defineClass(_constructor, _prototype, statics);
}

export default { defineClass, defineSubclass, defineWrappedClass, defineProperties };
