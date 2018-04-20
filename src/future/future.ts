import { None } from '../option/none';
import { Option } from '../option/option';
import { Try } from '../try/try';

/**
 * A Future represents a value which may or may not be available.  It may be asynchronously filled
 * in the future.
 */
class Future<A> {
  static create<A>(value: Promise<A> | A): Future<A> {
    const isPromise: (value: Promise<A> | A) => value is Promise<A> = (value: Promise<A> | A): value is Promise<A> => {
      return value instanceof Promise;
    };

    if (isPromise(value)) {
      return new Future(value as Promise<A>);
    }
    else {
      return new Future(Promise.resolve(value));
    }
  }

  /* tslint:disable:variable-name */
  protected promise_: Promise<A>;
  protected value_: Option<Try<A>>;
  /* tslint:enable:variable-name */

  get isCompleted(): boolean {
    return this.value.isDefined;
  }

  get promise(): Promise<A> {
    return this.promise_;
  }

  get value(): Option<Try<A>> {
    return this.value_;
  }

  protected constructor(promise: Promise<A>) {
    this.value_ = None;

    this.promise_ = promise
      .then((value: A): A => {
        this.value_ = Option(Try(() => value));

        return value;
      })
      .catch((error: Error): Promise<A> => {
        this.value_ = Option(Try(() => { throw error; }));

        return promise;
      });
  }

  filter(predicate: (a: A) => boolean): Future<A> {
    return new Future(
      new Promise((resolve: (a: A) => void, reject: (error: Error) => void): void => {
        this.promise
          .then((value: A): void => {
            if (predicate(value)) {
              resolve(value);
            }
            else {
              reject(new Error('Future.filter predicate is not satisfied'));
            }
          })
          .catch((error: Error): void => {
            reject(error);
          });
      })
    );
  }

  flatMap<B>(mapper: (a: A) => Future<B>): Future<B> {
    return new Future(
      new Promise((resolve: (b: B) => void, reject: (error: Error) => void): void => {
        this.promise
          .then((value: A): void => {
            try {
              mapper(value).promise
                .then((value: B): void => {
                    resolve(value);
                })
                .catch((error: Error): void => {
                    reject(error);
                });
            }
            catch (error) {
              reject(error as Error);
            }
          })
          .catch((error: Error): void => {
            reject(error);
          });
      })
    );
  }

  foreach<B>(run: (a: A) => B): void {
    this.promise
      .then((value: A): void => {
        run(value);
      })
      .catch((error: Error): void => {
        // Don't do anything on failure.
      });
  }

  map<B>(mapper: (a: A) => B): Future<B> {
    return new Future(
      this.promise
        .then((value: A): B => {
            return mapper(value);
        })
        .catch((error: Error): Promise<B> => {
          throw error;
        })
    );
  }

  onComplete<B>(run: (t: Try<A>) => B): void {
    this.promise
      .then(
        (value: A): void => {
          run(Try(() => value));
        })
      .catch((error: Error): void => {
        run(Try(() => { throw error; }));
      });
  }

  recover<B, A extends B>(this: Future<A>, f: (e: Error) => B): Future<B> {
    return new Future(
      new Promise((resolve: (b: B) => void, reject: (error: Error) => void): void => {
        this.promise
          .then((value: A): void => {
            resolve(value);
          })
          .catch((error: Error): void => {
            try {
              resolve(f(error));
            }
            catch (error) {
              reject(error as Error);
            }
          });
      })
    );
  }

  recoverWith<B, A extends B>(this: Future<A>, f: (e: Error) => Future<B>): Future<B> {
    return new Future(
      new Promise((resolve: (b: B) => void, reject: (error: Error) => void): void => {
        this.promise
          .then((value: A): void => {
            resolve(value);
          })
          .catch((error: Error): void => {
            try {
              f(error)
                .foreach((b: B): void => {
                  resolve(b);
                });
            }
            catch (error) {
              reject(error as Error);
            }
          });
      })
    );
  }

}

export { Future };
