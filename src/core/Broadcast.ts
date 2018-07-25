///<reference path="./Event.ts" />
module rce {
    /**
     * 广播事件
     */
    export class Broadcast extends Event {
        /**
         * 广播事件类型常量
         */
        static readonly EVENT: string = 'SYSTEM.EVENT.BROADCAST'
        /**
         * 广播类型
         */
        readonly broadcastType: string;
        /**
         * 构建一条广播
         * @param broadcastType 广播类型
         * @param data 广播数据
         */
        constructor(broadcastType: string, data?: any) {
            super(Broadcast.EVENT, data);
            this.broadcastType = broadcastType;
        }
    }
    /**
     * 广播事件处理器
     */
    export type BroadcastHandle = (broadcast: Broadcast) => void

    /**
     * 广播事件监听器
     */
    export type BroadcastListener = {
        /**
         * 监听的广播类型
         */
        broadcastType: string,
        /**
         * 广播处理器
         */
        handle: BroadcastHandle,
        /**
         * 处理器函数的 this 作用域指向
         */
        context: any
    }
}