var Katana;
(function (Katana) {
    var Left = (function () {
        function Left() {
        }
        return Left;
    })();
    Katana.Left = Left;
    var Right = (function () {
        function Right() {
        }
        return Right;
    })();
    Katana.Right = Right;
})(Katana || (Katana = {}));
;var Katana;
(function (Katana) {
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
                    return new Katana.Some(this.table[k]);
                } else {
                    return new Katana.None();
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
                    return new Katana.Some(this.table[hash]);
                } else {
                    return new Katana.None();
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
                return new Katana.None();
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
            this.real.push(Katana.Tuple2(key, value));
            this.selector.register(key, this.real.length - 1);
        };

        Map.prototype.foreach = function (f) {
            this.real.forEach(function (value, index, array) {
                return f(value._1, value._2);
            });
        };

        Map.prototype.filter = function (f) {
            var result = new Map();
            this.foreach(function (k, v) {
                if (f(k, v))
                    result.add(k, v);
            });
            return result;
        };

        Map.prototype.reject = function (f) {
            return this.filter(function (k, v) {
                return !f(k, v);
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
                    return new Katana.None();
                });
            });
        };

        Map.prototype.getOrElse = function (key, defaultValue) {
            return this.get(key).getOrElse(defaultValue);
        };

        Map.prototype.head = function () {
            if (this.real.length > 0) {
                return new Katana.Some(this.real[0]);
            } else {
                return new Katana.None();
            }
        };
        return Map;
    })();
    Katana.Map = Map;
})(Katana || (Katana = {}));
;var Katana;
(function (Katana) {
    var asInstanceOf = function (v) {
        return v;
    };

    var Some = (function () {
        function Some(value) {
            this.value = value;
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

        Some.prototype.flatten = function () {
            if (this.value instanceof Some) {
                return asInstanceOf(this.value);
            } else if (this.value instanceof None) {
                return new None();
            } else {
                throw new Error('Cannot prove that.');
            }
            return null;
        };
        return Some;
    })();
    Katana.Some = Some;

    var None = (function () {
        function None() {
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
            return new None();
        };

        None.prototype.flatMap = function (f) {
            return new None();
        };

        None.prototype.flatten = function () {
            return new None();
        };
        return None;
    })();
    Katana.None = None;
})(Katana || (Katana = {}));
;var Katana;
(function (Katana) {
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

        Success.prototype.map = function (f) {
            var _this = this;
            return Katana.Try(function () {
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

        Success.prototype.match = function (matcher) {
            if (matcher.Success)
                matcher.Success(this.get());
        };
        return Success;
    })();
    Katana.Success = Success;

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

        Failure.prototype.map = function (f) {
            return asInstanceOf(this);
        };

        Failure.prototype.flatMap = function (f) {
            return asInstanceOf(this);
        };

        Failure.prototype.match = function (matcher) {
            if (matcher.Failure)
                matcher.Failure(this.error);
        };
        return Failure;
    })();
    Katana.Failure = Failure;

    Katana.Try = function (f) {
        try  {
            return new Success(f());
        } catch (e) {
            return new Failure(e);
        }
    };
})(Katana || (Katana = {}));
;var Katana;
(function (Katana) {
    Katana.Tuple1 = function (a) {
        return {
            _1: a
        };
    };

    Katana.Tuple2 = function (a, b) {
        return {
            _1: a,
            _2: b
        };
    };
})(Katana || (Katana = {}));
