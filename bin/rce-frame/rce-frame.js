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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
///<reference path="./HashObject.ts" />
var rce;
(function (rce) {
    /**
     * 事件实例类型
     */
    var Event = (function (_super) {
        __extends(Event, _super);
        /**
         * 构建一个事件对象
         * @param eventType 事件类型
         * @param data 事件传递的数据
         */
        function Event(eventType, data) {
            var _this = _super.call(this) || this;
            _this.eventType = eventType;
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
                this.mapListeners[eventType] = [{ handle: handle, context: thisObject, priority: priority }];
                return;
            }
            // 重复注册检查
            var repeat = arrListener.some(function (temp) {
                return temp.handle === handle && temp.context === thisObject;
            });
            if (repeat) {
                return;
            }
            var listener = { handle: handle, context: thisObject, priority: priority };
            // 按优先级插入
            for (var i = arrListener.length - 1; i >= 0; i -= 1) {
                var temp = arrListener[i];
                if (temp.priority >= listener.priority) {
                    arrListener.splice(i, 0, listener);
                    return;
                }
            }
            arrListener.unshift(listener);
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
            this.mapListeners.hasOwnProperty(eventType) && delete this.mapListeners[eventType];
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
            var arrListener = this.mapListeners[event.eventType];
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
     * 视图插件基类
     */
    var Plugin = (function (_super) {
        __extends(Plugin, _super);
        function Plugin() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            /**
             * 发送通知
             */
            _this.sendNotice = function (noticeType, data, whileDone, context) {
                _this.dispatchEvent(new rce.Notice(noticeType, data, whileDone, context));
            };
            /**
             * 注册广播监听器
             */
            _this.listenBroadcast = function (broadcastType, listener, thisObject) {
                _this.dispatchEvent(new PluginEvent({
                    broadcastType: broadcastType,
                    handle: listener,
                    context: thisObject
                }));
            };
            return _this;
        }
        return Plugin;
    }(rce.EventDispatcher));
    rce.Plugin = Plugin;
    __reflect(Plugin.prototype, "rce.Plugin");
    var PluginEvent = (function (_super) {
        __extends(PluginEvent, _super);
        function PluginEvent(broadListener) {
            return _super.call(this, PluginEvent.LISTEN_BROADCAST, broadListener) || this;
        }
        /**
         * 添加广播监听器
         */
        PluginEvent.LISTEN_BROADCAST = 'add_broadcast_listener';
        return PluginEvent;
    }(rce.Event));
    rce.PluginEvent = PluginEvent;
    __reflect(PluginEvent.prototype, "rce.PluginEvent");
    /**
     * 根据框架类型获取视图层拓展插件
     * @param type
     */
    function getPlugin(type) {
        switch (type) {
            case 'Vue':
                return new rce.VuePlugin();
            default:
                throw new Error("\u63D2\u4EF6\u7C7B\u578B\u65E0\u6548\uFF1A" + type + "!");
        }
    }
    rce.getPlugin = getPlugin;
})(rce || (rce = {}));
///<reference path="./Event.ts" />
var rce;
(function (rce) {
    /**
     * 广播事件
     */
    var Broadcast = (function (_super) {
        __extends(Broadcast, _super);
        /**
         * 构建一条广播
         * @param broadcastType 广播类型
         * @param data 广播数据
         */
        function Broadcast(broadcastType, data) {
            var _this = _super.call(this, Broadcast.EVENT, data) || this;
            _this.broadcastType = broadcastType;
            return _this;
        }
        /**
         * 广播事件类型常量
         */
        Broadcast.EVENT = 'SYSTEM.EVENT.BROADCAST';
        return Broadcast;
    }(rce.Event));
    rce.Broadcast = Broadcast;
    __reflect(Broadcast.prototype, "rce.Broadcast");
})(rce || (rce = {}));
var rce;
(function (rce) {
    /**
     * 通知事件：用于view层与service及service之间的消息传递。
     */
    var Notice = (function (_super) {
        __extends(Notice, _super);
        /**
         * 构建一条通知
         * @param noticeType 通知类型
         * @param data 通知数据
         * @param whileDone 通知处理完成时的回调函数，可用于接收结果
         * @param context 回调函数的 this 指向
         */
        function Notice(noticeType, data, whileDone, context) {
            var _this = _super.call(this, Notice.EVENT, data) || this;
            _this.noticeType = noticeType;
            _this.whileDone = whileDone;
            _this.context = context;
            return _this;
        }
        /**
         * 通知事件类型常量
         */
        Notice.EVENT = 'SYSTEM.EVENT.NOTICE';
        return Notice;
    }(rce.Event));
    rce.Notice = Notice;
    __reflect(Notice.prototype, "rce.Notice");
})(rce || (rce = {}));
var rce;
(function (rce) {
    /**
     * 内置中间件
     */
    var middleware;
    (function (middleware) {
        /**
         * 处理时长统计
         * @param notice
         * @param next
         */
        function Log(notice, next) {
            var timestamp = Date.now();
            next(function () {
                console.log("notice " + notice.noticeType + " cost " + (Date.now() - timestamp) + " ms");
            });
        }
        middleware.Log = Log;
    })(middleware = rce.middleware || (rce.middleware = {}));
})(rce || (rce = {}));
///<reference path="./core/HashObject.ts" />
var rce;
(function (rce) {
    /**
     * App 实例是整个前端业务的逻辑根节点。
     * view 层及 service 通过 App 实例发送通知来进行业务操作；
     * 通知分发由 App 实例对象内部完成，通知的处理由所注册的 service 实例完成；
     */
    var App = (function (_super) {
        __extends(App, _super);
        function App() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._serviceArr = [];
            _this._arrMiddleware = [];
            _this._mapNoticeListener = {};
            _this._mapBroadcastListener = {};
            return _this;
        }
        /**
         * 注册服务
         * @param services
         */
        App.prototype.useService = function () {
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
        App.prototype.useMiddleware = function () {
            var middlewares = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                middlewares[_i] = arguments[_i];
            }
            (_a = this._arrMiddleware).push.apply(_a, middlewares);
            var _a;
        };
        /**
         * 启动app
         */
        App.prototype.start = function () {
            var _this = this;
            this._serviceArr.forEach(function (service) {
                // 挂载 Notice 与 Broadcast 监听器
                service.__beforeAppStart(_this);
                // 监听 service 派发的 Notice 
                service.addEventListener(rce.Notice.EVENT, _this.receiveNotice, _this);
                // 监听 service 派发的 Broadcast
                service.addEventListener(rce.Broadcast.EVENT, _this.receiveBroadcast, _this);
            });
            // 暂时定义未异步函数，以方便后续可能的拓展
            return Promise.resolve();
        };
        // 添加通知监听器，同一类型通知只能存在一个监听器，不可重复，以此保证功能的唯一性
        App.prototype.__addNoticeListener = function () {
            var arrNoticeListener = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                arrNoticeListener[_i] = arguments[_i];
            }
            for (var i = 0, len = arrNoticeListener.length; i < len; i += 1) {
                var listener = arrNoticeListener[i];
                var noticeType = listener.noticeType;
                if (this._mapNoticeListener[noticeType]) {
                    throw new Error("\u6BCF\u4E2A\u7279\u5B9A\u7684Notice\u7C7B\u578B\u6D88\u606F\u53EA\u80FD\u5B58\u5728\u552F\u4E00\u4E00\u4E2A\u76D1\u542C\u5668: " + noticeType);
                }
                this._mapNoticeListener[noticeType] = listener;
            }
        };
        // 接收通知事件
        App.prototype.receiveNotice = function (notice) {
            var noticeType = notice.noticeType;
            // 查找 Notice 监听器
            var listener = this._mapNoticeListener[noticeType];
            if (!listener) {
                console.warn("\u672A\u5904\u7406\u7684\u901A\u77E5: " + noticeType + "\uFF01\u8BF7\u68C0\u67E5 Notice \u4E8B\u4EF6\u76D1\u542C\uFF0C\u5E76\u786E\u4FDD\u5DF2\u8C03\u7528 App \u5B9E\u4F8B\u7684 start() \u65B9\u6CD5");
                return;
            }
            this.noticeAssemblyLine(notice, listener);
        };
        App.prototype.noticeAssemblyLine = function (notice, listener) {
            return __awaiter(this, void 0, void 0, function () {
                var arrCallback, next, i, len, discontinue, tempErr, result, err_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            arrCallback = [];
                            next = function (callback) { return callback && arrCallback.push(callback); };
                            // 执行中间件函数
                            for (i = 0, len = this._arrMiddleware.length; i < len; i += 1) {
                                discontinue = this._arrMiddleware[i](notice, next);
                                if (discontinue) {
                                    return [2 /*return*/];
                                }
                            }
                            tempErr = null, result = null;
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, listener.handle.call(listener.context, notice)];
                        case 2:
                            result = _a.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            err_1 = _a.sent();
                            tempErr = err_1;
                            return [3 /*break*/, 4];
                        case 4:
                            // 执行中间件回调
                            while (arrCallback.length) {
                                arrCallback.pop()(tempErr, result);
                            }
                            // 结果回调给 Notice 发起者
                            notice.whileDone && notice.whileDone.call(notice.context, tempErr, result);
                            return [2 /*return*/];
                    }
                });
            });
        };
        // 添加广播监听器
        App.prototype.__addBroadcastListener = function () {
            var arrBroadcastListener = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                arrBroadcastListener[_i] = arguments[_i];
            }
            for (var i = 0, len = arrBroadcastListener.length; i < len; i += 1) {
                var listener = arrBroadcastListener[i];
                // 监听的广播类型
                var type = listener.broadcastType;
                var arrListener = this._mapBroadcastListener[type];
                if (!arrListener) {
                    this._mapBroadcastListener[type] = [listener];
                }
                else {
                    arrListener.push(listener);
                }
            }
        };
        // 接收广播事件
        App.prototype.receiveBroadcast = function (broadcast) {
            var type = broadcast.broadcastType;
            // 按广播类型查找监听器
            var arrListener = this._mapBroadcastListener[type];
            if (!arrListener) {
                console.warn("\u672A\u5904\u7406\u7684\u5E7F\u64AD: " + type + "\uFF01\u8BF7\u68C0\u67E5\u5E7F\u64AD\u76D1\u542C\uFF0C\u5E76\u786E\u4FDD\u5DF2\u8C03\u7528 App \u5B9E\u4F8B\u7684 start() \u65B9\u6CD5");
                return;
            }
            // 逐一发送广播数据
            arrListener.forEach(function (lisener) { return lisener.handle.call(lisener.context, broadcast); });
        };
        /**
         * 获取视图组件插件
         * @param type
         * @example
         * Vue框架使用方法
         * `Vue.use(app.viewPlugin('Vue'))`
         * 给组件增加发送通知及接收广播的能力
         * * 发送通知
         * `this.$sendNotice('')`
         * 别名方法 `this.__s('')`
         * * 监听广播
         * `this.$listenBroadcast('')`
         * 别名方法：`this.__l`
         */
        App.prototype.viewPlugin = function (type) {
            var _this = this;
            if (!this._viewPlugin) {
                this._viewPlugin = rce.getPlugin(type);
                // 监听从视图层派发的 Notice 数据
                this._viewPlugin.addEventListener(rce.Notice.EVENT, this.receiveNotice, this);
                // 监听视图组件注册 Broadcast 监听器
                this._viewPlugin.addEventListener(rce.PluginEvent.LISTEN_BROADCAST, function (event) {
                    _this.__addBroadcastListener(event.data);
                });
            }
            return this._viewPlugin;
        };
        return App;
    }(rce.HashObject));
    rce.App = App;
    __reflect(App.prototype, "rce.App");
})(rce || (rce = {}));
var rce;
(function (rce) {
    /**
     * Vue 框架插件
     */
    var VuePlugin = (function (_super) {
        __extends(VuePlugin, _super);
        function VuePlugin() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        VuePlugin.prototype.install = function (Vue) {
            var sendNotice = this.sendNotice.bind(this);
            var listenBroadcast = this.listenBroadcast.bind(this);
            // 为组件赋能
            Vue.mixin({
                beforeCreate: function () {
                    // __sn 与 __lb 是别名，用来方便业务开发
                    this.__sn = this.$sendNotice = sendNotice;
                    this.__lb = this.$listenBroadcast = listenBroadcast;
                }
            });
            // 为 Vue 实例赋能
            Vue.prototype.__sn = Vue.prototype.$sendNotice = sendNotice;
            Vue.prototype.__lb = Vue.prototype.$listenBroadcast = listenBroadcast;
        };
        return VuePlugin;
    }(rce.Plugin));
    rce.VuePlugin = VuePlugin;
    __reflect(VuePlugin.prototype, "rce.VuePlugin");
})(rce || (rce = {}));
var rce;
(function (rce) {
    /**
     * service 基类，封装非UI层业务逻辑，所有的service需继承此基类！
     * 通过`this.listenNotice()`监听指定类型的 Notice，别名`this.__ln()`
     * 通过`this.sendNotice()`发送通知，别名`this.__sn()`
     * 通过`this.listenBroadcast()`监听指定类型的 Broadcast，别名`this.__lb()`
     * 通过`this.sendBroadcast()`发送广播，别名`this.__sb()`
     */
    var Service = (function (_super) {
        __extends(Service, _super);
        function Service() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.__noticeListeneres = [];
            /**
             * 监听通知
             */
            _this.listenNotice = function (noticeType, handle, thisObject) {
                _this.__noticeListeneres.push({ noticeType: noticeType, handle: handle, context: thisObject });
            };
            _this.__broadcastListeneres = [];
            /**
             * 监听广播
             */
            _this.listenBroadcast = function (broadcastType, handle, thisObject) {
                _this.__broadcastListeneres.push({ broadcastType: broadcastType, handle: handle, context: thisObject });
            };
            /**
             * 发送通知
             * @param noticeType 通知类型
             * @param data 通知数据
             * @param whileDone 通知处理完成时的回调函数，可用于接收结果
             * @param context 回调函数的 this 指向
             */
            _this.sendNotice = function (noticeType, data, whileDone, context) {
                _this.dispatchEvent(new rce.Notice(noticeType, data, whileDone, context));
            };
            /**
             * 发送广播
             * @param broadcastType 广播类型
             * @param data 携带的数据
             */
            _this.sendBroadcast = function (broadcastType, data) {
                _this.dispatchEvent(new rce.Broadcast(broadcastType, data));
            };
            /**
             * App启动时会调用的钩子函数，勿手动调用
             */
            _this.__beforeAppStart = function (app) {
                // 添加 Notice 监听
                app.__addNoticeListener.apply(app, _this.__noticeListeneres);
                // 添加 Broadcast 监听
                app.__addBroadcastListener.apply(app, _this.__broadcastListeneres);
            };
            /**
             * listenNotice 的别名方法
             */
            _this.__ln = _this.listenNotice;
            /**
             * sendNotice 的别名方法
             */
            _this.__sn = _this.sendNotice;
            /**
             * sendBroadcast 的别名方法
             */
            _this.__sb = _this.sendBroadcast;
            /**
             * listenBroadcast 的别名方法
             */
            _this.__lb = _this.listenBroadcast;
            return _this;
        }
        return Service;
    }(rce.EventDispatcher));
    rce.Service = Service;
    __reflect(Service.prototype, "rce.Service");
})(rce || (rce = {}));
var rce;
(function (rce) {
    var emittor = new rce.EventDispatcher();
    /**
     * 添加全局监听，由于是直接挂载的顶级对象rce上，故通过该方法可进行跨 App 之间的通信
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
        return "rce_frame_v_" + _version;
    }
    rce.version = version;
})(rce || (rce = {}));
