const TestService = rce.extend(function (_super) {
    _super();
    this.__ln('to_service', (notice) => {
        console.log('service catch: ', notice)
        this.__sb('some broadcast', 1)
    })
}, rce.Service, 'TestService')

const TestService2 = rce.extend(function (_super) {
    _super();
    this.__ln('to_service2', (notice) => {
        console.log('service2 catch: ', notice)
        this.__sb('some broadcast2', 2)
    })
}, rce.Service, 'TestService2')

const service1 = new TestService();
const service2 = new TestService2();

const app = new rce.App();
app.useService(service1, service2);

// 挂载Vue插件
Vue.use(app.viewPlugin('Vue'))

const vm = new Vue({
    el: '#app'
})

app.start().then(() => {
    // 监听广播事件
    vm.__lb('some broadcast2', (broadcast) => {
        console.log('vm catch broadcast: ', broadcast)
    })
    vm.__lb('some broadcast', (broadcast) => {
        console.log('vm catch broadcast: ', broadcast)
    })
    // 视图层发送通知
    vm.__sn('to_service');
})
