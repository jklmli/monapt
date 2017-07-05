import * as when from 'when';

import { None } from '../option/none';
import { Option } from '../option/option';
import { Try } from '../try/try';

/* tslint:disable:no-any */
(when as any).Promise.onPotentiallyUnhandledRejection = (): void => {
  // :TRICKY: Ignore potentially unhandled exceptions since they're intentional.
  // :LINK: http://stackoverflow.com/a/29692412
};
/* tslint:enable */

/**
 * A Future represents a value which may or may not be available.  It may be asynchronously filled
 * in the future.
 */
class Future<A> {
  static create<A>(value: when.Promise<A> | when.Thenable<A> | A): Future<A> {
    return new Future(
      when(value) as when.Promise<A>
    );
}

  /* tslint:disable:variable-name */
  protected promise_: when.Promise<A>;
  protected value_: Option<Try<A>>;
  /* tslint:enable:variable-name */

  get isCompleted(): boolean {
    return this.value.isDefined;
  }

  get promise(): when.Promise<A> {
    return this.promise_;
  }

  get value(): Option<Try<A>> {
    return this.value_;
  }

  protected constructor(promise: when.Promise<A>) {
    this.value_ = None;

    this.promise_ = promise
      .tap((value: A): void => {
        this.value_ = Option(Try(() => value));
      })
      .catch((error: Error): when.Promise<A> => {
        this.value_ = Option(Try(() => { throw error; }));

        throw error;
      });
  }

  filter(predicate: (a: A) => boolean): Future<A> {
    return new Future(
      when.promise(
        (resolve: (a: A) => void, reject: (error: Error) => void): void => {
          this.promise
            .then((value: A): void => {
              if (predicate(value)) {
                resolve(value);
              }
              else {
                reject(new Error('Future.filter predicate is not satisfied'));
              }
            });
        }
      )
    );
  }

  flatMap<B>(mapper: (a: A) => Future<B>): Future<B> {
    return new Future(
      when.promise(
        (resolve: (b: B) => void, reject: (error: Error) => void): void => {
          this.promise
            .then((value: A): void => {
              try {
                mapper(value)
                  .foreach((b: B): void => {
                    resolve(b);
                  });
              }
              catch (error) {
                reject(error as Error);
              }
            })
            .catch((error: Error): void => {
              reject(error);
            });
        }
      )
    );
  }

  flatMapP<B>(mapper: (a: A) => Promise<B>): Future<B> {
    return new Future(
      when.promise(
        (resolve: (b: B) => void, reject: (error: Error) => void): void => {
          this.promise
            .then((value: A): void => {
              mapper(value)
                .then((b: B): void => {
                  resolve(b);
                })
                .catch((error: Error) => {
                  reject(error)
                })
            })
            .catch((error: Error) => {
              reject(error)
            })
        }
      )
    );
  }

  foreach<B>(run: (a: A) => B): void {
    this.promise
      .then((value: A): void => {
        run(value);
      });
  }

  map<B>(mapper: (a: A) => B): Future<B> {
    return new Future(
      this.promise
        .then((value: A): B => {
            return mapper(value);
        })
    );
  }

  onComplete<B>(run: (t: Try<A>) => B): void {
    this.promise
      .then((value: A): void => {
        run(Try(() => value));
      })
      .catch((error: Error): void => {
        run(Try(() => { throw error; }));
      });
  }

  recover<B, A extends B>(this: Future<A>, f: (e: Error) => B): Future<B> {
    return new Future(
      when.promise(
        (resolve: (b: B) => void, reject: (error: Error) => void): void => {
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
        }
      )
    );
  }

  recoverWith<B, A extends B>(this: Future<A>, f: (e: Error) => Future<B>): Future<B> {
    return new Future(
      when.promise(
        (resolve: (b: B) => void, reject: (error: Error) => void): void => {
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
        }
      )
    );
  }
}

export { Future };
