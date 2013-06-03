var Katana;
(function (Katana) {
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
                    this.add(key, value);
                    for (var i = 0, l = keysAndValues.length; i < l; i += 2) {
                        this.add(keysAndValues[i], keysAndValues[i + 1]);
                    }
                }
            } else if (key) {
                var obj = key;
                for (var k in obj) {
                    this.add(k, obj[k]);
                }
            }
        }
        Map.prototype.add = function (key, value) {
            this.real.push({ key: key, value: value });
        };

        Map.prototype.foreach = function (f) {
            this.real.forEach(function (value, index, array) {
                return f(value.key, value.value);
            });
        };

        Map.prototype.map = function (f) {
            return this.real.map(function (value, index, array) {
                return f(value.key, value.value);
            });
        };

        Map.prototype.mapValues = function (f) {
            var _this = this;
            var result = new Map();
            this.foreach(function (k, v) {
                _this.add(k, f(v));
            });
            return result;
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
            return this.find(function (k, v) {
                return k == key;
            }).map(function (obj) {
                return obj.value;
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
                return (this.value);
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
