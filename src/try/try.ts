import { Failure } from './failure';
import { Option } from '../option/option';
import { Success } from './success';

/**
 * A Try represents a computation that may or may not have succeeded.
 */
interface Try<A> {
  isFailure: boolean;
  isSuccess: boolean;
  equals<B>(other: Try<B>): boolean;
  filter(predicate: (value: A) => boolean): Try<A>;
  flatMap<B>(f: (value: A) => Try<B>): Try<B>;
  foreach(run: (value: A) => void): void;
  get(): A;
  getOrElse<B, A extends B>(this: Try<A>, defaultValue: () => B): B;
  map<B>(f: (value: A) => B): Try<B>;
  match<B>(matcher: { Success: (a: A) => B, Failure: (e: Error) => B }): B;
  orElse<B, A extends B>(this: Try<A>, alternative: () => Try<B>): Try<B>;
  recover(fn: (error: Error) => A): Try<A>;
  recoverWith(fn: (error: Error) => Try<A>): Try<A>;
  toOption(): Option<A>;
}

/* tslint:disable:no-null-keyword only-arrow-functions */
function Try<A>(fn: () => A): Try<A> {
  try {
    return new Success(fn());
  }
  catch (e) {
    return new Failure<A>(e as Error);
  }
}
/* tslint:enable */

/* tslint:disable:no-namespace */
/* istanbul ignore next */
namespace Try {
  /* tslint:disable:only-arrow-functions */
  export function flatten<A>(tries: Array<Try<A>>): Array<A> {
    return tries
      .filter((attempt: Try<A>): boolean => attempt.isSuccess)
      .map((attempt: Try<A>): A => attempt.get());
  }
  /* tslint:enable */
}
/* tslint:enable */

export { Try };
