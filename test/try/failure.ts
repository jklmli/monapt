import { ExecutionContext, test } from 'ava';

import { Failure } from '../../src/try/failure';
import { None } from '../../src/option/none';
import { Success } from '../../src/try/success';

const errorMessage: string = 'test error message';
const error: Error = new Error(errorMessage);
const failure: Failure<string> = new Failure<string>(error);

test('Failure#exception', (t: ExecutionContext) => {
  t.is(
    failure.exception.message,
    errorMessage
  );
});

test('Failure#isFailure', (t: ExecutionContext) => {
  t.true(failure.isFailure);
});

test('Failure#isSuccess', (t: ExecutionContext) => {
  t.false(failure.isSuccess);
});

test('Failure#equals', (t: ExecutionContext) => {
  t.true(failure.equals(new Failure<string>(error)));

  t.false(failure.equals(new Failure<string>(new Error(errorMessage))));
});

test('Failure#filter', (t: ExecutionContext) => {
  t.is(
    failure.filter((v: String) => v === 'hello'),
    failure
  );
});

test('Failure#flatMap', (t: ExecutionContext) => {
  t.deepEqual(
    failure.flatMap(() => new Success('world')),
    failure
  );
});

test('Failure#foreach', (t: ExecutionContext) => {
  let executions: number = 0;

  failure.foreach(() => { executions += 1; });

  t.is(executions, 0);
});

test('Failure#get', (t: ExecutionContext) => {
  try {
    failure.get();
    t.fail();
  }
  catch (e) {
    t.pass();
  }
});

test('Failure#getOrElse', (t: ExecutionContext) => {
  t.is(
    failure.getOrElse(() => 'hello'),
    'hello'
  );
});

test('Failure#map', (t: ExecutionContext) => {
  t.deepEqual(
    failure.map((v: string) => `${v} world`),
    failure
  );
});

test('Failure#match', (t: ExecutionContext) => {
  t.is(
    failure.match({
      Success: (v: string): string => v,
      Failure: (): string => 'world'
    }),
    'world'
  );
});

test('Failure#orElse', (t: ExecutionContext) => {
  t.deepEqual(
    failure.orElse(() => new Success('world')),
    new Success('world')
  );
});

test('Failure#recover', (t: ExecutionContext) => {
  t.deepEqual(
    failure.recover((error: Error) => 'world'),
    new Success('world')
  );
});

test('Failure#recoverWith', (t: ExecutionContext) => {
  t.deepEqual(
    failure.recoverWith((error: Error) => new Success('world')),
    new Success('world')
  );
});

test('Failure#toOption', (t: ExecutionContext) => {
  t.is(
    failure.toOption(),
    None
  );
});
