/// <reference path="./option.ts" />
/// <reference path="./tuple.ts" />

module Katana {

    export interface IHashable {
        hash?(): string;
    }

    module Selector {

        export interface Selector<K> {
            register(k: K, index: number): Option[number]:
            index(k: K): number;
        }

        export class StringSelector implements Selector<string> {
            private table = {};
            index(k: string): number {
                return new Some<number>(<number>this.table[k]);
            }

        }

        export class HashableSelector<K extends IHashable> implements Selector<K> {
            private table = {};
            index(k: K): number {
                return new Some<number>(<number>this.table[k.hash()]);
            }
        }

        export class ObjetSelector implements Selector<Object> {
            index(k: Object): number {
                return new None<number>();
            }
        }
    }

    export class Map<K extends IHashable, V> {
        private real: Array<Tuple2<K, V>> = [];
        private selector: Selector.ISelector;

        constructor(key: K, value: V, ...keysAndValues: Array<any>);
        constructor(raw: Object);
        constructor();
        constructor(key?: any, value?: V, ...keysAndValues: Array<any>) {
            if (value) {
                if (keysAndValues.length != 0 && keysAndValues.length % 2 != 0) {
                    throw new Error(keysAndValues[keysAndValues.length-1] + ' has not value.');
                }
                else {
                    this.add(key, value);
                    for (var i = 0, l = keysAndValues.length; i < l; i += 2) {
                        this.add(keysAndValues[i], keysAndValues[i+1]);
                    }
                }
            }
            else if (key){
                var obj: Object = key;
                for (var k in obj) {
                    this.add(k, obj[k]);
                }
            }
        }

        private add(key: K, value: V) {
            this.real.push(Tuple2(key, value));
        }

        foreach(f: (key: K, value: V) => void) {
            this.real.forEach((value, index, array) => f(value._1, value._2));
        }

/* WIP
        // :\
        flatMap<T, U>(f: (key: K, value: V) => Array<any>): Map<T, U> {
            return null;
        }

        map<U>(f: (key: K, value: V) => U): U[] {
            return this.real.map<U>((value, index, array) => f(value.key, value.value));
        }

        mapValues<U>(f: (value: V) => U): Map<K, U> {
            var result = new Map<K, U>();
            this.foreach((k, v) => {
                this.add(k, f(v));
            });
            return result;
        }
*/

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
            return this.find((k, v) => k == key).map(obj => obj._2);
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
