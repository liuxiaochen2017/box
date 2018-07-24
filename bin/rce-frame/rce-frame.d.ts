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
     * 事件实例类型
     */
    class Event extends HashObject {
        /**
         * 类型
         */
        readonly type: string;
        /**
         * 携带的数据
         */
        readonly data: any;
        constructor(type: string, data?: any);
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
        dispatchWith(eventType: string, data?: any): void;
        /**
         * 派发事件
         * @param eventType
         * @param data
         */
        dispatchEvent(event: Event): void;
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
     * vue 插件，给每个组件实例增加发送通知的接口及接收广播的入口
     * @example
     * Vue.use(rce.VuePlugin(app))
     */
    function VuePlugin(app: App): {
        install(Vue: any): void;
    };
    function ReactPlugin(app: App): void;
}
declare module rce {
    /**
     * App 实例是整个前端业务的逻辑根节点。
     * view 层及 service 通过 App 实例发送通知来进行业务操作；
     * 通知分发由 App 实例对象内部完成，通知的处理由所注册的 service 实例完成；
     */
    class App {
        private _serviceArr;
        private _mapNoticeHandle;
        /**
         * 注册服务
         * @param services
         */
        registerService(...services: Service[]): void;
        /**
         * TODO
         * 注册消息中间件，可以用来跟踪消息日志、拦截消息处理、验证处理结果等
         * @param middlewares
         */
        registerMiddleware(...middlewares: any[]): void;
        /**
         * 启动app
         */
        start(): Promise<void>;
        /**
         * 广播通知
         * @param notice
         */
        sendNotice(notice: Notice): void;
        private noticeHandle(type, data?, callback?, thisObject?);
        private registerNoticeListener;
        private beforeStart(_serviceArr);
        private afterStart();
    }
}
declare module rce {
    /**
     * 通知监听器
     */
    interface INoticeListener {
        /**
         * 监听的通知类型
         */
        type: string;
        /**
         * 处理器函数
         */
        handle: (data: any, done: Function, thisObject?: any) => void;
        /**
         * 处理器this指向
         */
        thisObject?: any;
        /**
         * 是否在处理一次后移除
         */
        once?: boolean;
    }
}
declare module rce {
    /**
     * 环境常量
     */
    enum ENV {
        /**
         * 开发环境
         */
        DEVELOPMENT = 0,
        /**
         * 生产环境
         */
        PRODUCTION = 1,
    }
}
declare module rce {
    /**
     * 系统通知，用于view层与service及service之间的消息传递
     */
    class Notice extends Event {
        /**
         * 通知处理完成时的回调，由处理该通知的 service 决定调用时机
         */
        readonly callback: Function;
        /**
         * 回调函数的 this 指向
         */
        readonly context: any;
        constructor(type: string, data?: any, callback?: Function, context?: any);
    }
}
declare module rce {
    /**
     * service 基类，封装非UI层业务逻辑，所有的service需继承此基类
     */
    abstract class Service {
        /**
         * app 启动之前调用的钩子函数
         * 在此钩子被调用时，所有的service已挂载完毕，service实例可以在此注册要监听的事件通知类型
         * 所有的通知由根节点 app 实例派发
         * @param register (listener: INoticeListener) => void
         */
        abstract beforeAppStart(register: (listener: INoticeListener) => void): Promise<void>;
        /**
         * app 启动完成后调用的钩子函数
         * service实例可以在这此阶段完成一些状态初始化
         */
        afterAppStart(): void;
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
    function extend(definition: any, basicClass: any, TAG: any, editProto: any): () => any;
}
declare module rce {
    /**
     * 空函数
     */
    function noop(): void;
}
declare module rce {
    /**
     * 获取 rce 框架版本
     */
    function version(): string;
}
