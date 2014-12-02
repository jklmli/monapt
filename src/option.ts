module monapt {

    declare class Error {
        public name: string;
        public message: string;
        public stack: string;
        constructor(message?: string);
    }

    class MatchError extends Error {
        constructor(public message: string) {
            super(message);
            this.name = 'MatchError';
            this.message = message;
            this.stack = (new Error()).stack;
        }
        toString() {
            return this.name + ': ' + this.message;
        }
    }

    export interface IOptionMatcher<A> {
        Some?(value: A): void;
        None?(): void;
    }

    export var Option = <T>(value: T): Option<T> => {
        if (typeof value !== "undefined" && value !== null) {
            return new Some(value);
        }
        else {
            return None;
        }
    };

    export interface Option<A> {
        isEmpty: boolean;

        get(): A;
        getOrElse(defaultValue: A): A;
        orElse(alternative: Option<A>): Option<A>;

        match(matcher: IOptionMatcher<A>);
        
        map<B>(f: (value: A) => B): Option<B>;
        flatMap<B>(f: (value: A) => Option<B>): Option<B>;

        filter(predicate: (value: A) => boolean): Option<A>;
        reject(predicate: (value: A) => boolean): Option<A>;

        foreach(f: (value: A) => void): void;
    }

    export class Some<A> implements Option<A> {
        isEmpty = false;

        constructor(private value :A) { }

        get(): A {
            return this.value;
        }

        getOrElse(defaultValue: A): A {
            return this.value;
        }

        orElse(alternative: Option<A>): Option<A> {
            return this;
        }

        match(matcher: IOptionMatcher<A>) {
            if (matcher.Some) {
                return matcher.Some(this.value);
            }
            else {
                throw new MatchError('Some(' + this.value + ')');
            }
        }

        map<B>(f: (value: A) => B): Option<B> {
            return new Some<B>(f(this.get()));
        }

        flatMap<B>(f: (value: A) => Option<B>): Option<B> {
            return f(this.get());
        }

        filter(predicate: (value: A) => boolean): Option<A> {
            if (predicate(this.value)) {
                return this;
            }
            else {
                return None;
            }
        }

        reject(predicate: (value: A) => boolean): Option<A> {
            return this.filter(v => !predicate(v));
        }

        foreach(f: (value: A) => void) {
            f(this.value);
        }
        
    }

    class NoneImpl<A> implements Option<A> {
        isEmpty = true;

        get(): A {
            throw new Error('No such element.');
        }

        getOrElse(defaultValue: A): A {
            return defaultValue;
        }

        orElse(alternative: Option<A>): Option<A> {
            return alternative;
        }

        match(matcher: IOptionMatcher<A>) {
            if (matcher.None) {
                return matcher.None();
            }
            else {
                throw new MatchError('None');
            }
        }

        map<B>(f: (value: A) => B): Option<B> {
            return None;
        }

        flatMap<B>(f: (value: A) => Option<B>): Option<B> {
            return None;
        }

        filter(predicate: (value: A) => boolean): Option<A> {
            return this;
        }

        reject(predicate: (value: A) => boolean): Option<A> {
            return this;
        }

        foreach(f: (value: A) => void) {
            return;
        }
    }

    export var None: Option<any> = new NoneImpl<any>();
}
