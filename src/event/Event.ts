module rce {
    /**
     * 事件实例类型
     */
    export class Event extends HashObject {
        /**
         * 类型
         */
        readonly type: string;
        /**
         * 携带的数据
         */
        readonly data: any;

        constructor(type: string, data?: any) {
            super()

            this.type = type;
            this.data = data;
        }
    }
}