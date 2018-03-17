import { ExecutionContext, test } from 'ava';

import { None } from '../../src/option/none';
import { Option } from '../../src/option/option';

test('None#isDefined', (t: ExecutionContext) => {
  t.false(None.isDefined);
});

test('None#isEmpty', (t: ExecutionContext) => {
  t.true(None.isEmpty);
});

test('None#equals', (t: ExecutionContext) => {
  t.true(None.equals(None));
  t.false(None.equals(Option(1)));
});

test('None#filter', (t: ExecutionContext) => {
  t.is(
    None.filter(() => true),
    None
  );
  t.is(
    None.filter(() => false),
    None
  );
});

test('None#filterNot', (t: ExecutionContext) => {
  t.is(
    None.filterNot(() => true),
    None
  );
  t.is(
    None.filterNot(() => false),
    None
  );
});

test('None#flatMap', (t: ExecutionContext) => {
  t.deepEqual(
    None.flatMap(() => Option('hello')),
    None
  );
});

test('None#foreach', (t: ExecutionContext) => {
  let executions: number = 0;

  None.foreach(() => { executions += 1; });

  t.is(executions, 0);
});

test('None#get', (t: ExecutionContext) => {
  t.throws((): never => None.get(), { instanceOf: Option.NoSuchElementError });
});

test('None#getOrElse', (t: ExecutionContext) => {
  t.is(
    None.getOrElse(() => 'hello'),
    'hello'
  );
});

test('None#map', (t: ExecutionContext) => {
  t.deepEqual(
    None.map((v: never) => 'hello'),
    None
  );
});

test('None#match', (t: ExecutionContext) => {
  t.is(
    None.match({
      Some: (): string => 'hello',
      None: (): string => 'world'
    }),
    'world'
  );
});

test('None#orElse', (t: ExecutionContext) => {
  t.deepEqual(
    None.orElse(() => Option('hello')),
    Option('hello')
  );
});
