module Katana {

    export interface Either<L, R> {
        /*
        get(): A;
        getOrElse(defaultValue: () => A): A;
        orElse(alternative: () => Option<A>): Option<A>;
        match(matcher: IOptionMatcher<A>);
        map<B>(f: (value: A) => B): Option<B>;
        flatMap<B>(f: (value: A) => Option<B>): Option<B>;
        flatten<B>(): Option<B>;
        */
    }

    export class Left<L, R> implements Either<L, R> { }
    export class Right<L, R> implements Either<L, R> { }
}