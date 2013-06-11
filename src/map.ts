/// <reference path="./option.ts" />
/// <reference path="./tuple.ts" />

module Katana {

    export interface IHashable {
        hash?(): string;
    }

    module Selector {

        export interface ISelector<K> {
            register(k: K, index: number): void;
            index(k: K): Option<number>;
        }

        export class StringSelector implements ISelector<string> {
            private table = {};

            register(k: string, index: number) {
                this.table[k] = index;
            }

            index(k: string): Option<number> { 
                if (this.table[k]) {
                    return new Some<number>(<number>this.table[k]);
                }
                else {
                    return new None<number>();
                }
            }
        }

        export class HashableSelector<K extends IHashable> implements ISelector<K> {
            private table = {};

            register(k: K, index: number) {
                this.table[k.hash()] = index;
            }

            index(k: K): Option<number> {
                var hash = k.hash();
                if (this.table[hash]) {
                    return new Some<number>(<number>this.table[hash]);
                }
                else {
                    return new None<number>();
                }
            }
        }

        export class ObjectSelector implements ISelector<any> {

            register(k: any, index: number) { }

            index(k: Object): Option<number> {
                return new None<number>();
            }
        }
    }

    export class Map<K extends IHashable, V> {
        private real: Array<Tuple2<K, V>> = [];
        private selector: Selector.ISelector<K>;

        constructor(key: K, value: V, ...keysAndValues: Array<any>);
        constructor(raw: Object);
        constructor();
        constructor(key?: any, value?: V, ...keysAndValues: Array<any>) {
            if (value) {
                if (keysAndValues.length != 0 && keysAndValues.length % 2 != 0) {
                    throw new Error(keysAndValues[keysAndValues.length-1] + ' has not value.');
                }
                else {
                    this.ensureSelector(key);
                    this.add(key, value);
                    for (var i = 0, l = keysAndValues.length; i < l; i += 2) {
                        this.add(keysAndValues[i], keysAndValues[i+1]);
                    }
                }
            }
            else if (key){
                var obj: Object = key;
                for (var k in obj) {
                    this.ensureSelector(k);
                    this.add(k, obj[k]);
                }
            }

            this.ensureSelector();
        }

        private ensureSelector(hint: K = null) {
            if (this.selector) { return }
            
            if (!hint){
                this.selector = new Selector.ObjectSelector();
            }
            else if (typeof hint == 'string') {
                this.selector = new Selector.StringSelector();
            }
            else if (hint.hash) {
                this.selector = new Selector.HashableSelector<K>();
            }
            else {
                this.selector = new Selector.ObjectSelector();
            }
            
        }

        private add(key: K, value: V) {
            this.real.push(Tuple2(key, value));
            this.selector.register(key, this.real.length - 1);
        }

        foreach(f: (key: K, value: V) => void) {
            this.real.forEach((value, index, array) => f(value._1, value._2));
        }

        map<K2, V2>(f: (key: K, value: V) => Tuple2<K2, V2>): Map<K2, V2> {
            var result = new Map<K2, V2>();
            this.foreach((k: K, v: V) => {
                var t = f(k, v);
                result.add(t._1, t._2);
            });
            return result;
        }

        flatMap<K2, V2>(f: (key: K, value: V) => Map<K2, V2>): Map<K2, V2> {
            var result = new Map<K2, V2>();
            this.foreach((k: K, v: V) => {
                var r: Map<K2, V2> = f(k, v);
                r.foreach((k: K2, v: V2) => result.add(k, v));
            });
            return result;
        }

        mapValues<U>(f: (value: V) => U): Map<K, U> {
            var result = new Map<K, U>();
            this.foreach((k, v) => {
                result.add(k, f(v));
            });
            return result;
        }


        filter(f: (key: K, value: V) => boolean):  Map<K, V> {
            var result = new Map<K, V>();
            this.foreach((k, v) => {
                if (f(k, v)) result.add(k, v); 
            });
            return result;
        }

        reject(f: (key: K, value: V) => boolean): Map<K, V> {
            return this.filter((k, v) => !f(k, v));
        }

        find(f: (key: K, value: V) => boolean): Option<Tuple2<K, V>> {
            return this.filter(f).head();
        }

        get(key: K): Option<V> {
            return this.selector.index(key).map<V>(index => {
                return this.real[index]._2;
            }).orElse(() => {
                return this.find((k, v) => k == key).map<V>(tuple => {
                    return tuple._2;
                }).orElse(() => new None<K>());
            });
        }

        getOrElse(key: K, defaultValue: () => V): V {
            return this.get(key).getOrElse(defaultValue);
        }

        head(): Option<Tuple2<K, V>> {
            if (this.real.length > 0) {
                return new Some(this.real[0])
            }
            else {
                return new None<Tuple2<K, V>>();
            }
        }
    }
}
