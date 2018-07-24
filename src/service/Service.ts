module rce {
    /**
     * service 基类，封装非UI层业务逻辑，所有的service需继承此基类
     */
    export abstract class Service {
        /**
         * app 启动之前调用的钩子函数
         * 在此钩子被调用时，所有的service已挂载完毕，service实例可以在此注册要监听的事件通知类型
         * 所有的通知由根节点 app 实例派发
         * @param register (listener: INoticeListener) => void
         */
        abstract beforeAppStart(register: (listener: INoticeListener) => void): Promise<void>
        /**
         * app 启动完成后调用的钩子函数
         * service实例可以在这此阶段完成一些状态初始化
         */
        afterAppStart() {
        }
    }
}