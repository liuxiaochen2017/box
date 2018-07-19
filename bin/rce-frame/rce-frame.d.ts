declare module rce {
    /**
     * 框架实例对象的基类，为每个实例对象提供一个唯一的hashCode
     */
    class HashObject {
        private static _count;
        /**
         * hashObject总数量，用于监控对象数量
         */
        static readonly count: number;
        /**
         * 对象序号
         */
        readonly hashCode: number;
        constructor();
    }
}
declare module rce {
    /**
     * 监听器方法，接收一个Event实例对象做为参数
     */
    type Handler = (event?: Event) => void;
    /**
     * 事件派发与接收器
     */
    class EventDispatcher extends HashObject {
        private mapListeners;
        /**
         * 注册事件监听器
         * @param eventType 事件类型
         * @param handle 监听器
         * @param thisObject
         * @param priority 优先级
         */
        addEventListener(eventType: string, handle: Handler, thisObject?: any, priority?: number): void;
        /**
         * 移除事件监听器
         * @param eventType
         * @param handle
         * @param thisObject
         */
        removeEventListener(eventType: string, handle: Handler, thisObject?: any): void;
        /**
         * 移除所有相关事件类型的监听器
         * @param eventType
         */
        removeAllListener(eventType: string): void;
        /**
         * 派发事件
         * @param eventType
         * @param data
         */
        dispatchEvent(eventType: string, data?: any): void;
        /**
         * 监听器检查
         * @param eventType 事件类型
         * @param handle 事件监听函数
         * @param thisObject
         */
        hasEventListener(eventType: string, handle: Handler, thisObject?: any): boolean;
    }
}
declare module rce {
    /**
     * 事件实例类型
     */
    class Event extends HashObject {
        /**
         * 事件派发器对象
         */
        readonly target: EventDispatcher;
        /**
         * 事件类型
         */
        readonly eventType: string;
        /**
         * 事件携带的数据
         */
        readonly data: any;
        constructor(eventType: string, target: EventDispatcher, data?: any);
    }
}
declare module rce {
    /**
     * 添加全局监听
     * @param type
     * @param listener
     * @param thisObject
     */
    function addAction(type: string, listener: Handler, thisObject: any): void;
    /**
     * 移除全局监听
     * @param type
     * @param listener
     * @param thisObject
     */
    function removeAction(type: string, listener: Handler, thisObject: any): void;
    /**
     * 全局动作派发
     * @param type
     * @param data
     */
    function doAction(type: string, data?: any): void;
}
declare module rce {
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
    function extend(definition: any, _super: any, TAG: any): any;
}
