import { ExecutionContext, test } from 'ava';

import { Failure } from '../../src/try/failure';
import { Some } from '../../src/option/some';
import { Success } from '../../src/try/success';
import { Try } from '../../src/try/try';

const success: Try<string> = new Success('hello');

test('Success#isFailure', (t: ExecutionContext) => {
  t.false(success.isFailure);
});

test('Success#isSuccess', (t: ExecutionContext) => {
  t.true(success.isSuccess);
});

test('Success#equals', (t: ExecutionContext) => {
  t.true(success.equals(new Success('hello')));

  t.false(success.equals(new Success('world')));
});

test('Success#filter', (t: ExecutionContext) => {
  t.is(
    success.filter((v: string) => v === 'hello'),
    success
  );
  t.deepEqual(
    success.filter((v: string) => v === 'world'),
    new Failure<string>(new Error('Predicate does not hold for hello'))
  );
});

test('Success#flatMap', (t: ExecutionContext) => {
  t.deepEqual(
    success.flatMap(() => new Success('world')),
    new Success('world')
  );
});

test('Success#foreach', (t: ExecutionContext) => {
  let executions: number = 0;

  success.foreach(() => { executions += 1; });

  t.is(executions, 1);
});

test('Success#get', (t: ExecutionContext) => {
  try {
    t.is(
      success.get(),
      'hello'
    );
  }
  catch (e) {
    t.fail();
  }
});

test('Success#getOrElse', (t: ExecutionContext) => {
  t.is(
    success.getOrElse(() => 'world'),
    'hello'
  );
});

test('Success#map', (t: ExecutionContext) => {
  t.deepEqual(
    success.map((v: string) => `${v} world`),
    new Success('hello world')
  );
});

test('Success#match', (t: ExecutionContext) => {
  t.is(
    success.match({
      Success: (v: string): string => v,
      Failure: (): string => 'world'
    }),
    'hello'
  );
});

test('Success#orElse', (t: ExecutionContext) => {
  t.deepEqual(
    success.orElse(() => new Success('world')),
    new Success('hello')
  );
});

test('Success#recover', (t: ExecutionContext) => {
  t.is(
    success.recover((error: Error) => 'world'),
    success
  );
});

test('Success#recoverWith', (t: ExecutionContext) => {
  t.deepEqual(
    success.recoverWith((error: Error) => new Success('world')),
    success
  );
});

test('Success#toOption', (t: ExecutionContext) => {
  t.deepEqual(
    success.toOption(),
    new Some('hello')
  );
});
