var SubClass = rce.extend(function (_super, name) {
    _super();
    this.name = name;
}, rce.EventDispatcher, 'SubClass', function (proto) {
    proto.test = function () {
        console.log('test', this.name);
    }
})

var SubClass2 = rce.extend(function (_super, name) {
    _super(name);
    this.className = 'SubClass2';
}, SubClass, 'SubClass2', function (proto) {
    proto.test = function () {
        console.log(this.className);
    }
})
