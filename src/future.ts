/// <reference path="./cracker.ts" />
/// <reference path="./try.ts" />

module Katana {

    var asInstanceOf = <T>(v: any): T => {
        return <T>v;
    }

    export interface ICompleteFucntion<T> {
        (trier: Try<T>): void;
    }

    export class Future<T> {

        private cracker = new Cracker<ICompleteFucntion<T>>();

        constructor(future: (success:(value: T) => void,
                             failure:(error: Error) => void)
                                => void) {
            future(v => this.success(v), e => this.failure(e));
        }

        public/*protected*/ success(value: T) {
            this.cracker.fire(fn => fn(new Katana.Success<T>(value)));
        }

        public/*protected*/ failure(error: Error) {
            this.cracker.fire(fn => fn(new Katana.Failure<T>(error)));
        }

        onComplete(callback: ICompleteFucntion<T>) {
            this.cracker.add(callback);
        }

        onSuccess(callback: (value: T) => void) {
            this.onComplete(r => {
                r.match({
                    Success: v => callback(v)
                });
            });
        }

        onFailure(callback: (error: Error) => void) {
            this.onComplete(r => {
                r.match({
                    Failure: error => callback(error)
                });
            });
        }

        map<U>(f: (value: T, success: (value: U), failure: (error: Error)) => void): Future<U> {
            var promise = new Promise<U>();
            this.onComplete(r => {
                r.match({
                    Failure: e => promise.failure(e)
                    Success: v => f(v, (v: U) => promise.success(v), (e: Error) => promise.failure(e))
                });
            });

            return promise.future();
        }

        flatMap<U>(f: (value: T) => Future<U>): Future<U> {
            var promise = new Promise<U>();
            this.onComplete(r => {
                r.match({
                    Failure: e => promise.failure(e)
                    Success: v => {
                        f(v).onComplete(fr => {
                            fr.match({
                                Success: v => promise.success(e)
                                Failure: e => promise.failure(e)    
                            })
                        });
                    }    
                })
            });
            return promise.future();
        }

        filter(f: (value: T) => boolean): Future<T> {
            var promise = new Promise<T>();
            this.onComplete(r => {
                r.match({
                    Failure: e => { promise.failure(e) },
                    Success: v => {
                        try {
                            if (f(v)) { promise.success(v) } 
                            else { promise.failure(new Error('No such element.')) }
                        } catch(e) {
                            promise.failure(e);
                        }
                    }
                })
            });
            return promise.future();
        }

        reject(f: (value: T) => boolean): Future<T> {
            return this.filter(v => !f(v));
        }
    }

    export class Promise<T> extends Future<T> {

        isComplete = false;

        constructor() {
            super((s, f) => {});
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
}