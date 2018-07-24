module rce {
    /**
     * 系统通知，用于view层与service及service之间的消息传递
     */
    export class Notice extends Event {
        /**
         * 通知处理完成时的回调，由处理该通知的 service 决定调用时机
         */
        readonly callback: Function;
        /**
         * 回调函数的 this 指向
         */
        readonly context: any;

        constructor(type: string, data?: any, callback?: Function, context?: any) {
            super(type, data);
            this.callback = callback;
            this.context = context;
        }
    }
}