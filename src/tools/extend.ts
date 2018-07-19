module rce {
    const _definition = {};
    /**
     * 类型拓展方法
     * @param definition 类定义，必须是一个函数，且接收一个super作为参数
     * @param basicClass 要拓展的基类
     * @param TAG 类名称，类定义会最终挂载到全局变量上
     * @returns 返回一个Class定义，通过new关键字调用
     * @example
     * var SubClass = rce.extend(function(_super, param){
     *   _super();
     *   this.param = param;
     * }, rce.HashObject, 'SubClass');
     * var sub = new SubClass('test');
     * console.log(sub.hashCode); // 打印继承的基类属性
     * console.log(sub.param); // 打印自身定义的实例属性
     */
    export function extend(definition, _super, TAG) {
        const __extends = window['__extends'];
        const __reflect = window['__reflect'];
        __extends(definition, _super)
        __reflect(definition.prototype, TAG);
        return definition;
    }
}