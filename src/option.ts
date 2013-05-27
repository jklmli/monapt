module Katana {

    export interface Option<T> {
        get(): T;
        getOrElse(defaultValue: () => T): T;
        match(same:(value: T) => any, none:() => any);
    }

    export class Same<T> implements Option<T> {

        constructor(private value :T) { }

        get(): T {
            return this.value;
        }

        getOrElse(defaultValue: () => T): T {
            return this.value;
        }

        match(same:(value: T) => any, none:() => any) {
            same(this.get());            
        }
    }

    export class None<T> implements Option<T> {

        get(): T {
            throw new Error('No such element.');
        }

        getOrElse(defaultValue: () => T): T {
            return defaultValue();
        }

        match(same:(value: T) => any, none:() => any) {
            none();
        }
    }
}