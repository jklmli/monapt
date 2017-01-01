import { test, TestContext } from 'ava';

import { None } from '../../src/option/none';
import { Option } from '../../src/option/option';

test('None#isDefined', (t: TestContext) => {
  t.false(None.isDefined);
});

test('None#isEmpty', (t: TestContext) => {
  t.true(None.isEmpty);
});

test('None#equals', (t: TestContext) => {
  t.true(None.equals(None));
  t.false(None.equals(Option(1)));
});

test('None#filter', (t: TestContext) => {
  t.is(
    None.filter(() => true),
    None
  );
  t.is(
    None.filter(() => false),
    None
  );
});

test('None#filterNot', (t: TestContext) => {
  t.is(
    None.filterNot(() => true),
    None
  );
  t.is(
    None.filterNot(() => false),
    None
  );
});

test('None#flatMap', (t: TestContext) => {
  t.deepEqual(
    None.flatMap(() => Option('hello')),
    None
  );
});

test('None#foreach', (t: TestContext) => {
  let executions: number = 0;

  None.foreach(() => { executions += 1; });

  t.is(executions, 0);
});

test('None#get', (t: TestContext) => {
  t.throws(() => None.get(), (error: Error) => error instanceof Option.NoSuchElementError);
});

test('None#getOrElse', (t: TestContext) => {
  t.is(
    None.getOrElse(() => 'hello'),
    'hello'
  );
});

test('None#map', (t: TestContext) => {
  t.deepEqual(
    None.map((v: never) => 'hello'),
    None
  );
});

test('None#match', (t: TestContext) => {
  t.is(
    None.match({
      Some: (): string => 'hello',
      None: (): string => 'world'
    }),
    'world'
  );
});

test('None#orElse', (t: TestContext) => {
  t.deepEqual(
    None.orElse(() => Option('hello')),
    Option('hello')
  );
});
