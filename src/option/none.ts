import { Option } from "./option";

/**
 * None is a singleton class that represents emptiness.  It signals that a value that may not exist
 * doesn't exist.
 */
/* tslint:disable:class-name */
class None_<A> implements Option<A> {
    /* tslint:enable:class-name */
    static get INSTANCE(): None_<never> {
        return new None_<never>();
    }

    get isDefined(): boolean {
        return false;
    }

    get isEmpty(): boolean {
        return true;
    }

    private constructor() {
        // :TRICKY: We don't want to do anything except mark constructor as private.
    }

    equals<B>(other: Option<B>): boolean {
        return other instanceof None_;
    }

    filter(predicate: (value: A) => boolean): Option<A> {
        return this;
    }

    filterNot(predicate: (value: A) => boolean): Option<A> {
        return this;
    }

    flatMap<B>(flatMapper: (value: A) => Option<B>): Option<B> {
        return None_.INSTANCE;
    }

    foreach(run: (value: A) => void): void {
        // :TRICKY: Don't do anything.
    }

    get(): A {
        throw new Option.NoSuchElementError();
    }

    getOrElse<B, A extends B>(this: None_<A>, defaultValue: B): B {
        return defaultValue;
    }

    getOrElseBy<B, A extends B>(this: None_<A>, defaultValue: () => B): B {
        return defaultValue();
    }

    map<B>(mapper: (value: A) => B): Option<B> {
        return None_.INSTANCE;
    }

    match<B>(matcher: { Some: (a: A) => B; None: () => B }): B {
        return matcher.None();
    }

    orElse<B, A extends B>(
        this: None_<A>,
        alternative: () => Option<B>
    ): Option<B> {
        return alternative();
    }
}

const instance: None_<never> = None_.INSTANCE;

export { None_, instance as None };
