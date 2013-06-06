module Katana {
/*
    export interface Either<L, R> {
        getOrElse(defaultValue: () => A): A;
        orElse(alternative: () => Option<A>): Option<A>;
        match(matcher: IOptionMatcher<A>);
        map<B>(f: (value: A) => B): Option<B>;
        flatMap<B>(f: (value: A) => Option<B>): Option<B>;
        flatten<B>(): Option<B>;
    }
*/
    export interface Try<T> {
        get(): T;
    }

    export class Success<T> implements Try<T> {

        constructor(public value: T) {

        }

        get(): T { return null; }
    }

    export class Failure<T> implements Try<T> {

        constructor(public error: Error) {

        }
        get(): T { return null; }

    }

    export var TryOn = <T>(f: () => T): Try<T> => {
        try {
            return new Success<T>(f());
        }
        catch(e) {
            return new Failure<T>(e);
        }
    }
}