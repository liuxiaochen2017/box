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
                    return;
                }
            }
            if (arrListener.length === 0) {
                delete this.mapListeners[eventType];
            }
        };
        /**
         * 派发事件
         * @param eventType
         * @param data
         */
        EventDispatcher.prototype.dispatchEvent = function (eventType, data) {
            var event = new rce.Event(eventType, this, data);
            var arrListener = this.mapListeners[eventType];
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
     * 事件实例类型
     */
    var Event = (function (_super) {
        __extends(Event, _super);
        function Event(eventType, target, data) {
            var _this = _super.call(this) || this;
            _this.eventType = eventType;
            _this.target = target;
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
        emittor.dispatchEvent(type, data);
    }
    rce.doAction = doAction;
})(rce || (rce = {}));
var rce;
(function (rce) {
    var _definition = {};
    /**
     * 类型拓展方法
     * @param definition 类定义，必须是一个函数，且接收一个super作为参数
     * @param basicClass 要拓展的基类
     * @param TAG 类名称，类定义会最终挂载到全局变量上
     * @returns 返回一个Class定义，通过new关键字调用
     * @example
     * var SubClass = rce.extend(function(_super, param){
     *   _super();
     *   this.param = param;
     * }, rce.HashObject, 'SubClass');
     * var sub = new SubClass('test');
     * console.log(sub.hashCode); // 打印继承的基类属性
     * console.log(sub.param); // 打印自身定义的实例属性
     */
    function extend(definition, _super, TAG) {
        var __extends = window['__extends'];
        var __reflect = window['__reflect'];
        __extends(definition, _super);
        __reflect(definition.prototype, TAG);
        return definition;
    }
    rce.extend = extend;
})(rce || (rce = {}));
