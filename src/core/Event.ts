///<reference path="./HashObject.ts" />
module rce {
    /**
     * 事件实例类型
     */
    export class Event extends HashObject {
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
        constructor(eventType: string, data?: any) {
            super()

            this.eventType = eventType;
            this.data = data;
        }
    }

    /**
     * 事件处理器函数，接收一个Event实例对象做为参数
     */
    export type EventHandler = (event?: Event) => void;

    /**
     * 事件监听器
     */
    export type EventListener = {
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
    }
}