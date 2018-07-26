module rce {

    /**
     * 中间件函数
     * @param notice 通知事件实例
     * @param next
     * @returns 是否截断调用，若值为true，则后续中间件将不执行
     */
    export type Middleware = (notice: Notice, next: Function) => boolean | void;

    /**
     * 内置中间件
     */
    export module middleware {
        /**
         * 处理时长统计
         * @param notice 
         * @param next 
         */
        export function Log(notice: Notice, next) {
            const timestamp = Date.now();
            next(function(){
                console.log(`notice ${notice.noticeType} cost ${Date.now() - timestamp} ms`)
            })
        }
    }
}