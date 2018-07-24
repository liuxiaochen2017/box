module rce {
    /**
     * 类型拓展方法
     * @param definition 类定义，必须是一个函数，且接收一个super作为参数
     * @param basicClass 要拓展的基类
     * @param TAG 类名标识，可通过类定义的CustomClass.prototype.__class__获取到
     * @param editProto 修改类定义的原型，该方法接收一个参数，参数指向类定义的原型对象
     * @returns 返回一个Class定义，通过new关键字调用
     * @example
     * var SubClass = rce.extend(function(_super, param){
     *     // 定义动态属性，并调用父类的构造函数
     *     _super();
     *     this.param = param;
     * }, rce.HashObject, 'SubClass', function(proto) {
     *     // proto 即 SubClass.prototype
     *     proto.getParam = function() {
     *         return this.param + '_' + this.hashCode
     *     }
     * });
     * var sub = new SubClass('test');
     * console.log(sub.hashCode); // 打印继承的基类属性
     * console.log(sub.getParam()); // 打印自身定义的实例方法
     */
    export function extend(definition, basicClass, TAG, editProto) {
        const __extends = window['__extends'];
        const __reflect = window['__reflect'];
        var CustomClass = (function (_super) {
            _super && __extends(CustomClass, _super);
            var __super = _super ? function () {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                return _this;
            } : null;
            function CustomClass() {
                Array.prototype.unshift.call(arguments, __super ? __super.bind(this) : null)
                definition.apply(this, arguments);
                return this;
            }
            editProto && editProto(CustomClass.prototype);
            return CustomClass;
        })(basicClass);
        __reflect(CustomClass.prototype, TAG);
        return CustomClass;
    }
}
