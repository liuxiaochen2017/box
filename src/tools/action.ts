module rce {
    const emittor: EventDispatcher = new EventDispatcher();
    /**
     * 添加全局监听，由于是直接挂载的顶级对象rce上，故通过该方法可进行跨 App 之间的通信
     * @param type 
     * @param listener 
     * @param thisObject 
     */
    export function addAction(type: string, listener: EventHandler, thisObject: any): void {
        emittor.addEventListener(type, listener, thisObject);
    }
    /**
     * 移除全局监听
     * @param type 
     * @param listener 
     * @param thisObject 
     */
    export function removeAction(type: string, listener: EventHandler, thisObject: any): void {
        emittor.removeEventListener(type, listener, thisObject);
    }
    /**
     * 全局动作派发
     * @param type 
     * @param data 
     */
    export function doAction(type: string, data?: any): void {
        emittor.dispatchWith(type, data);
    }
}