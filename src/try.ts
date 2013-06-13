module katana {

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

        match(matcher: ITryMatcher<T>);

        map<U>(f: (value: T) => U): Try<U>;
        flatMap<U>(f: (value: T) => Try<U>): Try<U>;

        filter(predicate: (value: T) => boolean): Try<T>;
        reject(predicate: (value: T) => boolean): Try<T>;
        
        foreach(f: (value: T) => void): void;
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

        match(matcher: ITryMatcher<T>) {
            if (matcher.Success) matcher.Success(this.get());
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
                    return new Failure(new Error('Predicate does not hold for ' + this.value));
                }
            } catch(e) {
                return new Failure(e);
            }
        }

        reject(predicate: (value: T) => boolean): Try<T> {
            return this.filter((v) => !predicate(v));
        }

        foreach(f: (value: T) => void) {
            f(this.value);
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

        match(matcher: ITryMatcher<T>) {
            if (matcher.Failure) matcher.Failure(this.error);
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