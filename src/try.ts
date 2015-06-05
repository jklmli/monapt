module monapt {

    var asInstanceOf = <T>(v: any): T => {
        return <T>v;
    }

    export interface ITryMatcher<T, U> {
        Success(value: T): U;
        Failure(error: Error): U;
    }

    export interface Try<T> {
        isSuccess: boolean;
        isFailure: boolean;

        get(): T;
        getOrElse(defaultValue: () => T): T;
        orElse(alternative: () => Try<T>): Try<T>;

        match<U>(matcher: ITryMatcher<T, U>): U;

        map<U>(f: (value: T) => U): Try<U>;
        flatMap<U>(f: (value: T) => Try<U>): Try<U>;

        filter(predicate: (value: T) => boolean): Try<T>;
        reject(predicate: (value: T) => boolean): Try<T>;
        
        foreach(f: (value: T) => void): void;

        recover(fn: (error: Error) => T): Try<T>;
        recoverWith(fn: (error: Error) => Try<T>): Try<T>;

        toOption(): Option<T>;
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

        match<U>(matcher: ITryMatcher<T, U>): U {
            return matcher.Success(this.get());
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

        filter(predicate: (value: T) => boolean): Try<T> {
            try {
                if (predicate(this.value)) {
                    return this;
                }
                else {
                    return new Failure<T>(new Error('Predicate does not hold for ' + this.value));
                }
            } catch(e) {
                return new Failure<T>(e);
            }
        }

        reject(predicate: (value: T) => boolean): Try<T> {
            return this.filter((v) => !predicate(v));
        }

        foreach(f: (value: T) => void) {
            f(this.value);
        }

        recover(fn: (error: Error) => T): Try<T> {
            return this;
        }

        recoverWith(fn: (error: Error) => Try<T>): Try<T> {
            return this;
        }

        toOption(): Option<T> {
            return new Some(this.value);
        }
    }

    export class Failure<T> implements Try<T> {
        isSuccess = false;
        isFailure = true;

        constructor(public exception: Error) { }

        get(): T {
            throw this.exception;
        }

        getOrElse(defaultValue: () => T): T {
            return defaultValue();
        }

        orElse(alternative: () => Try<T>): Try<T> {
            return alternative();
        }

        match<U>(matcher: ITryMatcher<T, U>): U {
            return matcher.Failure(this.exception);
        }

        map<U>(f: (value: T) => U): Try<U> {
            return asInstanceOf<Try<U>>(this);
        }

        flatMap<U>(f: (value: T) => Try<U>): Try<U> {
            return asInstanceOf<Try<U>>(this);
        }

        filter(predicate: (value: T) => boolean): Try<T> {
            return this;
        }

        reject(predicate: (value: T) => boolean): Try<T> {
            return this;
        }

        foreach(f: (value: T) => void) {
            return;
        }

        recover(fn: (error: Error) => T): Try<T> {
            try {
                return new Success(fn(this.exception));
            }
            catch (e) {
                return new Failure<T>(e);
            }
        }

        recoverWith(fn: (error: Error) => Try<T>): Try<T> {
            try {
                return fn(this.exception);
            }
            catch (e) {
                return new Failure<T>(this.exception);
            }
        }

        toOption(): Option<T> {
            return None;
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
