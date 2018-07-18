module rce {
    /**
     * 框架实例对象的基类，为每个实例对象提供一个唯一的hashCode
     */
    export class HashObject {

        private static _count: number = 0;
        /**
         * hashObject总数量，用于监控对象数量
         */
        static get count(): number {
            return this._count;
        }
        /**
         * 对象序号
         */
        readonly hashCode: number;

        constructor() {
            this.hashCode = HashObject._count = HashObject._count + 1
        }
    }

}