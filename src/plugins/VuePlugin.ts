module rce {
    /**
     * vue 插件，给每个组件实例增加发送通知的接口及接收广播的入口
     * @example 
     * Vue.use(rce.VuePlugin(app))
     */
    export function VuePlugin(app: App) {
        return {
            install(Vue) {
                // 定义全局通知方法
                Vue.prototype.$sendNotice = function (type: string, data?: any, callback?: Function, thisObject?: any) {
                    app.sendNotice(new Notice(type, data, callback, thisObject))
                }
                // 定义广播监听注册方法
                Vue.prototype.$listen = function (type: string, listener: Function, thisObject?: any) {
                }
                // 添加配置数据
                Vue.prototype.$config = Object.freeze({
                })
            }
        }
    }

    export function ReactPlugin(app: App) {
    }
}