declare module katana {
    interface Tuple1<A> {
        _1: A;
    }
    var Tuple1: <A>(a: A) => Tuple1<A>;
    interface Tuple2<A, B> {
        _1: A;
        _2: B;
    }
    var Tuple2: <A, B>(a: A, b: B) => Tuple2<A, B>;
}
declare module katana {
    interface IOptionMatcher<A> {
        Some? (value: A): void;
        None? (): void;
    }
    interface Option<A> {
        isEmpty: boolean;
        get(): A;
        getOrElse(defaultValue: () => A): A;
        orElse(alternative: () => Option<A>): Option<A>;
        match(matcher: IOptionMatcher<A>);
        map<B>(f: (value: A) => B): Option<B>;
        flatMap<B>(f: (value: A) => Option<B>): Option<B>;
        filter(predicate: (value: A) => boolean): Option<A>;
        reject(predicate: (value: A) => boolean): Option<A>;
        foreach(f: (value: A) => void): void;
    }
    class Some<A> implements Option<A> {
        private value;
        public isEmpty: boolean;
        constructor(value: A);
        public get(): A;
        public getOrElse(defaultValue: () => A): A;
        public orElse(alternative: () => Option<A>): Option<A>;
        public match(matcher: IOptionMatcher<A>): void;
        public map<B>(f: (value: A) => B): Option<B>;
        public flatMap<B>(f: (value: A) => Option<B>): Option<B>;
        public filter(predicate: (value: A) => boolean): Option<A>;
        public reject(predicate: (value: A) => boolean): Option<A>;
        public foreach(f: (value: A) => void): void;
    }
    class None<A> implements Option<A> {
        public isEmpty: boolean;
        public get(): A;
        public getOrElse(defaultValue: () => A): A;
        public orElse(alternative: () => Option<A>): Option<A>;
        public match(matcher: IOptionMatcher<A>): void;
        public map<B>(f: (value: A) => B): Option<B>;
        public flatMap<B>(f: (value: A) => Option<B>): Option<B>;
        public filter(predicate: (value: A) => boolean): Option<A>;
        public reject(predicate: (value: A) => boolean): Option<A>;
        public foreach(f: (value: A) => void): void;
    }
}
declare module katana {
    interface ITryMatcher<T> {
        Success? (value: T): void;
        Failure? (error: Error): void;
    }
    interface Try<T> {
        isSuccess: boolean;
        isFailure: boolean;
        get(): T;
        getOrElse(defaultValue: () => T): T;
        orElse(alternative: () => Try<T>): Try<T>;
        match(matcher: ITryMatcher<T>);
        map<U>(f: (value: T) => U): Try<U>;
        flatMap<U>(f: (value: T) => Try<U>): Try<U>;
        filter(predicate: (value: T) => boolean): Try<T>;
        reject(predicate: (value: T) => boolean): Try<T>;
        foreach(f: (value: T) => void): void;
    }
    class Success<T> implements Try<T> {
        private value;
        public isSuccess: boolean;
        public isFailure: boolean;
        constructor(value: T);
        public get(): T;
        public getOrElse(defaultValue: () => T): T;
        public orElse(alternative: () => Try<T>): Try<T>;
        public match(matcher: ITryMatcher<T>): void;
        public map<U>(f: (value: T) => U): Try<U>;
        public flatMap<U>(f: (value: T) => Try<U>): Try<U>;
        public filter(predicate: (value: T) => boolean): Try<T>;
        public reject(predicate: (value: T) => boolean): Try<T>;
        public foreach(f: (value: T) => void): void;
    }
    class Failure<T> implements Try<T> {
        private error;
        public isSuccess: boolean;
        public isFailure: boolean;
        constructor(error: Error);
        public get(): T;
        public getOrElse(defaultValue: () => T): T;
        public orElse(alternative: () => Try<T>): Try<T>;
        public match(matcher: ITryMatcher<T>): void;
        public map<U>(f: (value: T) => U): Try<U>;
        public flatMap<U>(f: (value: T) => Try<U>): Try<U>;
        public filter(predicate: (value: T) => boolean): Try<T>;
        public reject(predicate: (value: T) => boolean): Try<T>;
        public foreach(f: (value: T) => void): void;
    }
    var Try: <T>(f: () => T) => Try<T>;
}
declare module katana {
    interface ICrackerProducer<F> {
        (f: F): void;
    }
    class Cracker<F extends Function> {
        private fired;
        private callbacks;
        private producer;
        public fire(producer: ICrackerProducer<F>): void;
        private fireAll();
        public add(fn: F): void;
    }
}
declare module katana {
    interface ICompleteFucntion<T> {
        (trier: katana.Try<T>): void;
    }
    interface IFutureSuccess<T> {
        (value: T): void;
    }
    interface IFutureFailure<T> {
        (error: Error): void;
    }
    class Future<T> {
        private cracker;
        constructor(future: (success: IFutureSuccess<T>, failure: IFutureFailure<T>) => void);
        public success(value: T): void;
        public failure(error: Error): void;
        public onComplete(callback: ICompleteFucntion<T>): void;
        public onSuccess(callback: (value: T) => void): void;
        public onFailure(callback: (error: Error) => void): void;
        public map<U>(f: (value: T, success: IFutureSuccess<U>, failure: IFutureFailure<U>) => void): Future<U>;
        public flatMap<U>(f: (value: T) => Future<U>): Future<U>;
        public filter(predicate: (value: T) => boolean): Future<T>;
        public reject(predicate: (value: T) => boolean): Future<T>;
    }
    class Promise<T> extends Future<T> {
        public isComplete: boolean;
        constructor();
        public success(value: T): void;
        public failure(error: Error): void;
        public future(): Future<T>;
    }
}
declare module katana {
    interface IHashable {
        hash? (): string;
    }
    class Map<K extends katana.IHashable, V> {
        private real;
        private selector;
        constructor(key: K, value: V, ...keysAndValues: any[]);
        constructor(raw: Object);
        constructor();
        private ensureSelector(hint?);
        private add(key, value);
        public foreach(f: (key: K, value: V) => void): void;
        public map<K2, V2>(f: (key: K, value: V) => katana.Tuple2<K2, V2>): Map<K2, V2>;
        public flatMap<K2, V2>(f: (key: K, value: V) => Map<K2, V2>): Map<K2, V2>;
        public mapValues<U>(f: (value: V) => U): Map<K, U>;
        public filter(predicate: (key: K, value: V) => boolean): Map<K, V>;
        public reject(predicate: (key: K, value: V) => boolean): Map<K, V>;
        public find(f: (key: K, value: V) => boolean): katana.Option<katana.Tuple2<K, V>>;
        public get(key: K): katana.Option<V>;
        public getOrElse(key: K, defaultValue: () => V): V;
        public head(): katana.Option<katana.Tuple2<K, V>>;
    }
}
