module rce {
    /**
     * 通知事件：用于view层与service及service之间的消息传递。
     */
    export class Notice extends Event {
        /**
         * 通知事件类型常量
         */
        static readonly EVENT: string = 'SYSTEM.EVENT.NOTICE' 
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
        constructor(noticeType: string, data?: any, whileDone?: Function, context?: any) {
            super(Notice.EVENT, data);
            this.noticeType = noticeType;
            this.whileDone = whileDone;
            this.context = context;
        }
    }

    /**
     * 通知处理函数
     */
    export type NoticeHandle = (notice: Notice) => void
    /**
     * 通知监听器
     */
    export type NoticeListener = {
        /**
         * 监听的通知类型
         */
        noticeType: string,
        /**
         * 处理器
         */
        handle: NoticeHandle,
        /**
         * 处理器 this 作用域指向
         */
        context: any
    }
}