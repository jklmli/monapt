declare module 'monapt' {
    interface Tuple1<A> {
        _1: A;
    }
    var Tuple1: <A>(a: A) => Tuple1<A>;
    interface Tuple2<A, B> {
        _1: A;
        _2: B;
    }
    var Tuple2: <A, B>(a: A, b: B) => Tuple2<A, B>;
    interface IOptionMatcher<A, B> {
        Some(value: A): B;
        None(): B;
    }
    var Option: <T>(value: T) => Option<T>;
    interface Option<A> {
        isDefined: boolean;
        isEmpty: boolean;
        get(): A;
        getOrElse(defaultValue: () => A): A;
        orElse(alternative: () => Option<A>): Option<A>;
        match<B>(matcher: IOptionMatcher<A, B>): B;
        map<B>(f: (value: A) => B): Option<B>;
        flatMap<B>(f: (value: A) => Option<B>): Option<B>;
        filter(predicate: (value: A) => boolean): Option<A>;
        reject(predicate: (value: A) => boolean): Option<A>;
        foreach(f: (value: A) => void): void;
    }
    class Some<A> implements Option<A> {
        private value;
        isDefined: boolean;
        isEmpty: boolean;
        constructor(value: A);
        get(): A;
        getOrElse(defaultValue: () => A): A;
        orElse(alternative: () => Option<A>): Option<A>;
        match<B>(matcher: IOptionMatcher<A, B>): B;
        map<B>(f: (value: A) => B): Option<B>;
        flatMap<B>(f: (value: A) => Option<B>): Option<B>;
        filter(predicate: (value: A) => boolean): Option<A>;
        reject(predicate: (value: A) => boolean): Option<A>;
        foreach(f: (value: A) => void): void;
    }
    var None: Option<any>;
    var flatten: <T>(options: Option<T>[]) => T[];
    interface ITryMatcher<T, U> {
        Success(value: T): U;
        Failure(error: Error): U;
    }
    interface Try<T> {
        isSuccess: boolean;
        isFailure: boolean;
        get(): T;
        getOrElse(defaultValue: () => T): T;
        orElse(alternative: () => Try<T>): Try<T>;
        match<U>(matcher: ITryMatcher<T, U>): U;
        map<U>(f: (value: T) => U): Try<U>;
        flatMap<U>(f: (value: T) => Try<U>): Try<U>;
        filter(predicate: (value: T) => boolean): Try<T>;
        reject(predicate: (value: T) => boolean): Try<T>;
        foreach(f: (value: T) => void): void;
        recover(fn: (error: Error) => T): Try<T>;
        recoverWith(fn: (error: Error) => Try<T>): Try<T>;
        toOption(): Option<T>;
    }
    class Success<T> implements Try<T> {
        private value;
        isSuccess: boolean;
        isFailure: boolean;
        constructor(value: T);
        get(): T;
        getOrElse(defaultValue: () => T): T;
        orElse(alternative: () => Try<T>): Try<T>;
        match<U>(matcher: ITryMatcher<T, U>): U;
        map<U>(f: (value: T) => U): Try<U>;
        flatMap<U>(f: (value: T) => Try<U>): Try<U>;
        filter(predicate: (value: T) => boolean): Try<T>;
        reject(predicate: (value: T) => boolean): Try<T>;
        foreach(f: (value: T) => void): void;
        recover(fn: (error: Error) => T): Try<T>;
        recoverWith(fn: (error: Error) => Try<T>): Try<T>;
        toOption(): Option<T>;
    }
    class Failure<T> implements Try<T> {
        private error;
        isSuccess: boolean;
        isFailure: boolean;
        constructor(error: Error);
        get(): T;
        getOrElse(defaultValue: () => T): T;
        orElse(alternative: () => Try<T>): Try<T>;
        match<U>(matcher: ITryMatcher<T, U>): U;
        map<U>(f: (value: T) => U): Try<U>;
        flatMap<U>(f: (value: T) => Try<U>): Try<U>;
        filter(predicate: (value: T) => boolean): Try<T>;
        reject(predicate: (value: T) => boolean): Try<T>;
        foreach(f: (value: T) => void): void;
        recover(fn: (error: Error) => T): Try<T>;
        recoverWith(fn: (error: Error) => Try<T>): Try<T>;
        toOption(): Option<T>;
    }
    var Try: <T>(f: () => T) => Try<T>;
    interface ICrackerProducer<F> {
        (f: F): void;
    }
    class Cracker<F extends Function> {
        private fired;
        private callbacks;
        private producer;
        fire(producer: ICrackerProducer<F>): void;
        private fireAll();
        add(fn: F): void;
    }
    interface ICompleteFunction<T> {
        (trier: Try<T>): void;
    }
    interface IFutureSuccess<T> {
        (value: T): void;
    }
    interface IFutureFailure<T> {
        (error: Error): void;
    }
    interface IFuturePromiseLike<T> {
        (value: T): void;
        (error: Error): void;
        success: IFutureSuccess<T>;
        failure: IFutureFailure<T>;
    }
    class Future<T> {
        private cracker;
        constructor(future: (promise: IFuturePromiseLike<T>) => void);
        static succeed<T>(value: T): Future<T>;
        static failed<T>(error: Error): Future<T>;
        success(value: T): void;
        failure(error: Error): void;
        onComplete(callback: ICompleteFunction<T>): void;
        onSuccess(callback: (value: T) => void): void;
        onFailure(callback: (error: Error) => void): void;
        map<U>(f: (value: T, promise: IFuturePromiseLike<U>) => void): Future<U>;
        flatMap<U>(f: (value: T) => Future<U>): Future<U>;
        filter(predicate: (value: T) => boolean): Future<T>;
        reject(predicate: (value: T) => boolean): Future<T>;
        recover(fn: (e: Error, promise: IFuturePromiseLike<T>) => void): Future<T>;
        recoverWith(fn: (e: Error) => Future<T>): Future<T>;
    }
    class Promise<T> extends Future<T> {
        isComplete: boolean;
        constructor();
        success(value: T): void;
        failure(error: Error): void;
        future(): Future<T>;
    }
    var future: <T>(f: (promise: IFuturePromiseLike<T>) => void) => Future<T>;
    interface IHashable {
        hash?(): string;
    }
    class Map<K extends IHashable, V> {
        private real;
        private selector;
        constructor(key: K, value: V, ...keysAndValues: any[]);
        constructor(raw: Object);
        constructor();
        private ensureSelector(hint?);
        private add(key, value);
        foreach(f: (key: K, value: V) => void): void;
        map<K2, V2>(f: (key: K, value: V) => Tuple2<K2, V2>): Map<K2, V2>;
        flatMap<K2, V2>(f: (key: K, value: V) => Map<K2, V2>): Map<K2, V2>;
        mapValues<U>(f: (value: V) => U): Map<K, U>;
        filter(predicate: (key: K, value: V) => boolean): Map<K, V>;
        reject(predicate: (key: K, value: V) => boolean): Map<K, V>;
        find(f: (key: K, value: V) => boolean): Option<Tuple2<K, V>>;
        get(key: K): Option<V>;
        getOrElse(key: K, defaultValue: () => V): V;
        head(): Option<Tuple2<K, V>>;
    }
}
