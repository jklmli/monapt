var katana;
(function (katana) {
    katana.Tuple1 = function (a) {
        return {
            _1: a
        };
    };

    katana.Tuple2 = function (a, b) {
        return {
            _1: a,
            _2: b
        };
    };
})(katana || (katana = {}));
var katana;
(function (katana) {
    var asInstanceOf = function (v) {
        return v;
    };

    var Some = (function () {
        function Some(value) {
            this.value = value;
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
            if (matcher.Some) {
                matcher.Some(this.value);
            }
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
            } else {
                return new None();
            }
        };

        Some.prototype.reject = function (predicate) {
            return this.filter(function (v) {
                return !predicate(v);
            });
        };

        Some.prototype.foreach = function (f) {
            f(this.value);
        };
        return Some;
    })();
    katana.Some = Some;

    var None = (function () {
        function None() {
            this.isEmpty = true;
        }
        None.prototype.get = function () {
            throw new Error('No such element.');
        };

        None.prototype.getOrElse = function (defaultValue) {
            return defaultValue();
        };

        None.prototype.orElse = function (alternative) {
            return alternative();
        };

        None.prototype.match = function (matcher) {
            if (matcher.None) {
                matcher.None();
            }
        };

        None.prototype.map = function (f) {
            return asInstanceOf(this);
        };

        None.prototype.flatMap = function (f) {
            return asInstanceOf(this);
        };

        None.prototype.filter = function (predicate) {
            return this;
        };

        None.prototype.reject = function (predicate) {
            return this;
        };

        None.prototype.foreach = function (f) {
            return;
        };
        return None;
    })();
    katana.None = None;
})(katana || (katana = {}));
var katana;
(function (katana) {
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
            if (matcher.Success)
                matcher.Success(this.get());
        };

        Success.prototype.map = function (f) {
            var _this = this;
            return katana.Try(function () {
                return f(_this.value);
            });
        };

        Success.prototype.flatMap = function (f) {
            try  {
                return f(this.value);
            } catch (e) {
                return new Failure(e);
            }
        };

        Success.prototype.filter = function (predicate) {
            try  {
                if (predicate(this.value)) {
                    return this;
                } else {
                    return new Failure(new Error('Predicate does not hold for ' + this.value));
                }
            } catch (e) {
                return new Failure(e);
            }
        };

        Success.prototype.reject = function (predicate) {
            return this.filter(function (v) {
                return !predicate(v);
            });
        };

        Success.prototype.foreach = function (f) {
            f(this.value);
        };
        return Success;
    })();
    katana.Success = Success;

    var Failure = (function () {
        function Failure(error) {
            this.error = error;
            this.isSuccess = false;
            this.isFailure = true;
        }
        Failure.prototype.get = function () {
            throw this.error;
        };

        Failure.prototype.getOrElse = function (defaultValue) {
            return defaultValue();
        };

        Failure.prototype.orElse = function (alternative) {
            return alternative();
        };

        Failure.prototype.match = function (matcher) {
            if (matcher.Failure)
                matcher.Failure(this.error);
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
        return Failure;
    })();
    katana.Failure = Failure;

    katana.Try = function (f) {
        try  {
            return new Success(f());
        } catch (e) {
            return new Failure(e);
        }
    };
})(katana || (katana = {}));
var katana;
(function (katana) {
    var Cracker = (function () {
        function Cracker() {
            this.fired = false;
            this.callbacks = new Array();
        }
        Cracker.prototype.fire = function (producer) {
            this.producer = producer;
            if (this.fired) {
                throw new Error('Does fired.');
            } else {
                this.fireAll();
            }
        };

        Cracker.prototype.fireAll = function () {
            var _this = this;
            this.fired = true;
            this.callbacks.forEach(function (fn) {
                return _this.producer(fn);
            });
        };

        Cracker.prototype.add = function (fn) {
            if (this.fired) {
                this.producer(fn);
            } else {
                this.callbacks.push(fn);
            }
        };
        return Cracker;
    })();
    katana.Cracker = Cracker;
})(katana || (katana = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var katana;
(function (katana) {
    var asInstanceOf = function (v) {
        return v;
    };

    var Future = (function () {
        function Future(future) {
            var _this = this;
            this.cracker = new katana.Cracker();
            future(function (v) {
                return _this.success(v);
            }, function (e) {
                return _this.failure(e);
            });
        }
        Future.prototype.success = function (value) {
            this.cracker.fire(function (fn) {
                return fn(new katana.Success(value));
            });
        };

        Future.prototype.failure = function (error) {
            this.cracker.fire(function (fn) {
                return fn(new katana.Failure(error));
            });
        };

        Future.prototype.onComplete = function (callback) {
            this.cracker.add(callback);
        };

        Future.prototype.onSuccess = function (callback) {
            this.onComplete(function (r) {
                r.match({
                    Success: function (v) {
                        return callback(v);
                    }
                });
            });
        };

        Future.prototype.onFailure = function (callback) {
            this.onComplete(function (r) {
                r.match({
                    Failure: function (error) {
                        return callback(error);
                    }
                });
            });
        };

        Future.prototype.map = function (f) {
            var promise = new Promise();
            this.onComplete(function (r) {
                r.match({
                    Failure: function (e) {
                        return promise.failure(e);
                    },
                    Success: function (v) {
                        return f(v, function (v) {
                            return promise.success(v);
                        }, function (e) {
                            return promise.failure(e);
                        });
                    }
                });
            });
            return promise.future();
        };

        Future.prototype.flatMap = function (f) {
            var promise = new Promise();
            this.onComplete(function (r) {
                r.match({
                    Failure: function (e) {
                        return promise.failure(e);
                    },
                    Success: function (v) {
                        f(v).onComplete(function (fr) {
                            fr.match({
                                Success: function (v) {
                                    return promise.success(v);
                                },
                                Failure: function (e) {
                                    return promise.failure(e);
                                }
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
                    Failure: function (e) {
                        promise.failure(e);
                    },
                    Success: function (v) {
                        try  {
                            if (predicate(v)) {
                                promise.success(v);
                            } else {
                                promise.failure(new Error('No such element.'));
                            }
                        } catch (e) {
                            promise.failure(e);
                        }
                    }
                });
            });
            return promise.future();
        };

        Future.prototype.reject = function (predicate) {
            return this.filter(function (v) {
                return !predicate(v);
            });
        };
        return Future;
    })();
    katana.Future = Future;

    var Promise = (function (_super) {
        __extends(Promise, _super);
        function Promise() {
            _super.call(this, function (s, f) {
            });
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
    })(Future);
    katana.Promise = Promise;
})(katana || (katana = {}));
var katana;
(function (katana) {
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
                    return new katana.Some(this.table[k]);
                } else {
                    return new katana.None();
                }
            };
            return StringSelector;
        })();
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
                    return new katana.Some(this.table[hash]);
                } else {
                    return new katana.None();
                }
            };
            return HashableSelector;
        })();
        Selector.HashableSelector = HashableSelector;

        var ObjectSelector = (function () {
            function ObjectSelector() {
            }
            ObjectSelector.prototype.register = function (k, index) {
            };

            ObjectSelector.prototype.index = function (k) {
                return new katana.None();
            };
            return ObjectSelector;
        })();
        Selector.ObjectSelector = ObjectSelector;
    })(Selector || (Selector = {}));

    var Map = (function () {
        function Map(key, value) {
            var keysAndValues = [];
            for (var _i = 0; _i < (arguments.length - 2); _i++) {
                keysAndValues[_i] = arguments[_i + 2];
            }
            this.real = [];
            if (value) {
                if (keysAndValues.length != 0 && keysAndValues.length % 2 != 0) {
                    throw new Error(keysAndValues[keysAndValues.length - 1] + ' has not value.');
                } else {
                    this.ensureSelector(key);
                    this.add(key, value);
                    for (var i = 0, l = keysAndValues.length; i < l; i += 2) {
                        this.add(keysAndValues[i], keysAndValues[i + 1]);
                    }
                }
            } else if (key) {
                var obj = key;
                for (var k in obj) {
                    this.ensureSelector(k);
                    this.add(k, obj[k]);
                }
            }

            this.ensureSelector();
        }
        Map.prototype.ensureSelector = function (hint) {
            if (typeof hint === "undefined") { hint = null; }
            if (this.selector) {
                return;
            }

            if (!hint) {
                this.selector = new Selector.ObjectSelector();
            } else if (typeof hint == 'string') {
                this.selector = new Selector.StringSelector();
            } else if (hint.hash) {
                this.selector = new Selector.HashableSelector();
            } else {
                this.selector = new Selector.ObjectSelector();
            }
        };

        Map.prototype.add = function (key, value) {
            this.real.push(katana.Tuple2(key, value));
            this.selector.register(key, this.real.length - 1);
        };

        Map.prototype.foreach = function (f) {
            this.real.forEach(function (value, index, array) {
                return f(value._1, value._2);
            });
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
                r.foreach(function (k, v) {
                    return result.add(k, v);
                });
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
            return this.filter(function (k, v) {
                return !predicate(k, v);
            });
        };

        Map.prototype.find = function (f) {
            return this.filter(f).head();
        };

        Map.prototype.get = function (key) {
            var _this = this;
            return this.selector.index(key).map(function (index) {
                return _this.real[index]._2;
            }).orElse(function () {
                return _this.find(function (k, v) {
                    return k == key;
                }).map(function (tuple) {
                    return tuple._2;
                }).orElse(function () {
                    return new katana.None();
                });
            });
        };

        Map.prototype.getOrElse = function (key, defaultValue) {
            return this.get(key).getOrElse(defaultValue);
        };

        Map.prototype.head = function () {
            if (this.real.length > 0) {
                return new katana.Some(this.real[0]);
            } else {
                return new katana.None();
            }
        };
        return Map;
    })();
    katana.Map = Map;
})(katana || (katana = {}));
