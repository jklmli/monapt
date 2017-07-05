import { None } from '../option/none';
import { Option } from '../option/option';
import { Try } from './try';

/**
 * Failure represents a computation that threw an exception during execution.  It signals that a
 * computation that may or may not have succeeded ended up failing.
 */
class Failure<A> implements Try<A> {
  private error: Error;

  get exception(): Error {
    return this.error;
  }

  get isFailure(): boolean {
    return true;
  }

  get isSuccess(): boolean {
    return false;
  }

  constructor(error: Error) {
    this.error = error;
  }

  equals<B>(other: Try<B>): boolean {
    return (other instanceof Failure) && this.error === other.error;
  }

  filter(predicate: (value: A) => boolean): Try<A> {
    return this;
  }

  flatMap<B>(f: (value: A) => Try<B>): Try<B> {
    return new Failure<B>(this.error);
  }

  foreach(run: (value: A) => void): void {
    // :TRICKY: Don't run it, since it's a failure.
  }

  get(): A {
    throw this.error;
  }

  getOrElse<B, A extends B>(this: Try<A>, defaultValue: () => B): B {
    return defaultValue();
  }

  map<B>(f: (value: A) => B): Try<B> {
    return new Failure<B>(this.error);
  }

  match<B>(matcher: { Success: (a: A) => B, Failure: (e: Error) => B }): B {
    return matcher.Failure(this.error);
  }

  orElse<B, A extends B>(this: Try<A>, alternative: () => Try<B>): Try<B> {
    return alternative();
  }

  recover(fn: (error: Error) => A): Try<A> {
    return Try(() => fn(this.error));
  }

  recoverWith(fn: (error: Error) => Try<A>): Try<A> {
    return fn(this.error);
  }

  toOption(): Option<A> {
    return None;
  }
}

export { Failure };
