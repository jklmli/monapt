/// <reference path="./option.ts" />

module Katana {

    export interface IMapObject<K, V> {
        key: K;
        value: V;
    }

    export class Map<K, V> {
        private real: Array<IMapObject<K, V>> = [];

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
            this.real.push({ key: key, value: value });
        }

        foreach(f: (key: K, value: V) => void) {
            this.real.forEach((value, index, array) => f(value.key, value.value));
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

        find(f: (key: K, value: V) => boolean): Option<IMapObject<K, V>> {
            return this.filter(f).head();
        }

        get(key: K): Option<V> {
            return this.find((k, v) => k == key).map(obj => obj.value);
        }

        getOrElse(key: K, defaultValue: () => V): V {
            return this.get(key).getOrElse(defaultValue);
        }

        head(): Option<IMapObject<K, V>> {
            if (this.real.length > 0) {
                return new Some(this.real[0])
            }
            else {
                return new None<IMapObject<K, V>>();
            }
        }
    }
}
