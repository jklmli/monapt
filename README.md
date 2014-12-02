Monapt [![Build Status](https://travis-ci.org/jiaweihli/monapt.png?branch=master)](https://travis-ci.org/jiaweihli/monapt)
============

Like Scala Monads for TypeScript and JavaScript

## Setup

With Bower:

```
$ bower install git://github.com/yaakaito/monapt.git --save
```

## APIs

## monapt.Option<A>

```javascript
var valueOption = map.get('key');
valueOption.getOrElse(() => 'defaultValue');
```


```javascript
valueOption.map(v => v * 2).filter(v => v > 10).match({
    Some: v  => console.log(v),
    None: () => console.log('None!')
})
```

### monapt.Some / monapt.None

```javascript
new monapt.Some('value')
monapt.None
```

### Properties / Methods

* `isEmpty: boolean`
* `get(): A`
* `getOrElse(defaultValue: () => A): A`
* `orElse(alternative: () => Option<A>): Option<A>`
* `match(matcher: IOptionMatcher<A>): void`
* `map<B>(f: (value: A) => B): Option<B>`
* `flatMap<B>(f: (value: A) => Option<B>): Option<B>`
* `filter(predicate: (value: A) => boolean): Option<A>`
* `reject(predicate: (value: A) => boolean): Option<A>`
* `foreach(f: (value: A) => void): void`


#### monapt.IOptionMatcher<A>

```javascript
interface IOptionMatcher<A> {
    Some?(value: A): void;
    None?(): void;
}
```

```javascript
trier.match({
    Success: v => console.log(v),
    Failure: e => console.log(e.message)
});
```

## monapt.Try<T>

```javascript
var trier = monapt.Try(() => {
    return parse(aValue);
});
trier.getOrElse(() => 'defaultValue');
```

### monapt.Success / monapt.Failure

```javascript
new monapt.Success('value')
new monapt.Failure<string>(new Error());
```

### Properties / Methods

* `isSuccess: boolean`
* `isFailure: boolean`
* `get(): T`
* `getOrElse(defaultValue: () => T): T`
* `orElse(alternative: () => Try<T>): Try<T>`
* `match(matcher: ITryMatcher<T>)`
* `map<U>(f: (value: T) => U): Try<U>`
* `flatMap<U>(f: (value: T) => Try<U>): Try<U>`
* `filter(predicate: (value: T) => boolean): Try<T>`
* `reject(predicate: (value: T) => boolean): Try<T>`
* `foreach(f: (value: T) => void): void`
* `recover(fn: (error: Error) => T): Try<T>`
* `recoverWith(fn: (error: Error) => Try<T>): Try<T>`

## monapt.Future<T>

```javascript
monapt.future<string>(promise => {
    api.get((error, value) => {
        if (error) {
            promise.failure(error);
        }
        else {
          promise.success(value);
        }
    });
}).onComplete({
    Success: v => console.log(v),
    Failure: e => console.log(e)
})
```

Mix futures:
```javascript
var macbook = monapt.future<string>(promise => {
    setTimeout(() => {
        promise.success('MacBook');
    }, 100);
});
 
var pro = monapt.future<string>(promise => {
    setTimeout(() => {
        promise.success('Pro');
    }, 100);
});
 
var macbookPro = macbook.flatMap<string>(mb => {
    return pro.map<string>((pro, promise) => {
        promise.success(mb + pro);
    });
});
 
macbookPro.onSuccess(v => {
    console.log(v); // MacBookPro
});
```

### Properties / Methods

* `onComplete(callback: ICompleteFunction<T>): void`
* `onSuccess(callback: (value: T) => void): void`
* `onFailure(callback: (error: Error) => void): void`
* `map<U>(f: (value: T, promise: IFuturePromiseLike<U>) => void): Future<U>`
* `flatMap<U>(f: (value: T) => Future<U>): Future<U>`
* `filter(predicate: (value: T) => boolean): Future<T>`
* `reject(predicate: (value: T) => boolean): Future<T>`
* `recover(fn: (e: Error, promise: IFuturePromiseLike<T>) => T): Future<T>`
* `recoverWith(fn: (e: Error) => Future<T>): Future<T>`
