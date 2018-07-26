module rce {
    /**
     * Vue 框架插件
     */
    export class VuePlugin extends Plugin {
        install(Vue) {
            const sendNotice = this.sendNotice.bind(this)
            const listenBroadcast = this.listenBroadcast.bind(this);
            // 为组件赋能
            Vue.mixin({
                beforeCreate() {
                    // __sn 与 __lb 是别名，用来方便业务开发
                    this.__sn = this.$sendNotice = sendNotice;
                    this.__lb = this.$listenBroadcast = listenBroadcast;
                }
            });
            // 为 Vue 实例赋能
            Vue.prototype.__sn = Vue.prototype.$sendNotice = sendNotice;
            Vue.prototype.__lb = Vue.prototype.$listenBroadcast = listenBroadcast;
        }
    }
}