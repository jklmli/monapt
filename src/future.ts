/// <reference path="./cracker.ts" />
/// <reference path="./option.ts" />
/// <reference path="./try.ts" />

module monapt {

    var asInstanceOf = <T>(v: any): T => {
        return <T>v;
    }

    export interface ICompleteFunction<T> {
        (trier: Try<T>): void;
    }

    export interface IFutureSuccess<T> {
        (value: T): void;
    }

    export interface IFutureFailure<T> {
        (error: Error): void;
    }

    export interface IFuturePromiseLike<T> {
        (value: T): void;
        (error: Error): void;
        success: IFutureSuccess<T>;
        failure: IFutureFailure<T>;
    }

    function F<T>(target): IFuturePromiseLike<T> {
        var f: any = v => {
            if (v instanceof Error) target.failure(v);
            else target.success(v);
        }
        f['success'] = v => target.success(v);
        f['failure'] = e => target.failure(e);
        return f;
    }

    export class Future<T> {

        private cracker = new Cracker<ICompleteFunction<T>>();

        constructor(future: (promise: IFuturePromiseLike<T>) => void) {
            future(F<T>(this));
        }

        static succeed<T>(value: T): Future<T> {
            return new Future(p => p.success(value));
        }

        static failed<T>(error: Error): Future<T> {
            return new Future(p => p.failure(error));
        }

        public/*protected*/ success(value: T) {
            this.cracker.fire(fn => fn(new monapt.Success<T>(value)));
        }

        public/*protected*/ failure(error: Error) {
            this.cracker.fire(fn => fn(new monapt.Failure<T>(error)));
        }

        onComplete(callback: ICompleteFunction<T>) {
            this.cracker.add(callback);
        }

        onSuccess(callback: (value: T) => void) {
            this.onComplete(r => {
                r.match({
                    Success: v => callback(v),
                    Failure: () => {}
                });
            });
        }

        onFailure(callback: (error: Error) => void) {
            this.onComplete(r => {
                r.match({
                    Success: () => {},
                    Failure: error => callback(error)
                });
            });
        }

        map<U>(f: (value: T, promise: IFuturePromiseLike<U>) => void): Future<U> {
            var promise = new Promise<U>();
            this.onComplete(r => {
                r.match({
                    Failure: e => promise.failure(e),
                    Success: v => f(v, F<U>(promise))
                });
            });
            return promise.future();
        }

        flatMap<U>(f: (value: T) => Future<U>): Future<U> {
            var promise = new Promise<U>();
            this.onComplete(r => {
                r.match({
                    Failure: e => promise.failure(e),
                    Success: v => {
                        f(v).onComplete(fr => {
                            fr.match({
                                Success: v => promise.success(v),
                                Failure: e => promise.failure(e)
                            })
                        });
                    }    
                })
            });
            return promise.future();
        }

        filter(predicate: (value: T) => boolean): Future<T> {
            var promise = new Promise<T>();
            this.onComplete(r => {
                r.match({
                    Failure: e => { promise.failure(e) },
                    Success: v => {
                        try {
                            if (predicate(v)) { promise.success(v) } 
                            else { promise.failure(new monapt.NoSuchElementError()) }
                        } catch(e) {
                            promise.failure(e);
                        }
                    }
                })
            });
            return promise.future();
        }

        reject(predicate: (value: T) => boolean): Future<T> {
            return this.filter(v => !predicate(v));
        }

        recover(fn: (e: Error, promise: IFuturePromiseLike<T>) => void): Future<T> {
            var promise = new Promise<T>();
            this.onComplete(r => {
                r.match({
                    Failure: error => {
                        try {
                            fn(error, F<T>(promise));
                        }
                        catch(e) {
                            promise.failure(e);
                        }
                    },
                    Success: v => promise.success(v)
                });
            });
            return promise.future();
        }

        recoverWith(fn: (e: Error) => Future<T>): Future<T> {
            var promise = new Promise<T>();
            this.onComplete(r => r.match({
                Failure: e => {
                    fn(e).onComplete(fr => fr.match({
                        Success: v => promise.success(v),
                        Failure: e => promise.failure(e)
                    }));
                },
                Success: v => promise.success(v) 
            }));
            return promise.future();
        }
    }

    export class Promise<T> extends Future<T> {

        isComplete = false;

        constructor() {
            super((p) => {});
        }

        success(value: T) {
            this.isComplete = true;
            super.success(value);
        }

        failure(error: Error) {
            this.isComplete = true;
            super.failure(error);
        }

        future(): Future<T> {
            return this;
        }
    }

    export var future = <T>(f: (promise: IFuturePromiseLike<T>) => void): Future<T> => {
        var p = new Promise<T>();
        // :(
        try {
            f(F<T>(p));
        }
        catch (e) {
            p.failure(e);
        }
        return p.future();
    }
}
