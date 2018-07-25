module rce {
    /**
     * App 实例是整个前端业务的逻辑根节点。
     * view 层及 service 通过 App 实例发送通知来进行业务操作；
     * 通知分发由 App 实例对象内部完成，通知的处理由所注册的 service 实例完成；
     */
    export class App {

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
            for (let i = 0, len = this._serviceArr.length; i < len; i += 1) {
                this._serviceArr.forEach(service => {
                    // 挂载 Notice 与 Broadcast 监听器
                    service.__beforeAppStart(this)
                    // 监听 service 派发的 Notice 
                    service.addEventListener(Notice.EVENT, this.receiveNotice, this);
                    // 监听 service 派发的 Broadcast
                    service.addEventListener(Broadcast.EVENT, this.receiveBroadcast, this);
                })
            }
            // 暂时定义未异步函数，以方便后续可能的拓展
            return Promise.resolve();
        }

        // 添加通知监听器，同一类型通知只能存在一个监听器，不可重复，以此保证功能的唯一性
        __addNoticeListener(...arrNoticeListener: NoticeListener[]) {
            
        }

        // 添加广播监听器
        __addBroadcastListener(...arrBroadcastListener: BroadcastListener[]) {

        }

        // 接收通知事件
        private receiveNotice(notice: Notice) {
            // TODO 接收到 通知，发送给相应的 通知监听器
        }

        // 接收广播事件
        private receiveBroadcast(broadcast: Broadcast) {
            // TODO 接收到 广播，分发给所有的 广播接收器
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
