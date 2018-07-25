module rce {
    
    export abstract class Plugin extends EventDispatcher {
        /**
         * 发送通知
         */
        readonly sendNotice = (noticeType: string, data?: any, whileDone?: Function, context?: any) => {
            this.dispatchEvent(new Notice(noticeType, data, whileDone, context));
        }
        /**
         * 注册广播监听器
         */
        readonly registerBroadcastListener = (broadcastType: string, listener: BroadcastHandle, thisObject?: any) => {
            this.dispatchEvent(new PluginEvent({
                broadcastType,
                handle: listener,
                context: thisObject
            }))
        }
    }

    export class PluginEvent extends Event {
        /**
         * 添加广播监听器
         */
        static LISTEN_BROADCAST: string = 'add_broadcast_listener'

        constructor(broadListener: BroadcastListener) {
            super(PluginEvent.LISTEN_BROADCAST, broadListener);
        }
    }

    /**
     * 支持的插件类型
     */
    export type PluginType = 'Vue'

    /**
     * 根据框架类型获取视图层拓展插件
     * @param type 
     */
    export function getPlugin(type: PluginType): Plugin {
        switch(type) {
            case 'Vue':
            return new VuePlugin();
            default:
            throw new Error(`插件类型无效：${type}!`)
        }
    }
}