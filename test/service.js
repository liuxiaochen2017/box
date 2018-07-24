var TestService = rce.extend(function (_super) {
    _super();
}, rce.Service, 'TestService', function (proto) {
    proto.beforeAppStart = function (register) {
        register({
            type: 'addUser',
            handle: function (data, done, context) {
                console.log('addUser => ', data)
                done.call(context, 'SUCCESS');
            }
        })
        return Promise.resolve();
    }
})

var TestService2 = rce.extend(function (_super) {
    _super();
    this.beforeAppStart = function (register) {
        register({
            type: 'editUser',
            handle: function (data, done, context) {
                console.log('editUser => ', data);
                done.call(context, 'SUCCESS');
            }
        })
        return Promise.resolve();
    }
}, rce.Service, 'TestService2')


var app = new rce.App();
app.registerService(
    new TestService(),
    {
        beforeAppStart: function (register) {
            register({
                type: 'deleteUser',
                handle: function (data, done, context) {
                    console.log('deleteUser => ', data)
                    done.call(context, 'SUCCESS');
                },
                once: true
            })
            return Promise.resolve();
        }
    },
    new TestService2()
);

app.start().then(() => {
    app.sendNotice(new rce.Notice('addUser', { name: 'kongcong' }, data => {
        console.log('addUser result => ', data)
    }));
    app.sendNotice(new rce.Notice('editUser', { age: 20 }, function (data) {
        console.log('editUser result => ', data)
    }));
    var notice = new rce.Notice('deleteUser', { name: 'kongcong' }, data => {
        console.log('deleteUser result => ', data);
    })
    app.sendNotice(notice);
    app.sendNotice(notice);
    app.sendNotice(new rce.Notice('unknown_notice', { name: 'test2' }));
})
