module rce {
    /**
     * 类型拓展方法
     * @param definition 类定义，必须是一个函数，且接收一个super作为参数
     * @param basicClass 要拓展的基类
     * @param tag 类名称，类定义会最终挂载到全局变量上
     * @example
     * var SubClass = rce.extend(function(_super, param){
     *   _super();
     *   this.param = param;
     * }, rce.HashObject, 'SubClass');
     * var sub = new SubClass('test');
     * console.log(sub.hashCode); // 打印继承的基类属性
     * console.log(sub.param); // 打印自身定义的实例属性
     */
    export function extend(definition, basicClass, tag) {
        const __extends = window['__extends'];
        const __reflect = window['__reflect'];
        var TempClass = (function (_super) {
            _super && __extends(TempClass, _super);
            var __super = _super ? function () {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                return _this;
            } : null;
            function TempClass() {
                Array.prototype.unshift.call(arguments, __super ? __super.bind(this) : null)
                definition.apply(this, arguments);
                return this;
            }
            return TempClass;
        })(basicClass);
        __reflect(TempClass, tag);
        return TempClass;
    }
}