module rce {
    /**
     * 事件实例类型
     */
    export class Event extends HashObject {
        /**
         * 事件派发器对象
         */
        readonly target: EventDispatcher;
        /**
         * 事件类型
         */
        readonly eventType: string;
        /**
         * 事件携带的数据
         */
        readonly data: any;

        constructor(eventType: string, target: EventDispatcher, data?: any) {
            super()

            this.eventType = eventType;
            this.target = target;
            this.data = data;
        }
    }
}