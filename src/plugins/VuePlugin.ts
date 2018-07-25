module rce {
    /**
     * Vue 框架插件
     */
    export class VuePlugin extends Plugin {
        install(Vue) {
            const _this = this;
            Vue.mixin({
                beforeCreate() {
                    // __s 与 __l 是别名，用来方便业务开发
                    this.__s = this.$sendNotice = _this.sendNotice.bind(_this)
                    this.__l = this.$listenBroadcast = _this.registerBroadcastListener.bind(_this);
                }
            })
        }
    }
}