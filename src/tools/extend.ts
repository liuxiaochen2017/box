module rce {
    /**
     * 类型拓展方法
     * @param definition 类定义，必须是一个函数
     * @param _super 要拓展的基类
     * @param TAG 类名称，通过__types__来追溯继承路径
     * @returns 返回一个Class定义，通过new关键字调用
     * @example
     * var SubClass = rce.extend(function SubClass(param){
     *   rce.HashObject.call(this)
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