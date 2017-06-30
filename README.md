# Monapt

[![npm version](https://badge.fury.io/js/monapt.svg)](http://badge.fury.io/js/monapt)
[![Build Status](https://circleci.com/gh/jiaweihli/monapt/tree/1.0.svg?style=shield)](https://circleci.com/gh/jiaweihli/monapt/tree/1.0)
[![Coverage Status](https://coveralls.io/repos/github/jiaweihli/monapt/badge.svg?branch=1.0)](https://coveralls.io/github/jiaweihli/monapt?branch=1.0)

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-green.svg)](https://conventionalcommits.org)

Monapt helps you better manage `null`, `undefined`, exceptions, and other mildly interesting 
phenomena.  It handles them through the
[`Option`](http://danielwestheide.com/blog/2012/12/19/the-neophytes-guide-to-scala-part-5-the-option-type.html),
[`Try`](http://danielwestheide.com/blog/2012/12/26/the-neophytes-guide-to-scala-part-6-error-handling-with-try.html),
and [`Future`](http://danielwestheide.com/blog/2013/01/09/the-neophytes-guide-to-scala-part-8-welcome-to-the-future.html)
abstractions.


## Setup

```bash
$ npm install monapt
```

## APIs

### Usage

```typescript
import { Option } from 'monapt';

Option(1)
  .map((x) => x * 2)
  .getOrElse(() => 4);
```

Docs are undergoing a redesign, and will be published on a separate site.
In the meantime, the sources for the [`Option`](https://github.com/jiaweihli/monapt/tree/master/src/option), 
[`Future`](https://github.com/jiaweihli/monapt/tree/master/src/future), and 
[`Try`](https://github.com/jiaweihli/monapt/tree/master/src/try) classes are readable.

You can also take a look at the [tests](https://github.com/jiaweihli/monapt/tree/master/test) to get
a feel for how to use them.

## Changes in 1.0

1.0 was a complete rewrite of Monapt - including everything from the implementation to the tooling 
to the tests.  The result is almost the same API, but more true to the original Scala interface. 

## Migrating from 0.7.1

### Breaking Changes

- All default exports have been removed [to avoid ambiguity](https://github.com/palantir/tslint/issues/1182#issue-151780453).
- `Future` now depends on `when.Promise`, and uses it internally when representing promises.
- `Future#onFailure` has been removed.
- `Future#onSuccess` has been removed.
- `Future#reject` has been removed.
- `Monapt::flatten` has been renamed to `Option::flatten`.
- `Monapt::future` has been renamed to `Future::create`.  It now accepts a 
  `when.Promise<A> | when.Thenable<A> | A`.
- `Option#reject` has been renamed to `Option#filterNot`.
- `Try#reject` has been removed.

These are all backed by type definitions, so compiling your code via TypeScript should reveal any 
breakages.

## Credits

This repo couldn't have been possible without [yaakaito/monapt](https://github.com/yaakaito/monapt). 
In his absence, I'll continue improving upon his hard work.
