module monapt {
    export class NoSuchElementError extends Error {
        public name: string;
        public message: string;
        public stack: string;

        constructor() {
            super('No such element.');

            this.name = 'NoSuchElementError';
            this.message = 'No such element.';
            this.stack = (<any>new Error()).stack;
        }
    }

    export interface IOptionMatcher<A, B> {
        Some(value: A): B;
        None(): B;
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
        isDefined: boolean;
        isEmpty: boolean;

        get(): A;
        getOrElse(defaultValue: () => A): A;
        orElse(alternative: () => Option<A>): Option<A>;

        match<B>(matcher: IOptionMatcher<A, B>): B;

        map<B>(f: (value: A) => B): Option<B>;
        flatMap<B>(f: (value: A) => Option<B>): Option<B>;

        filter(predicate: (value: A) => boolean): Option<A>;
        reject(predicate: (value: A) => boolean): Option<A>;

        foreach(f: (value: A) => void): void;

        equals(option: Option<A>): boolean;
    }

    export class Some<A> implements Option<A> {
        isDefined = true;
        isEmpty = false;

        constructor(private value :A) { }

        get(): A {
            return this.value;
        }

        getOrElse(defaultValue: () => A): A {
            return this.value;
        }

        orElse(alternative: () => Option<A>): Option<A> {
            return this;
        }

        match<B>(matcher: IOptionMatcher<A, B>): B {
            return matcher.Some(this.value);
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

        equals(option: Option<A>) {
            return option.match({
                None: (): boolean => false,
                Some: (value: A): boolean => this.value === value
            });
        }
    }

    class NoneImpl<A> implements Option<A> {
        isDefined = false;
        isEmpty = true;

        get(): A {
            throw new NoSuchElementError();
        }

        getOrElse(defaultValue: () => A): A {
            return defaultValue();
        }

        orElse(alternative: () => Option<A>): Option<A> {
            return alternative();
        }

        match<B>(matcher: IOptionMatcher<A, B>): B {
            return matcher.None();
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

        equals(option: Option<A>): boolean {
            return option.isEmpty;
        }
    }

    export var None: Option<any> = new NoneImpl<any>();

    export var flatten = <T>(options: Array<Option<T>>): Array<T> => {
        var ret = [];

        for(var i = 0, length = options.length; i < length; i++) {
            if (options[i].isDefined) {
                ret.push(options[i].get());
            }
        }

        return ret;
    };
}
