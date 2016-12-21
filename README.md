Monapt [![npm version](https://badge.fury.io/js/monapt.svg)](http://badge.fury.io/js/monapt) [![Build Status](https://travis-ci.org/jiaweihli/monapt.png?branch=master)](https://travis-ci.org/jiaweihli/monapt) [![Join the chat at https://gitter.im/jiaweihli/monapt](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/jiaweihli/monapt?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
============

**The most current version of Monapt uses TypeScript 2.x.**

**TypeScript 1.x support is in maintenance mode on version 0.5.x.**  
**It lives on the [typescript-1.x branch](https://github.com/jiaweihli/monapt/tree/typescript-1.x).**

## What the heck are options anyway?

They're the cure for all your `null`/`undefined` problems.  Read [this article](http://danielwestheide.com/blog/2012/12/19/the-neophytes-guide-to-scala-part-5-the-option-type.html) to learn more!

#### And tries?

You can also read up on tries, which provide a flexible way to [deal with exceptions](http://danielwestheide.com/blog/2012/12/26/the-neophytes-guide-to-scala-part-6-error-handling-with-try.html).

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

## Monapt

### Properties / Methods

* `static flatten<T>(options: Array<Option<T>>): Array<T>`

## Monapt.Option<A>

```javascript
var valueOption = Option(null);
var finalValue = valueOption.getOrElse(() => 'defaultValue'); // 'defaultValue'
```

```javascript
valueOption
  .map((v) => v * 2)
  .filter((v) => v > 10)
  .match({
    Some: (v)  => 'Value: ' + v,
    None: () => 'Invalid value'
  })
```

### Monapt.Some / Monapt.None

```javascript
Monapt.Option('value') // Some('value')
Monapt.Option(null) // None
Monapt.Option(undefined) // None
Monapt.None // None
Monapt.None.get() // Monapt.NoSuchElementError
Monapt.flatten([Monapt.None, Monapt.Option(1)]) // [1]
```

### Properties / Methods

* `isDefined: boolean`
* `isEmpty: boolean`
* `get(): T`
* `getOrElse(defaultValue: () => T): T`
* `orElse(alternative: () => Option<A>): Option<A>`
* `match<B>(matcher: { Some: (T) => U, None: () => U }): U`
* `map<B>(f: (value: T) => U): Option<U>`
* `flatMap<B>(f: (value: T) => Option<U>): Option<B>`
* `filter(predicate: (value: T) => boolean): Option<U>`
* `reject(predicate: (value: T) => boolean): Option<U>`
* `foreach(f: (value: T) => void): void`
* `equals(option: Option<T>): boolean`

## Monapt.Try<T>

```javascript
var attempt = Monapt.Try(() => {
    return parse(aValue);
});
attempt.getOrElse(() => 'defaultValue');
```

```javascript
attempt.match({
    Success: (v) => 'Awesome! ' + v,
    Failure: (e) => 'Whoops!' + e.message
});
```

### Properties / Methods

* `exception: Error`
* `isSuccess: boolean`
* `isFailure: boolean`
* `get(): T`
* `getOrElse(defaultValue: () => T): T`
* `orElse(alternative: () => Try<T>): Try<T>`
* `match<U>(matcher: { Success: (T) => U, Failure: () => U }): U`
* `map<U>(f: (value: T) => U): Try<U>`
* `flatMap<U>(f: (value: T) => Try<U>): Try<U>`
* `filter(predicate: (value: T) => boolean): Try<T>`
* `reject(predicate: (value: T) => boolean): Try<T>`
* `foreach(f: (value: T) => void): void`
* `recover(fn: (error: Error) => T): Try<T>`
* `recoverWith(fn: (error: Error) => Try<T>): Try<T>`
* `toOption(): Option<T>`

## Monapt.Future<T>

```javascript
Monapt.future((promise) => {
  api.get((error, value) => {
    if (error) {
      promise.failure(error);
    }
    else {
      promise.success(value);
    }
  });
})
  .onComplete({
    Success: (v) => 'Awesome! ' + v,
    Failure: (e) => 'Whoops! ' + e.toString()
  })
```

Mix futures:
```javascript
var macbook = Monapt.Future((promise) => {
  setTimeout(() => {
    promise.success('MacBook');
  }, 100);
});

var pro = Monapt.future((promise) => {
  setTimeout(() => {
    promise.success('Pro');
  }, 100);
});

var macbookPro = macbook.flatMap((mb) => {
  return pro.map<string>((pro, promise) => {
    promise.success(mb + pro);
  });
});

macbookPro.onSuccess((v) => {
  console.log(v); // MacBookPro
});
```

### Properties / Methods

* `onComplete(callback: { Success: (T) => void, Failure: () => void } => void): void`
* `onSuccess(callback: (value: T) => void): void`
* `onFailure(callback: (error: Error) => void): void`
* `map<U>(f: (value: T, promise: IFuturePromiseLike<U>) => void): Future<U>`
* `flatMap<U>(f: (value: T) => Future<U>): Future<U>`
* `filter(predicate: (value: T) => boolean): Future<T>`
* `reject(predicate: (value: T) => boolean): Future<T>`
* `recover(fn: (e: Error, promise: IFuturePromiseLike<T>) => T): Future<T>`
* `recoverWith(fn: (e: Error) => Future<T>): Future<T>`

## Credits

This repo couldn't have been possible without https://github.com/yaakaito/monapt.  In his absence, I'll continue improving upon his hard work.
