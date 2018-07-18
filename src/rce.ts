module rce {
    const emittor: EventDispatcher = new EventDispatcher();
    /**
     * 添加全局监听
     * @param type 
     * @param listener 
     * @param thisObject 
     */
    export function addAction(type: string, listener: Handler, thisObject: any): void {
        emittor.addEventListener(type, listener, thisObject);
    }
    /**
     * 移除全局监听
     * @param type 
     * @param listener 
     * @param thisObject 
     */
    export function removeAction(type: string, listener: Handler, thisObject: any): void {
        emittor.removeEventListener(type, listener, thisObject);
    }
    /**
     * 全局动作派发
     * @param type 
     * @param data 
     */
    export function doAction(type: string, data?: any):void {
        emittor.dispatchEvent(type, data);
    } 
}