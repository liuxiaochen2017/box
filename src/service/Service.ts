module rce {
    /**
     * service 基类，封装非UI层业务逻辑，所有的service需继承此基类！
     * 通过`this.listenNotice()`监听指定类型的 Notice，别名`this.__ln()`
     * 通过`this.sendNotice()`发送通知，别名`this.__sn()`
     * 通过`this.listenBroadcast()`监听指定类型的 Broadcast，别名`this.__lb()`
     * 通过`this.sendBroadcast()`发送广播，别名`this.__sb()`
     */
    export abstract class Service extends EventDispatcher {

        private __noticeListeneres: NoticeListener[] = [];
        /**
         * 监听通知
         */
        protected readonly listenNotice = (noticeType: string, handle: NoticeHandle, thisObject?: any) => {
            this.__noticeListeneres.push({ noticeType, handle, context: thisObject })
        }

        private __broadcastListeneres: BroadcastListener[] = [];
        /**
         * 监听广播
         */
        protected readonly listenBroadcast = (broadcastType: string, handle: BroadcastHandle, thisObject?: any) => {
            this.__broadcastListeneres.push({ broadcastType, handle, context: thisObject })
        }
        /**
         * 发送通知
         * @param noticeType 通知类型
         * @param data 通知数据
         * @param whileDone 通知处理完成时的回调函数，可用于接收结果
         * @param context 回调函数的 this 指向
         */
        protected readonly sendNotice = (noticeType: string, data?: any, whileDone?: Function, context?: any) => {
            this.dispatchEvent(new Notice(noticeType, data, whileDone, context))
        }
        /**
         * 发送广播
         * @param broadcastType 广播类型
         * @param data 携带的数据
         */
        protected readonly sendBroadcast = (broadcastType: string, data?: any) => {
            this.dispatchEvent(new Broadcast(broadcastType, data))
        }
        /**
         * App启动时会调用的钩子函数，勿手动调用
         */
        readonly __beforeAppStart = (app: App) => {
            // 添加 Notice 监听
            app.__addNoticeListener(...this.__noticeListeneres);
            // 添加 Broadcast 监听
            app.__addBroadcastListener(...this.__broadcastListeneres);
        }
        /**
         * listenNotice 的别名方法
         */
        protected readonly __ln = this.listenNotice;
        /**
         * sendNotice 的别名方法
         */
        protected readonly __sn = this.sendNotice;
        /**
         * sendBroadcast 的别名方法
         */
        protected readonly __sb = this.sendBroadcast;
        /**
         * listenBroadcast 的别名方法
         */
        protected readonly __lb = this.listenBroadcast;
    }
}