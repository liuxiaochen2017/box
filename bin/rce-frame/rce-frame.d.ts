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
         * 事件类型
         */
        readonly eventType: string;
        /**
         * 传递的数据
         */
        readonly data: any;
        /**
         * 构建一个事件对象
         * @param eventType 事件类型
         * @param data 事件传递的数据
         */
        constructor(eventType: string, data?: any);
    }
    /**
     * 事件处理器函数，接收一个Event实例对象做为参数
     */
    type EventHandler = (event?: Event) => void;
    /**
     * 事件监听器
     */
    type EventListener = {
        /**
         * 处理器
         */
        readonly handle: EventHandler;
        /**
         * 处理器函数的 this 作用域指向
         */
        readonly context: any;
        /**
         * 优先级
         */
        readonly priority: number;
    };
}
declare module rce {
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
        addEventListener(eventType: string, handle: EventHandler, thisObject?: any, priority?: number): void;
        /**
         * 移除事件监听器
         * @param eventType
         * @param handle
         * @param thisObject
         */
        removeEventListener(eventType: string, handle: EventHandler, thisObject?: any): void;
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
        hasEventListener(eventType: string, handle: EventHandler, thisObject?: any): boolean;
    }
}
declare module rce {
    abstract class Plugin extends EventDispatcher {
        /**
         * 发送通知
         */
        readonly sendNotice: (noticeType: string, data?: any, whileDone?: Function, context?: any) => void;
        /**
         * 注册广播监听器
         */
        readonly registerBroadcastListener: (broadcastType: string, listener: BroadcastHandle, thisObject?: any) => void;
    }
    class PluginEvent extends Event {
        /**
         * 添加广播监听器
         */
        static LISTEN_BROADCAST: string;
        constructor(broadListener: BroadcastListener);
    }
    /**
     * 支持的插件类型
     */
    type PluginType = 'Vue';
    /**
     * 根据框架类型获取视图层拓展插件
     * @param type
     */
    function getPlugin(type: PluginType): Plugin;
}
declare module rce {
    /**
     * 通知事件：用于view层与service及service之间的消息传递。
     */
    class Notice extends Event {
        /**
         * 通知事件类型常量
         */
        static readonly EVENT: string;
        /**
         * 通知处理完成时的回调，由处理该通知的 Service 决定调用时机
         */
        readonly whileDone: Function;
        /**
         * 回调函数的 this 指向
         */
        readonly context: any;
        /**
         * 通知类型
         */
        readonly noticeType: string;
        /**
         * 构建一条通知
         * @param noticeType 通知类型
         * @param data 通知数据
         * @param whileDone 通知处理完成时的回调函数，可用于接收结果
         * @param context 回调函数的 this 指向
         */
        constructor(noticeType: string, data?: any, whileDone?: Function, context?: any);
    }
    /**
     * 通知处理函数
     */
    type NoticeHandle = (notice: Notice) => void;
    /**
     * 通知监听器
     */
    type NoticeListener = {
        /**
         * 监听的通知类型
         */
        noticeType: string;
        /**
         * 处理器
         */
        handle: NoticeHandle;
        /**
         * 处理器 this 作用域指向
         */
        context: any;
    };
}
declare module rce {
    /**
     * 广播事件
     */
    class Broadcast extends Event {
        /**
         * 广播事件类型常量
         */
        static readonly EVENT: string;
        /**
         * 广播类型
         */
        readonly broadcastType: string;
        /**
         * 构建一条广播
         * @param broadcastType 广播类型
         * @param data 广播数据
         */
        constructor(broadcastType: string, data?: any);
    }
    /**
     * 广播事件处理器
     */
    type BroadcastHandle = (broadcast: Broadcast) => void;
    /**
     * 广播事件监听器
     */
    type BroadcastListener = {
        /**
         * 监听的广播类型
         */
        broadcastType: string;
        /**
         * 广播处理器
         */
        handle: BroadcastHandle;
        /**
         * 处理器函数的 this 作用域指向
         */
        context: any;
    };
}
declare module rce {
    /**
     * Vue 框架插件
     */
    class VuePlugin extends Plugin {
        install(Vue: any): void;
    }
}
declare module rce {
    /**
     * App 实例是整个前端业务的逻辑根节点。
     * view 层及 service 通过 App 实例发送通知来进行业务操作；
     * 通知分发由 App 实例对象内部完成，通知的处理由所注册的 service 实例完成；
     */
    class App {
        private _serviceArr;
        /**
         * 注册服务
         * @param services
         */
        useService(...services: Service[]): void;
        /**
         * TODO
         * 注册消息中间件，可以用来跟踪消息日志、拦截消息处理、验证处理结果等
         * @param middlewares
         */
        /**
         * 启动app
         */
        start(): Promise<void>;
        __addNoticeListener(...arrNoticeListener: NoticeListener[]): void;
        __addBroadcastListener(...arrBroadcastListener: BroadcastListener[]): void;
        private receiveNotice(notice);
        private receiveBroadcast(broadcast);
        private _viewPlugin;
        /**
         * 获取视图组件插件
         * @param type
         * @example
         * Vue框架使用方法
         * `Vue.use(app.viewPlugin('Vue'))`
         * 给组件增加发送通知及接收广播的能力
         * `this.$sendNotice('') // 发送通知`
         * `this.$listenBroadcast('') // 监听广播`
         */
        viewPlugin(type: PluginType): Plugin;
    }
}
declare module rce {
    /**
     * service 基类，封装非UI层业务逻辑，所有的service需继承此基类！
     * 通过`this.registerNoticeListener()`注册要处理的`Notice`类型及相应处理方法！
     * @example this.registerNoticeListener('')
     * 通过`this.listenBroadcast()`监听相应的`Broadcast`类型
     *
     */
    abstract class Service extends EventDispatcher {
        private __noticeListeneres;
        /**
         * 注册通知处理函数，用来处理 Notice 实例
         */
        protected readonly registerNoticeListener: (noticeType: string, handle: NoticeHandle, thisObject?: any) => void;
        private __broadcastListeneres;
        /**
         * 注册广播处理函数，用于接收广播数据
         */
        protected readonly listenBroadcast: (broadcastType: string, handle: BroadcastHandle, thisObject?: any) => void;
        /**
         * 发送通知
         * @param noticeType 通知类型
         * @param data 通知数据
         * @param whileDone 通知处理完成时的回调函数，可用于接收结果
         * @param context 回调函数的 this 指向
         */
        protected readonly sendNotice: (noticeType: string, data?: any, whileDone?: Function, context?: any) => void;
        /**
         * 发送广播
         * @param broadcastType 广播类型
         * @param data 携带的数据
         */
        protected readonly sendBroadcast: (broadcastType: string, data?: any) => void;
        readonly __install: (app: App) => void;
        /**
         * sendNotice 的别名方法
         */
        protected readonly __s: (noticeType: string, data?: any, whileDone?: Function, context?: any) => void;
        /**
         * listenBroadcast 的别名方法
         */
        protected readonly __l: (broadcastType: string, handle: BroadcastHandle, thisObject?: any) => void;
    }
}
declare module rce {
    /**
     * 添加全局监听，由于是直接挂载的顶级对象rce上，故通过该方法可进行跨 App 之间的通信
     * @param type
     * @param listener
     * @param thisObject
     */
    function addAction(type: string, listener: EventHandler, thisObject: any): void;
    /**
     * 移除全局监听
     * @param type
     * @param listener
     * @param thisObject
     */
    function removeAction(type: string, listener: EventHandler, thisObject: any): void;
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
