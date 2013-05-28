/// <reference path="./option.ts" />

module Katana {

    export interface IMapObject<K, V> {
        key: K;
        value: V;
    }

    export class Map<K, V> {
        private real: Array<IMapObject<K, V>> = [];

        constructor(raw: Object = {}) {

        }

        private add(key: K, value: V) {
            this.real.push({ key: key, value: value });
        }

        foreach(f: (key: K, value: V) => void) {
            this.real.forEach((value, index, array) => f(value.key, value.value));
        }

        map<U>(f: (key: K, value: V) => U): U[] {
            return this.real.map<U>((value, index, array) => f(value.key, value.value));
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
            if (this.real.length > 0) return new Some(this.real[0])
            else return new None<IMapObject<K, V>>();
        }
    }
}

var map = new Katana.Map<string, number>();
var s = map.filter((k,v) => true).head().map(x => "").get();