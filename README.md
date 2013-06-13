# katana

Like Scala APIs for TypeScript and JavaScript
============

## Setup

With Bower:

```
$ bower install git://github.com/yaakaito/katana.git --save
```

## APIs

## katana.Option<A>

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

### katana.Some / katana.None

```javascript
new katana.Some('value')
new katana.None<string>()
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


#### katana.IOptionMatcher<A>

```javascript
interface IOptionMatcher<A> {
    Some?(value: A): void;
    None?(): void;
}
```

## katana.Try<T>

### katana.Success / katana.Failure


## katana.