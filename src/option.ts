module Katana {

    export interface IOptionMatcher<A> {
        Some?(value: A): void;
        None?(): void;
    }

    export interface Option<A> {
        get(): A;
        getOrElse(defaultValue: () => A): A;
        match(matcher: IOptionMatcher<A>);
        map<B>(f: (value: A) => B): Option<B>;
        flatMap<B>(f: (value: A) => Option<B>): Option<B>;
        flatten<B>(): Option<B>;
    }

    export class Some<A> implements Option<A> {

        constructor(private value :A) { }

        get(): A {
            return this.value;
        }

        getOrElse(defaultValue: () => A): A {
            return this.value;
        }

        match(matcher: IOptionMatcher<A>) {
            if (matcher.Some) {
                matcher.Some(this.value);
            }
        }

        map<B>(f: (value: A) => B): Option<B> {
            return new Some<B>(f(this.get()));
        }

        flatMap<B>(f: (value: A) => Option<B>): Option<B> {
            return f(this.get());
        }

        flatten<B>(): Option<B> {
            if (this.value instanceof Some) {
                // :-|
                return <Some<B>>(<any>this.value);
            }
            else if (this.value instanceof None) {
                return new None<B>();
            }
            else {
                throw new Error('Cannot prove that.');
            }
            return null;
        }
        
    }
    

    export class None<A> implements Option<A> {

        get(): A {
            throw new Error('No such element.');
        }

        getOrElse(defaultValue: () => A): A {
            return defaultValue();
        }

        match(matcher: IOptionMatcher<A>) {
            if (matcher.None) {
                matcher.None();
            }
        }

        map<B>(f: (value: A) => B): Option<B> {
            return new None<B>();
        }

        flatMap<B>(f: (value: A) => Option<B>): Option<B> {
            return new None<B>();
        }

        flatten<B>(): Option<B> {
            return new None<B>();
        }
    }
    
}