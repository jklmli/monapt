(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], function () {
      return (root.returnExportsGlobal = factory());
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like enviroments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    root['monapt'] = factory();
  }
}(this, function () {

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var monapt;
(function (monapt) {
    monapt.Tuple1 = function (a) {
        return {
            _1: a
        };
    };
    monapt.Tuple2 = function (a, b) {
        return {
            _1: a,
            _2: b
        };
    };
})(monapt || (monapt = {}));
var monapt;
(function (monapt) {
    var NoSuchElementError = (function (_super) {
        __extends(NoSuchElementError, _super);
        function NoSuchElementError() {
            _super.call(this, 'No such element.');
            this.name = 'NoSuchElementError';
            this.message = 'No such element.';
            this.stack = (new Error()).stack;
        }
        return NoSuchElementError;
    }(Error));
    monapt.NoSuchElementError = NoSuchElementError;
    monapt.Option = function (value) {
        if (typeof value !== "undefined" && value !== null) {
            return new Some(value);
        }
        else {
            return monapt.None;
        }
    };
    var Some = (function () {
        function Some(value) {
            this.value = value;
            this.isDefined = true;
            this.isEmpty = false;
        }
        Some.prototype.get = function () {
            return this.value;
        };
        Some.prototype.getOrElse = function (defaultValue) {
            return this.value;
        };
        Some.prototype.orElse = function (alternative) {
            return this;
        };
        Some.prototype.match = function (matcher) {
            return matcher.Some(this.value);
        };
        Some.prototype.map = function (f) {
            return new Some(f(this.get()));
        };
        Some.prototype.flatMap = function (f) {
            return f(this.get());
        };
        Some.prototype.filter = function (predicate) {
            if (predicate(this.value)) {
                return this;
            }
            else {
                return monapt.None;
            }
        };
        Some.prototype.reject = function (predicate) {
            return this.filter(function (v) { return !predicate(v); });
        };
        Some.prototype.foreach = function (f) {
            f(this.value);
        };
        Some.prototype.equals = function (option) {
            var _this = this;
            return option.match({
                None: function () { return false; },
                Some: function (value) { return _this.value === value; }
            });
        };
        return Some;
    }());
    monapt.Some = Some;
    var NoneImpl = (function () {
        function NoneImpl() {
            this.isDefined = false;
            this.isEmpty = true;
        }
        NoneImpl.prototype.get = function () {
            throw new NoSuchElementError();
        };
        NoneImpl.prototype.getOrElse = function (defaultValue) {
            return defaultValue();
        };
        NoneImpl.prototype.orElse = function (alternative) {
            return alternative();
        };
        NoneImpl.prototype.match = function (matcher) {
            return matcher.None();
        };
        NoneImpl.prototype.map = function (f) {
            return monapt.None;
        };
        NoneImpl.prototype.flatMap = function (f) {
            return monapt.None;
        };
        NoneImpl.prototype.filter = function (predicate) {
            return this;
        };
        NoneImpl.prototype.reject = function (predicate) {
            return this;
        };
        NoneImpl.prototype.foreach = function (f) {
            return;
        };
        NoneImpl.prototype.equals = function (option) {
            return option.isEmpty;
        };
        return NoneImpl;
    }());
    monapt.None = new NoneImpl();
    monapt.flatten = function (options) {
        var ret = [];
        for (var i = 0, length = options.length; i < length; i++) {
            if (options[i].isDefined) {
                ret.push(options[i].get());
            }
        }
        return ret;
    };
})(monapt || (monapt = {}));
var monapt;
(function (monapt) {
    var asInstanceOf = function (v) {
        return v;
    };
    var Success = (function () {
        function Success(value) {
            this.value = value;
            this.isSuccess = true;
            this.isFailure = false;
        }
        Success.prototype.get = function () {
            return this.value;
        };
        Success.prototype.getOrElse = function (defaultValue) {
            return this.get();
        };
        Success.prototype.orElse = function (alternative) {
            return this;
        };
        Success.prototype.match = function (matcher) {
            return matcher.Success(this.get());
        };
        Success.prototype.map = function (f) {
            var _this = this;
            return monapt.Try(function () { return f(_this.value); });
        };
        Success.prototype.flatMap = function (f) {
            try {
                return f(this.value);
            }
            catch (e) {
                return new Failure(e);
            }
        };
        Success.prototype.filter = function (predicate) {
            try {
                if (predicate(this.value)) {
                    return this;
                }
                else {
                    return new Failure(new Error('Predicate does not hold for ' + this.value));
                }
            }
            catch (e) {
                return new Failure(e);
            }
        };
        Success.prototype.reject = function (predicate) {
            return this.filter(function (v) { return !predicate(v); });
        };
        Success.prototype.foreach = function (f) {
            f(this.value);
        };
        Success.prototype.recover = function (fn) {
            return this;
        };
        Success.prototype.recoverWith = function (fn) {
            return this;
        };
        Success.prototype.toOption = function () {
            return new monapt.Some(this.value);
        };
        return Success;
    }());
    monapt.Success = Success;
    var Failure = (function () {
        function Failure(exception) {
            this.exception = exception;
            this.isSuccess = false;
            this.isFailure = true;
        }
        Failure.prototype.get = function () {
            throw this.exception;
        };
        Failure.prototype.getOrElse = function (defaultValue) {
            return defaultValue();
        };
        Failure.prototype.orElse = function (alternative) {
            return alternative();
        };
        Failure.prototype.match = function (matcher) {
            return matcher.Failure(this.exception);
        };
        Failure.prototype.map = function (f) {
            return asInstanceOf(this);
        };
        Failure.prototype.flatMap = function (f) {
            return asInstanceOf(this);
        };
        Failure.prototype.filter = function (predicate) {
            return this;
        };
        Failure.prototype.reject = function (predicate) {
            return this;
        };
        Failure.prototype.foreach = function (f) {
            return;
        };
        Failure.prototype.recover = function (fn) {
            try {
                return new Success(fn(this.exception));
            }
            catch (e) {
                return new Failure(e);
            }
        };
        Failure.prototype.recoverWith = function (fn) {
            try {
                return fn(this.exception);
            }
            catch (e) {
                return new Failure(this.exception);
            }
        };
        Failure.prototype.toOption = function () {
            return monapt.None;
        };
        return Failure;
    }());
    monapt.Failure = Failure;
    monapt.Try = function (f) {
        try {
            return new Success(f());
        }
        catch (e) {
            return new Failure(e);
        }
    };
})(monapt || (monapt = {}));
var monapt;
(function (monapt) {
    var Cracker = (function () {
        function Cracker() {
            this.fired = false;
            this.callbacks = new Array();
        }
        Cracker.prototype.fire = function (producer) {
            this.producer = producer;
            if (this.fired) {
                throw new Error('Dose fired twice, Can call only once.');
            }
            else {
                this.fireAll();
            }
        };
        Cracker.prototype.fireAll = function () {
            var _this = this;
            this.fired = true;
            this.callbacks.forEach(function (fn) { return _this.producer(fn); });
        };
        Cracker.prototype.add = function (fn) {
            if (this.fired) {
                this.producer(fn);
            }
            else {
                this.callbacks.push(fn);
            }
        };
        return Cracker;
    }());
    monapt.Cracker = Cracker;
})(monapt || (monapt = {}));
var monapt;
(function (monapt) {
    var asInstanceOf = function (v) {
        return v;
    };
    function F(target) {
        var f = function (v) {
            if (v instanceof Error)
                target.failure(v);
            else
                target.success(v);
        };
        f['success'] = function (v) { return target.success(v); };
        f['failure'] = function (e) { return target.failure(e); };
        return f;
    }
    var Future = (function () {
        function Future(future) {
            this.cracker = new monapt.Cracker();
            future(F(this));
        }
        Future.succeed = function (value) {
            return new Future(function (p) { return p.success(value); });
        };
        Future.failed = function (error) {
            return new Future(function (p) { return p.failure(error); });
        };
        Future.prototype.success = function (value) {
            this.cracker.fire(function (fn) { return fn(new monapt.Success(value)); });
        };
        Future.prototype.failure = function (error) {
            this.cracker.fire(function (fn) { return fn(new monapt.Failure(error)); });
        };
        Future.prototype.onComplete = function (callback) {
            this.cracker.add(callback);
        };
        Future.prototype.onSuccess = function (callback) {
            this.onComplete(function (r) {
                r.match({
                    Success: function (v) { return callback(v); },
                    Failure: function () { }
                });
            });
        };
        Future.prototype.onFailure = function (callback) {
            this.onComplete(function (r) {
                r.match({
                    Success: function () { },
                    Failure: function (error) { return callback(error); }
                });
            });
        };
        Future.prototype.map = function (f) {
            var promise = new Promise();
            this.onComplete(function (r) {
                r.match({
                    Failure: function (e) { return promise.failure(e); },
                    Success: function (v) {
                        try {
                            var result = f(v);
                            promise.success(result);
                        }
                        catch (e) {
                            promise.failure(e);
                        }
                    }
                });
            });
            return promise.future();
        };
        Future.prototype.flatMap = function (f) {
            var promise = new Promise();
            this.onComplete(function (r) {
                r.match({
                    Failure: function (e) { return promise.failure(e); },
                    Success: function (v) {
                        f(v).onComplete(function (fr) {
                            fr.match({
                                Success: function (v) { return promise.success(v); },
                                Failure: function (e) { return promise.failure(e); }
                            });
                        });
                    }
                });
            });
            return promise.future();
        };
        Future.prototype.filter = function (predicate) {
            var promise = new Promise();
            this.onComplete(function (r) {
                r.match({
                    Failure: function (e) { promise.failure(e); },
                    Success: function (v) {
                        try {
                            if (predicate(v)) {
                                promise.success(v);
                            }
                            else {
                                promise.failure(new monapt.NoSuchElementError());
                            }
                        }
                        catch (e) {
                            promise.failure(e);
                        }
                    }
                });
            });
            return promise.future();
        };
        Future.prototype.reject = function (predicate) {
            return this.filter(function (v) { return !predicate(v); });
        };
        Future.prototype.recover = function (fn) {
            var promise = new Promise();
            this.onComplete(function (r) {
                r.match({
                    Failure: function (error) {
                        try {
                            promise.success(fn(error));
                        }
                        catch (e) {
                            promise.failure(e);
                        }
                    },
                    Success: function (v) { return promise.success(v); }
                });
            });
            return promise.future();
        };
        Future.prototype.recoverWith = function (fn) {
            var promise = new Promise();
            this.onComplete(function (r) { return r.match({
                Failure: function (e) {
                    fn(e).onComplete(function (fr) { return fr.match({
                        Success: function (v) { return promise.success(v); },
                        Failure: function (e) { return promise.failure(e); }
                    }); });
                },
                Success: function (v) { return promise.success(v); }
            }); });
            return promise.future();
        };
        return Future;
    }());
    monapt.Future = Future;
    var Promise = (function (_super) {
        __extends(Promise, _super);
        function Promise() {
            _super.call(this, function (p) { });
            this.isComplete = false;
        }
        Promise.prototype.success = function (value) {
            this.isComplete = true;
            _super.prototype.success.call(this, value);
        };
        Promise.prototype.failure = function (error) {
            this.isComplete = true;
            _super.prototype.failure.call(this, error);
        };
        Promise.prototype.future = function () {
            return this;
        };
        return Promise;
    }(Future));
    monapt.Promise = Promise;
    monapt.future = function (f) {
        var p = new Promise();
        try {
            f(F(p));
        }
        catch (e) {
            p.failure(e);
        }
        return p.future();
    };
})(monapt || (monapt = {}));
var monapt;
(function (monapt) {
    var Selector;
    (function (Selector) {
        var StringSelector = (function () {
            function StringSelector() {
                this.table = {};
            }
            StringSelector.prototype.register = function (k, index) {
                this.table[k] = index;
            };
            StringSelector.prototype.index = function (k) {
                if (this.table[k]) {
                    return new monapt.Some(this.table[k]);
                }
                else {
                    return monapt.None;
                }
            };
            return StringSelector;
        }());
        Selector.StringSelector = StringSelector;
        var HashableSelector = (function () {
            function HashableSelector() {
                this.table = {};
            }
            HashableSelector.prototype.register = function (k, index) {
                this.table[k.hash()] = index;
            };
            HashableSelector.prototype.index = function (k) {
                var hash = k.hash();
                if (this.table[hash]) {
                    return new monapt.Some(this.table[hash]);
                }
                else {
                    return monapt.None;
                }
            };
            return HashableSelector;
        }());
        Selector.HashableSelector = HashableSelector;
        var ObjectSelector = (function () {
            function ObjectSelector() {
            }
            ObjectSelector.prototype.register = function (k, index) { };
            ObjectSelector.prototype.index = function (k) {
                return monapt.None;
            };
            return ObjectSelector;
        }());
        Selector.ObjectSelector = ObjectSelector;
    })(Selector || (Selector = {}));
    var Map = (function () {
        function Map(key, value) {
            var keysAndValues = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                keysAndValues[_i - 2] = arguments[_i];
            }
            this.real = [];
            if (value) {
                if (keysAndValues.length != 0 && keysAndValues.length % 2 != 0) {
                    throw new Error(keysAndValues[keysAndValues.length - 1] + ' has not value.');
                }
                else {
                    this.ensureSelector(key);
                    this.add(key, value);
                    for (var i = 0, l = keysAndValues.length; i < l; i += 2) {
                        this.add(keysAndValues[i], keysAndValues[i + 1]);
                    }
                }
            }
            else if (key) {
                var obj = key;
                for (var k in obj) {
                    this.ensureSelector(k);
                    this.add(k, obj[k]);
                }
            }
            this.ensureSelector();
        }
        Map.prototype.ensureSelector = function (hint) {
            if (hint === void 0) { hint = null; }
            if (this.selector) {
                return;
            }
            if (!hint) {
                this.selector = new Selector.ObjectSelector();
            }
            else if (typeof hint == 'string') {
                this.selector = new Selector.StringSelector();
            }
            else if (hint.hash) {
                this.selector = new Selector.HashableSelector();
            }
            else {
                this.selector = new Selector.ObjectSelector();
            }
        };
        Map.prototype.add = function (key, value) {
            this.real.push(monapt.Tuple2(key, value));
            this.selector.register(key, this.real.length - 1);
        };
        Map.prototype.foreach = function (f) {
            this.real.forEach(function (value, index, array) { return f(value._1, value._2); });
        };
        Map.prototype.map = function (f) {
            var result = new Map();
            this.foreach(function (k, v) {
                var t = f(k, v);
                result.add(t._1, t._2);
            });
            return result;
        };
        Map.prototype.flatMap = function (f) {
            var result = new Map();
            this.foreach(function (k, v) {
                var r = f(k, v);
                r.foreach(function (k, v) { return result.add(k, v); });
            });
            return result;
        };
        Map.prototype.mapValues = function (f) {
            var result = new Map();
            this.foreach(function (k, v) {
                result.add(k, f(v));
            });
            return result;
        };
        Map.prototype.filter = function (predicate) {
            var result = new Map();
            this.foreach(function (k, v) {
                if (predicate(k, v))
                    result.add(k, v);
            });
            return result;
        };
        Map.prototype.reject = function (predicate) {
            return this.filter(function (k, v) { return !predicate(k, v); });
        };
        Map.prototype.find = function (f) {
            return this.filter(f).head();
        };
        Map.prototype.get = function (key) {
            var _this = this;
            return this.selector.index(key).map(function (index) {
                return _this.real[index]._2;
            }).orElse(function () {
                return _this.find(function (k, v) { return k == key; }).map(function (tuple) {
                    return tuple._2;
                }).orElse(function () { return monapt.None; });
            });
        };
        Map.prototype.getOrElse = function (key, defaultValue) {
            return this.get(key).getOrElse(defaultValue);
        };
        Map.prototype.head = function () {
            if (this.real.length > 0) {
                return new monapt.Some(this.real[0]);
            }
            else {
                return monapt.None;
            }
        };
        return Map;
    }());
    monapt.Map = Map;
})(monapt || (monapt = {}));

return monapt;

}));
