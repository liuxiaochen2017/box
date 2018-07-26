///<reference path="./core/HashObject.ts" />
module rce {
    /**
     * App 实例是整个前端业务的逻辑根节点。
     * view 层及 service 通过 App 实例发送通知来进行业务操作；
     * 通知分发由 App 实例对象内部完成，通知的处理由所注册的 service 实例完成；
     */
    export class App extends HashObject {

        private _serviceArr: Service[] = [];

        /**
         * 注册服务
         * @param services 
         */
        useService(...services: Service[]) {
            this._serviceArr.push(...services);
        }

        /**
         * TODO
         * 注册消息中间件，可以用来跟踪消息日志、拦截消息处理、验证处理结果等
         * @param middlewares 
         */
        // useMiddleware(...middlewares: any[]) {
        // }

        /**
         * 启动app
         */
        start(): Promise<void> {
            this._serviceArr.forEach(service => {
                // 挂载 Notice 与 Broadcast 监听器
                service.__beforeAppStart(this)
                // 监听 service 派发的 Notice 
                service.addEventListener(Notice.EVENT, this.receiveNotice, this);
                // 监听 service 派发的 Broadcast
                service.addEventListener(Broadcast.EVENT, this.receiveBroadcast, this);
            })
            // 暂时定义未异步函数，以方便后续可能的拓展
            return Promise.resolve();
        }

        private _mapNoticeListener = {};

        // 添加通知监听器，同一类型通知只能存在一个监听器，不可重复，以此保证功能的唯一性
        __addNoticeListener(...arrNoticeListener: NoticeListener[]) {
            for (let i = 0, len = arrNoticeListener.length; i < len; i += 1) {
                const listener = arrNoticeListener[i];
                const noticeType = listener.noticeType;
                if (this._mapNoticeListener[noticeType]) {
                    throw new Error(`每个特定的Notice类型消息只能存在唯一一个监听器: ${noticeType}`);
                }
                this._mapNoticeListener[noticeType] = listener;
            }
        }

        // 接收通知事件
        private receiveNotice(notice: Notice) {
            const noticeType = notice.noticeType;
            // 查找通知监听器
            const listener: NoticeListener = this._mapNoticeListener[noticeType];
            if (!listener) {
                console.warn(`未处理的通知: ${noticeType}！请检查 Notice 事件监听，并确保已调用 App 实例的 start() 方法`);
                return;
            }
            listener.handle.call(listener.context, notice);
        }

        private _mapBroadcastListener = {};

        // 添加广播监听器
        __addBroadcastListener(...arrBroadcastListener: BroadcastListener[]) {
            for (let i = 0, len = arrBroadcastListener.length; i < len; i += 1) {
                const listener = arrBroadcastListener[i];
                // 监听的广播类型
                const type = listener.broadcastType;
                const arrListener: BroadcastListener[] = this._mapBroadcastListener[type]
                if (!arrListener) {
                    this._mapBroadcastListener[type] = [listener];
                } else {
                    arrListener.push(listener);
                }
            }
        }

        // 接收广播事件
        private receiveBroadcast(broadcast: Broadcast) {
            const type = broadcast.broadcastType
            // 按广播类型查找监听器
            const arrListener: BroadcastListener[] = this._mapBroadcastListener[type]
            if (!arrListener) {
                console.warn(`未处理的广播: ${type}！请检查广播监听，并确保已调用 App 实例的 start() 方法`);
                return;
            }
            // 逐一发送广播数据
            arrListener.forEach(lisener => lisener.handle.call(lisener.context, broadcast))
        }

        private _viewPlugin: Plugin;

        /**
         * 获取视图组件插件
         * @param type 
         * @example 
         * Vue框架使用方法
         * `Vue.use(app.viewPlugin('Vue'))`
         * 给组件增加发送通知及接收广播的能力
         * * 发送通知
         * `this.$sendNotice('')`
         * 别名方法 `this.__s('')`
         * * 监听广播
         * `this.$listenBroadcast('')`
         * 别名方法：`this.__l`
         */
        public viewPlugin(type: PluginType): Plugin {
            if (!this._viewPlugin) {
                this._viewPlugin = getPlugin(type);
                // 监听从视图层派发的 Notice 数据
                this._viewPlugin.addEventListener(Notice.EVENT, this.receiveNotice, this);
                // 监听视图组件注册 Broadcast 监听器
                this._viewPlugin.addEventListener(PluginEvent.LISTEN_BROADCAST, (event: PluginEvent) => {
                    this.__addBroadcastListener(event.data);
                });
            }
            return this._viewPlugin;
        }
    }
}
