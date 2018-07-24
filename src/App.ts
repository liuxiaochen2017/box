module rce {
    /**
     * App 实例是整个前端业务的逻辑根节点。
     * view 层及 service 通过 App 实例发送通知来进行业务操作；
     * 通知分发由 App 实例对象内部完成，通知的处理由所注册的 service 实例完成；
     */
    export class App {

        private _serviceArr: Service[] = [];
        private _mapNoticeHandle = {};

        /**
         * 注册服务
         * @param services 
         */
        registerService(...services: Service[]) {
            this._serviceArr.push(...services);
        }

        /**
         * TODO
         * 注册消息中间件，可以用来跟踪消息日志、拦截消息处理、验证处理结果等
         * @param middlewares 
         */
        registerMiddleware(...middlewares: any[]) {
        }

        /**
         * 启动app
         */
        start(): Promise<void> {
            return this.beforeStart(this._serviceArr.concat())
                .then(this.afterStart)
                .catch(Promise.reject)
        }

        /**
         * 广播通知
         * @param notice
         */
        sendNotice(notice: Notice) {
            this.noticeHandle(notice.type, notice.data, notice.callback, notice.context);
        }

        // 处理通知
        private noticeHandle(type: string, data?: any, callback?: Function, thisObject?: any) {
            // 查找处理函数
            const listener: INoticeListener = this._mapNoticeHandle[type];
            if (!listener) {
                console.warn(`未监听的通知类型：${type}`);
                return;
            }
            const { handle, once } = listener;
            handle.call(listener.thisObject, data, callback || noop, thisObject);
            once && delete this._mapNoticeHandle[type];
        }

        // 注册通知观察者
        private registerNoticeListener = (...listeneres: INoticeListener[]) => {
            for (let i = listeneres.length - 1; i >= 0; i -= 1) {
                const listener = listeneres[i];
                const { type } = listener;
                if (this._mapNoticeHandle.hasOwnProperty(type)) {
                    throw new Error(`noticeType: '${type}' 注册重复！`);
                }
                this._mapNoticeHandle[type] = listener
            }
        }

        private beforeStart(_serviceArr: Service[]) {
            console.log('------ beforeStart ------')
            if (_serviceArr.length) {
                const service = _serviceArr.shift();
                return service.beforeAppStart(this.registerNoticeListener)
                    .then(() => this.beforeStart(_serviceArr))
                    .catch(Promise.reject);
            } else {
                return Promise.resolve();
            }
        }

        private afterStart() {
            console.log('------ afterStart ------')
        }
    }
}
