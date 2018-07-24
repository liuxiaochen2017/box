module rce {
    /**
     * 通知监听器
     */
    export interface INoticeListener {
        /**
         * 监听的通知类型
         */
        type: string,
        /**
         * 处理器函数
         */
        handle: (data: any, done: Function, thisObject?: any) => void,
        /**
         * 处理器this指向
         */
        thisObject?: any,
        /**
         * 是否在处理一次后移除
         */
        once?: boolean
    }
}