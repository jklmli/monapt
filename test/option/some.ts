import { ExecutionContext, test } from 'ava';

import { None } from '../../src/option/none';
import { Option } from '../../src/option/option';

const some: Option<string> = Option('hello');

test('Some#isDefined', (t: ExecutionContext) => {
  t.true(some.isDefined);
});

test('Some#isEmpty', (t: ExecutionContext) => {
  t.false(some.isEmpty);
});

test('Some#equals', (t: ExecutionContext) => {
  t.true(some.equals(Option('hello')));
  t.false(some.equals(Option(1)));
  t.false(some.equals(None));
});

test('Some#filter', (t: ExecutionContext) => {
  t.is(
    some.filter((v: string) => v === 'hello'),
    some
  );
  t.is(
    some.filter((v: string) => v === 'world'),
    None
  );
});

test('Some#filterNot', (t: ExecutionContext) => {
  t.is(
    some.filterNot((v: string) => v === 'hello'),
    None
  );
  t.is(
    some.filterNot((v: string) => v === 'world'),
    some
  );
});

test('Some#flatMap', (t: ExecutionContext) => {
  t.deepEqual(
    some.flatMap(() => Option('world')),
    Option('world')
  );
});

test('Some#foreach', (t: ExecutionContext) => {
  let executions: number = 0;

  some.foreach(() => { executions += 1; });

  t.is(executions, 1);
});

test('Some#get', (t: ExecutionContext) => {
  try {
    t.is(
      some.get(),
      'hello'
    );
  }
  catch (e) {
    t.fail();
  }
});

test('Some#getOrElse', (t: ExecutionContext) => {
  t.is(
    some.getOrElse(() => 'world'),
    'hello'
  );
});

test('Some#map', (t: ExecutionContext) => {
  t.deepEqual(
    some.map((v: string) => `${v} world`),
    Option('hello world')
  );
});

test('Some#match', (t: ExecutionContext) => {
  t.is(
    some.match({
      Some: (v: string): string => v,
      None: (): string => 'world'
    }),
    'hello'
  );
});

test('Some#orElse', (t: ExecutionContext) => {
  t.deepEqual(
    some.orElse(() => Option('world')),
    Option('hello')
  );
});
