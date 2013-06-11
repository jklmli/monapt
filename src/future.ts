/// <reference path="./cracker.ts" />
/// <reference path="./try.ts" />

module Katana {

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

        filter(f: (value: T) => boolean): Future<T> {
            var promise = new Promise<T>();
            this.onComplete(r => {
                r.match({
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