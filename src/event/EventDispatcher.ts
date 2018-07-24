module rce {
    class Listener {
        readonly handle: Handler;
        readonly context: any;
        readonly priority: number;
        constructor(handle: Handler, context: any, priority: number) {
            this.handle = handle;
            this.context = context;
            this.priority = priority;
        }
    }

    /**
     * 监听器方法，接收一个Event实例对象做为参数
     */
    export type Handler = (event?: Event) => void;


    /**
     * 事件派发与接收器
     */
    export class EventDispatcher extends HashObject {

        private mapListeners: Object = {};

        /**
         * 注册事件监听器
         * @param eventType 事件类型
         * @param handle 监听器
         * @param thisObject 
         * @param priority 优先级
         */
        addEventListener(eventType: string, handle: Handler, thisObject: any = null, priority: number = 0) {
            const arrListener: Listener[] = this.mapListeners[eventType];
            if (!arrListener) {
                this.mapListeners[eventType] = [
                    new Listener(handle, thisObject, priority)
                ];
            } else {
                // 重复注册检查
                const repeat = arrListener.some(temp =>
                    temp.handle === handle && temp.context === thisObject);
                if (!repeat) {
                    const listener = new Listener(handle, thisObject, priority);
                    // 按优先级插入
                    for (let i = arrListener.length - 1; i >= 0; i -= 1) {
                        const temp = arrListener[i];
                        if (temp.priority >= listener.priority) {
                            arrListener.splice(i, 0, listener);
                            return;
                        }
                    }
                    arrListener.unshift(listener);
                }
            }
        }
        /**
         * 移除事件监听器
         * @param eventType 
         * @param handle 
         * @param thisObject 
         */
        removeEventListener(eventType: string, handle: Handler, thisObject?: any) {
            const arrListener: Listener[] = this.mapListeners[eventType];
            if (!arrListener) {
                return;
            }
            for (let i = arrListener.length - 1; i >= 0; i -= 1) {
                const temp = arrListener[i];
                if (temp.handle === handle && temp.context === thisObject) {
                    arrListener.splice(i, 1);
                    break;
                }
            }
            if (arrListener.length === 0) {
                delete this.mapListeners[eventType];
            }
        }
        /**
         * 移除所有相关事件类型的监听器
         * @param eventType 
         */
        removeAllListener(eventType: string) {
            if (this.mapListeners.hasOwnProperty(eventType)) {
                delete this.mapListeners[eventType];
            }
        }
        /**
         * 派发事件
         * @param eventType 
         * @param data 
         */
        dispatchWith(eventType: string, data?: any) {
            this.dispatchEvent(new Event(eventType, data))
        }
        /**
         * 派发事件
         * @param eventType 
         * @param data 
         */
        dispatchEvent(event: Event) {
            const arrListener: Listener[] = this.mapListeners[event.type];
            if (arrListener) {
                arrListener.forEach(listener => listener.handle.call(listener.context, event))
            }
        }
        /**
         * 监听器检查
         * @param eventType 事件类型
         * @param handle 事件监听函数
         * @param thisObject 
         */
        hasEventListener(eventType: string, handle: Handler, thisObject?: any): boolean {
            const arrListener: Listener[] = this.mapListeners[eventType];
            return arrListener && arrListener.some(temp =>
                temp.handle === handle && temp.context === thisObject)
        }
    }
}