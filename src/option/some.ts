import { None } from "./none";
import { Option } from "./option";

/**
 * Some represents non-emptiness.  It signals that a value that may not exist does actually exist.
 */
class Some<A> implements Option<A> {
    private value: A;

    get isDefined(): boolean {
        return true;
    }

    get isEmpty(): boolean {
        return false;
    }

    constructor(value: A) {
        this.value = value;
    }

    equals<B>(other: Option<B>): boolean {
        return other instanceof Some && this.get() === other.get();
    }

    filter(predicate: (value: A) => boolean): Option<A> {
        if (predicate(this.value)) {
            return this;
        } else {
            return None;
        }
    }

    filterNot(predicate: (value: A) => boolean): Option<A> {
        if (!predicate(this.value)) {
            return this;
        } else {
            return None;
        }
    }

    flatMap<B>(flatMapper: (value: A) => Option<B>): Option<B> {
        return flatMapper(this.value);
    }

    foreach(run: (value: A) => void): void {
        run(this.value);
    }

    get(): A {
        return this.value;
    }

    getOrElse<B, A extends B>(this: Some<A>, defaultValue: B): B {
        return this.value;
    }

    getOrElseBy<B, A extends B>(this: Some<A>, defaultValue: () => B): B {
        return this.value;
    }

    map<B>(mapper: (value: A) => B): Option<B> {
        return new Some(mapper(this.value));
    }

    match<B>(matcher: { Some: (a: A) => B; None: () => B }): B {
        return matcher.Some(this.value);
    }

    orElse<B, A extends B>(
        this: Some<A>,
        alternative: Option<B> | (() => Option<B>)
    ): Option<B> {
        return this;
    }
}

export { Some };
