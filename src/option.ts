module Katana {

    var asInstanceOf = <T>(v: any): T => {
        return <T>v;
    }

    export interface IOptionMatcher<A> {
        Some?(value: A): void;
        None?(): void;
    }

    export interface Option<A> {
        isEmpty: boolean;

        get(): A;
        getOrElse(defaultValue: () => A): A;
        orElse(alternative: () => Option<A>): Option<A>;

        match(matcher: IOptionMatcher<A>);
        
        map<B>(f: (value: A) => B): Option<B>;
        flatMap<B>(f: (value: A) => Option<B>): Option<B>;

        filter(f: (value: A) => boolean): Option<A>;
        reject(f: (value: A) => boolean): Option<A>;

        foreach(f: (value: A) => void): void;
    }

    export class Some<A> implements Option<A> {
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

        filter(f: (value: A) => boolean): Option<A> {
            if (f(this.value)) {
                return this;
            }
            else {
                return new None<A>();
            }
        }

        reject(f: (value: A) => boolean): Option<A> {
            return this.filter(v => !f(v));
        }

        foreach(f: (value: A) => void) {
            f(this.value);
        }
        
    }
    

    export class None<A> implements Option<A> {
        isEmpty = true;

        get(): A {
            throw new Error('No such element.');
        }

        getOrElse(defaultValue: () => A): A {
            return defaultValue();
        }

        orElse(alternative: () => Option<A>): Option<A> {
            return alternative();
        }

        match(matcher: IOptionMatcher<A>) {
            if (matcher.None) {
                matcher.None();
            }
        }

        map<B>(f: (value: A) => B): Option<B> {
            return asInstanceOf<None<B>>(this);
        }

        flatMap<B>(f: (value: A) => Option<B>): Option<B> {
            return asInstanceOf<None<B>>(this);
        }

        filter(f: (value: A) => boolean): Option<A> {
            return this;
        }

        reject(f: (value: A) => boolean): Option<A> {
            return this;
        }

        foreach(f: (value: A) => void) {
            return;
        }
    }
    
}