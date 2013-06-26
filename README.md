Monapt
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
new monapt.None<string>()
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

## monapt.Try<T>

### monapt.Success / monapt.Failure


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