Monapt [![npm version](https://badge.fury.io/js/monapt.svg)](http://badge.fury.io/js/monapt) [![Build Status](https://travis-ci.org/jiaweihli/monapt.png?branch=master)](https://travis-ci.org/jiaweihli/monapt)
============

[![Join the chat at https://gitter.im/jiaweihli/monapt](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/jiaweihli/monapt?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Like Scala Monads for TypeScript and JavaScript

This repo couldn't have been possible without https://github.com/yaakaito/monapt.  In his absence, I'll continue improving upon his hard work.

## Setup

With npm:

```
$ npm install monapt
```

With Bower:

```
$ bower install git://github.com/jiaweihli/monapt.git --save
```

## APIs

## monapt

### Properties / Methods

* `static flatten<T>(options: Array<Option<T>>): Array<T>`

## monapt.Option<A>

```javascript
var valueOption = map.get('key');
valueOption.getOrElse(() => 'defaultValue');
```

```javascript
valueOption
    .map((v) => v * 2)
    .filter((v) => v > 10)
    .match({
        Some: (v)  => console.log(v),
        None: () => console.log('None!')
    })
```

### monapt.Some / monapt.None

```javascript
monapt.Option('value') // Some('value')
monapt.Option(null) // None
monapt.Option(undefined) // None
monapt.None // None
monapt.None.get() // monapt.NoSuchElementError
monapt.flatten([Monapt.None, Monapt.Some(1)]) // [1]
```

### Properties / Methods

* `isDefined: boolean`
* `isEmpty: boolean`
* `get(): A`
* `getOrElse(defaultValue: () => A): A`
* `orElse(alternative: () => Option<A>): Option<A>`
* `match<B>(matcher: IOptionMatcher<A, B>): B`
* `map<B>(f: (value: A) => B): Option<B>`
* `flatMap<B>(f: (value: A) => Option<B>): Option<B>`
* `filter(predicate: (value: A) => boolean): Option<A>`
* `reject(predicate: (value: A) => boolean): Option<A>`
* `foreach(f: (value: A) => void): void`


#### monapt.IOptionMatcher<A>

```javascript
interface IOptionMatcher<A, B> {
    Some(value: A): B;
    None(): B;
}
```

## monapt.Try<T>

```javascript
var trier = monapt.Try(() => {
    return parse(aValue);
});
trier.getOrElse(() => 'defaultValue');
```

```javascript
trier.match({
    Success: (v) => console.log(v),
    Failure: (e) => console.log(e.message)
});
```

### monapt.Success / monapt.Failure

```javascript
new monapt.Success('value')
new monapt.Failure<string>(new Error());
```

### Properties / Methods

* `exception: Error`
* `isSuccess: boolean`
* `isFailure: boolean`
* `get(): T`
* `getOrElse(defaultValue: () => T): T`
* `orElse(alternative: () => Try<T>): Try<T>`
* `match<U>(matcher: ITryMatcher<T, U>): U`
* `map<U>(f: (value: T) => U): Try<U>`
* `flatMap<U>(f: (value: T) => Try<U>): Try<U>`
* `filter(predicate: (value: T) => boolean): Try<T>`
* `reject(predicate: (value: T) => boolean): Try<T>`
* `foreach(f: (value: T) => void): void`
* `recover(fn: (error: Error) => T): Try<T>`
* `recoverWith(fn: (error: Error) => Try<T>): Try<T>`

## monapt.Future<T>

```javascript
monapt.future<string>((promise) => {
    api.get((error, value) => {
        if (error) {
            promise.failure(error);
        }
        else {
          promise.success(value);
        }
    });
}).onComplete({
    Success: (v) => console.log(v),
    Failure: (e) => console.log(e)
})
```

Mix futures:
```javascript
var macbook = monapt.future<string>((promise) => {
    setTimeout(() => {
        promise.success('MacBook');
    }, 100);
});
 
var pro = monapt.future<string>((promise) => {
    setTimeout(() => {
        promise.success('Pro');
    }, 100);
});
 
var macbookPro = macbook.flatMap<string>((mb) => {
    return pro.map<string>((pro, promise) => {
        promise.success(mb + pro);
    });
});
 
macbookPro.onSuccess((v) => {
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
