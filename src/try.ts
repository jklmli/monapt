module Katana {

    var asInstanceOf = <T>(v: any): T => {
        return <T>v;
    }

    export interface ITryMatcher<T> {
        Success?(value: T): void;
        Failure?(error: Error): void;
    }

    export interface Try<T> {
        isSuccess: boolean;
        isFailure: boolean;
        get(): T;
        getOrElse(defaultValue: () => T): T;
        orElse(alternative: () => Try<T>): Try<T>;
        map<U>(f: (value: T) => U): Try<U>;
        flatMap<U>(f: (value: T) => Try<U>): Try<U>;
        match(matcher: ITryMatcher<T>);
    }

    export class Success<T> implements Try<T> {
        isSuccess = true;
        isFailure = false;

        constructor(private value: T) { }

        get(): T { 
            return this.value;
        }

        getOrElse(defaultValue: () => T): T {
            return this.get();
        }

        orElse(alternative: () => Try<T>): Try<T> {
            return this;
        }

        map<U>(f: (value: T) => U): Try<U> {
            return Try(() => f(this.value));
        }

        flatMap<U>(f: (value: T) => Try<U>): Try<U> {
            try {
                return f(this.value);
            }
            catch (e) {
                return new Failure<U>(e);
            }
        }

        match(matcher: ITryMatcher<T>) {
            if (matcher.Success) matcher.Success(this.get());
        }
    }

    export class Failure<T> implements Try<T> {
        isSuccess = false;
        isFailure = true;

        constructor(private error: Error) { }

        get(): T {
            throw this.error;
        }

        getOrElse(defaultValue: () => T): T {
            return defaultValue();
        }

        orElse(alternative: () => Try<T>): Try<T> {
            return alternative();
        }

        map<U>(f: (value: T) => U): Try<U> {
            return asInstanceOf<Try<U>>(this);
        }

        flatMap<U>(f: (value: T) => Try<U>): Try<U> {
            return asInstanceOf<Try<U>>(this);
        }

        match(matcher: ITryMatcher<T>) {
            if (matcher.Failure) matcher.Failure(this.error);
        }

    }

    export var Try = <T>(f: () => T): Try<T> => {
        try {
            return new Success<T>(f());
        }
        catch(e) {
            return new Failure<T>(e);
        }
    }
}