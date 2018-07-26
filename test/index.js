// 创建服务
const Service = rce.extend(function (_super) {
    _super();
    // 监听 Notice
    this.__ln('to_service', (notice) => {
        console.log('---- service caught notice data ----')
        console.log(notice.data)
        console.log('---- service send broadcast ----')
        this.__sb('to_component', `I caught an notice data: ${notice.data}`)
    })
    this.__ln('async_notice', (notice) => {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(3000)
            }, 3000);
        })
    })
    // 监听 Broadcast
    this.__lb('some_broadcast', (broadcast) => {
        console.log(broadcast);
    })
}, rce.Service, 'Service')

// 创建app
const app = new rce.App();

// 挂载 service 实例
app.useService(new Service());

// 使用内置中间件，rce.middleware中内置了一些中间件
app.useMiddleware(rce.middleware.Log)

// 自定义中间件，拦截to_service通知
function mid(notice, next) {
    if (notice.noticeType === 'to_service') {
        return true;
    }
    next()
}
app.useMiddleware(mid);

// 使用 Vue 插件为 Vue 实例及其组件赋能
Vue.use(app.viewPlugin('Vue'))

// 定义组件
Vue.component('my-button', {
    props: ['label', 'index'],
    template: `
        <button @click='sendTo'>{{label}}</button>
    `,
    created: function() {
        // 组件监听广播
        this.__lb('to_component', function(broadcast) {
            console.log(`---- component ${this.index} caught broadcast data ----`);
            console.log(broadcast.data);
        }, this)
    },
    methods: {
        sendTo: function() {
            // 组件发送 Notice
            console.log(`---- component ${this.index} send notice ----`);
            this.__sn('to_service', this.label);
        }
    }
})

const vm = new Vue({
    el: '#app',
    template: `<div id='app'>
        <my-button index='1' label='hello'></my-button>
        <my-button index='2' label='world'></my-button>
    </div>`
})

// 启动App
app.start().then(() => {
    vm.__lb('to_vm', (broadcast) => {
        console.log('---- vm caught broadcast data ----');
        console.log(broadcast.data);
    })
    console.log('---- vm send notice ----');
    // Vue 实例发送 Notice
    vm.__sn('async_notice', 'I am vm', (err, data) => {
        console.log('---- vm notice done ----')
        console.log(err, data)
    });
})
