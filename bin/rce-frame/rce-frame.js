var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var rce;
(function (rce) {
    /**
     * 框架实例对象的基类，为每个实例对象提供一个唯一的hashCode
     */
    var HashObject = (function () {
        function HashObject() {
            this.hashCode = HashObject._count = HashObject._count + 1;
        }
        Object.defineProperty(HashObject, "count", {
            /**
             * hashObject总数量，用于监控对象数量
             */
            get: function () {
                return this._count;
            },
            enumerable: true,
            configurable: true
        });
        HashObject._count = 0;
        return HashObject;
    }());
    rce.HashObject = HashObject;
    __reflect(HashObject.prototype, "rce.HashObject");
})(rce || (rce = {}));
var rce;
(function (rce) {
    /**
     * 事件实例类型
     */
    var Event = (function (_super) {
        __extends(Event, _super);
        function Event(type, data) {
            var _this = _super.call(this) || this;
            _this.type = type;
            _this.data = data;
            return _this;
        }
        return Event;
    }(rce.HashObject));
    rce.Event = Event;
    __reflect(Event.prototype, "rce.Event");
})(rce || (rce = {}));
var rce;
(function (rce) {
    var Listener = (function () {
        function Listener(handle, context, priority) {
            this.handle = handle;
            this.context = context;
            this.priority = priority;
        }
        return Listener;
    }());
    __reflect(Listener.prototype, "Listener");
    /**
     * 事件派发与接收器
     */
    var EventDispatcher = (function (_super) {
        __extends(EventDispatcher, _super);
        function EventDispatcher() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.mapListeners = {};
            return _this;
        }
        /**
         * 注册事件监听器
         * @param eventType 事件类型
         * @param handle 监听器
         * @param thisObject
         * @param priority 优先级
         */
        EventDispatcher.prototype.addEventListener = function (eventType, handle, thisObject, priority) {
            if (thisObject === void 0) { thisObject = null; }
            if (priority === void 0) { priority = 0; }
            var arrListener = this.mapListeners[eventType];
            if (!arrListener) {
                this.mapListeners[eventType] = [
                    new Listener(handle, thisObject, priority)
                ];
            }
            else {
                // 重复注册检查
                var repeat = arrListener.some(function (temp) {
                    return temp.handle === handle && temp.context === thisObject;
                });
                if (!repeat) {
                    var listener = new Listener(handle, thisObject, priority);
                    // 按优先级插入
                    for (var i = arrListener.length - 1; i >= 0; i -= 1) {
                        var temp = arrListener[i];
                        if (temp.priority >= listener.priority) {
                            arrListener.splice(i, 0, listener);
                            return;
                        }
                    }
                    arrListener.unshift(listener);
                }
            }
        };
        /**
         * 移除事件监听器
         * @param eventType
         * @param handle
         * @param thisObject
         */
        EventDispatcher.prototype.removeEventListener = function (eventType, handle, thisObject) {
            var arrListener = this.mapListeners[eventType];
            if (!arrListener) {
                return;
            }
            for (var i = arrListener.length - 1; i >= 0; i -= 1) {
                var temp = arrListener[i];
                if (temp.handle === handle && temp.context === thisObject) {
                    arrListener.splice(i, 1);
                    break;
                }
            }
            if (arrListener.length === 0) {
                delete this.mapListeners[eventType];
            }
        };
        /**
         * 移除所有相关事件类型的监听器
         * @param eventType
         */
        EventDispatcher.prototype.removeAllListener = function (eventType) {
            if (this.mapListeners.hasOwnProperty(eventType)) {
                delete this.mapListeners[eventType];
            }
        };
        /**
         * 派发事件
         * @param eventType
         * @param data
         */
        EventDispatcher.prototype.dispatchWith = function (eventType, data) {
            this.dispatchEvent(new rce.Event(eventType, data));
        };
        /**
         * 派发事件
         * @param eventType
         * @param data
         */
        EventDispatcher.prototype.dispatchEvent = function (event) {
            var arrListener = this.mapListeners[event.type];
            if (arrListener) {
                arrListener.forEach(function (listener) { return listener.handle.call(listener.context, event); });
            }
        };
        /**
         * 监听器检查
         * @param eventType 事件类型
         * @param handle 事件监听函数
         * @param thisObject
         */
        EventDispatcher.prototype.hasEventListener = function (eventType, handle, thisObject) {
            var arrListener = this.mapListeners[eventType];
            return arrListener && arrListener.some(function (temp) {
                return temp.handle === handle && temp.context === thisObject;
            });
        };
        return EventDispatcher;
    }(rce.HashObject));
    rce.EventDispatcher = EventDispatcher;
    __reflect(EventDispatcher.prototype, "rce.EventDispatcher");
})(rce || (rce = {}));
var rce;
(function (rce) {
    /**
     * vue 插件，给每个组件实例增加发送通知的接口及接收广播的入口
     * @example
     * Vue.use(rce.VuePlugin(app))
     */
    function VuePlugin(app) {
        return {
            install: function (Vue) {
                // 定义全局通知方法
                Vue.prototype.$sendNotice = function (type, data, callback, thisObject) {
                    app.sendNotice(new rce.Notice(type, data, callback, thisObject));
                };
                // 定义广播监听注册方法
                Vue.prototype.$listen = function (type, listener, thisObject) {
                };
                // 添加配置数据
                Vue.prototype.$config = Object.freeze({});
            }
        };
    }
    rce.VuePlugin = VuePlugin;
    function ReactPlugin(app) {
    }
    rce.ReactPlugin = ReactPlugin;
})(rce || (rce = {}));
var rce;
(function (rce) {
    /**
     * App 实例是整个前端业务的逻辑根节点。
     * view 层及 service 通过 App 实例发送通知来进行业务操作；
     * 通知分发由 App 实例对象内部完成，通知的处理由所注册的 service 实例完成；
     */
    var App = (function () {
        function App() {
            var _this = this;
            this._serviceArr = [];
            this._mapNoticeHandle = {};
            // 注册通知观察者
            this.registerNoticeListener = function () {
                var listeneres = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    listeneres[_i] = arguments[_i];
                }
                for (var i = listeneres.length - 1; i >= 0; i -= 1) {
                    var listener = listeneres[i];
                    var type = listener.type;
                    if (_this._mapNoticeHandle.hasOwnProperty(type)) {
                        throw new Error("noticeType: '" + type + "' \u6CE8\u518C\u91CD\u590D\uFF01");
                    }
                    _this._mapNoticeHandle[type] = listener;
                }
            };
        }
        /**
         * 注册服务
         * @param services
         */
        App.prototype.registerService = function () {
            var services = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                services[_i] = arguments[_i];
            }
            (_a = this._serviceArr).push.apply(_a, services);
            var _a;
        };
        /**
         * TODO
         * 注册消息中间件，可以用来跟踪消息日志、拦截消息处理、验证处理结果等
         * @param middlewares
         */
        App.prototype.registerMiddleware = function () {
            var middlewares = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                middlewares[_i] = arguments[_i];
            }
        };
        /**
         * 启动app
         */
        App.prototype.start = function () {
            return this.beforeStart(this._serviceArr.concat())
                .then(this.afterStart)
                .catch(Promise.reject);
        };
        /**
         * 广播通知
         * @param notice
         */
        App.prototype.sendNotice = function (notice) {
            this.noticeHandle(notice.type, notice.data, notice.callback, notice.context);
        };
        // 处理通知
        App.prototype.noticeHandle = function (type, data, callback, thisObject) {
            // 查找处理函数
            var listener = this._mapNoticeHandle[type];
            if (!listener) {
                console.warn("\u672A\u76D1\u542C\u7684\u901A\u77E5\u7C7B\u578B\uFF1A" + type);
                return;
            }
            var handle = listener.handle, once = listener.once;
            handle.call(listener.thisObject, data, callback || rce.noop, thisObject);
            once && delete this._mapNoticeHandle[type];
        };
        App.prototype.beforeStart = function (_serviceArr) {
            var _this = this;
            console.log('------ beforeStart ------');
            if (_serviceArr.length) {
                var service = _serviceArr.shift();
                return service.beforeAppStart(this.registerNoticeListener)
                    .then(function () { return _this.beforeStart(_serviceArr); })
                    .catch(Promise.reject);
            }
            else {
                return Promise.resolve();
            }
        };
        App.prototype.afterStart = function () {
            console.log('------ afterStart ------');
        };
        return App;
    }());
    rce.App = App;
    __reflect(App.prototype, "rce.App");
})(rce || (rce = {}));
var rce;
(function (rce) {
    /**
     * 环境常量
     */
    var ENV;
    (function (ENV) {
        /**
         * 开发环境
         */
        ENV[ENV["DEVELOPMENT"] = 0] = "DEVELOPMENT";
        /**
         * 生产环境
         */
        ENV[ENV["PRODUCTION"] = 1] = "PRODUCTION";
    })(ENV = rce.ENV || (rce.ENV = {}));
})(rce || (rce = {}));
var rce;
(function (rce) {
    /**
     * 系统通知，用于view层与service及service之间的消息传递
     */
    var Notice = (function (_super) {
        __extends(Notice, _super);
        function Notice(type, data, callback, context) {
            var _this = _super.call(this, type, data) || this;
            _this.callback = callback;
            _this.context = context;
            return _this;
        }
        return Notice;
    }(rce.Event));
    rce.Notice = Notice;
    __reflect(Notice.prototype, "rce.Notice");
})(rce || (rce = {}));
var rce;
(function (rce) {
    /**
     * service 基类，封装非UI层业务逻辑，所有的service需继承此基类
     */
    var Service = (function () {
        function Service() {
        }
        /**
         * app 启动完成后调用的钩子函数
         * service实例可以在这此阶段完成一些状态初始化
         */
        Service.prototype.afterAppStart = function () {
        };
        return Service;
    }());
    rce.Service = Service;
    __reflect(Service.prototype, "rce.Service");
})(rce || (rce = {}));
var rce;
(function (rce) {
    var emittor = new rce.EventDispatcher();
    /**
     * 添加全局监听
     * @param type
     * @param listener
     * @param thisObject
     */
    function addAction(type, listener, thisObject) {
        emittor.addEventListener(type, listener, thisObject);
    }
    rce.addAction = addAction;
    /**
     * 移除全局监听
     * @param type
     * @param listener
     * @param thisObject
     */
    function removeAction(type, listener, thisObject) {
        emittor.removeEventListener(type, listener, thisObject);
    }
    rce.removeAction = removeAction;
    /**
     * 全局动作派发
     * @param type
     * @param data
     */
    function doAction(type, data) {
        emittor.dispatchWith(type, data);
    }
    rce.doAction = doAction;
})(rce || (rce = {}));
var rce;
(function (rce) {
    /**
     * 类型拓展方法
     * @param definition 类定义，必须是一个函数，且接收一个super作为参数
     * @param basicClass 要拓展的基类
     * @param TAG 类名标识，可通过类定义的CustomClass.prototype.__class__获取到
     * @param editProto 修改类定义的原型，该方法接收一个参数，参数指向类定义的原型对象
     * @returns 返回一个Class定义，通过new关键字调用
     * @example
     * var SubClass = rce.extend(function(_super, param){
     *     // 定义动态属性，并调用父类的构造函数
     *     _super();
     *     this.param = param;
     * }, rce.HashObject, 'SubClass', function(proto) {
     *     // proto 即 SubClass.prototype
     *     proto.getParam = function() {
     *         return this.param + '_' + this.hashCode
     *     }
     * });
     * var sub = new SubClass('test');
     * console.log(sub.hashCode); // 打印继承的基类属性
     * console.log(sub.getParam()); // 打印自身定义的实例方法
     */
    function extend(definition, basicClass, TAG, editProto) {
        var __extends = window['__extends'];
        var __reflect = window['__reflect'];
        var CustomClass = (function (_super) {
            _super && __extends(CustomClass, _super);
            var __super = _super ? function () {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                return _this;
            } : null;
            function CustomClass() {
                Array.prototype.unshift.call(arguments, __super ? __super.bind(this) : null);
                definition.apply(this, arguments);
                return this;
            }
            editProto && editProto(CustomClass.prototype);
            return CustomClass;
        })(basicClass);
        __reflect(CustomClass.prototype, TAG);
        return CustomClass;
    }
    rce.extend = extend;
})(rce || (rce = {}));
var rce;
(function (rce) {
    /**
     * 空函数
     */
    function noop() {
    }
    rce.noop = noop;
})(rce || (rce = {}));
var rce;
(function (rce) {
    var _version = '0.1.0';
    /**
     * 获取 rce 框架版本
     */
    function version() {
        return "rce_frame_v_" + version;
    }
    rce.version = version;
})(rce || (rce = {}));
