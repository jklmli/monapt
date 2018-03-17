import { ExecutionContext, test } from 'ava';

import { Future } from '../../src/future/future';
import { Try } from '../../src/try/try';

const error: Error = new Error('sample error');

const success: Future<string> = Future.create('hello');
const failure: Future<string> = Future.create(Promise.reject(error));

test('Future#filter', async(t: ExecutionContext) => {
  t.plan(2);

  const successfulFilter: string = await success.filter((v: string) => v === 'hello').promise;
  t.is(successfulFilter, 'hello');

  await t.throws(success.filter((v: string) => v === 'world').promise);
});

test('Future#flatMap', async(t: ExecutionContext) => {
  t.plan(3);

  const successfulFlatMap: string = await success.flatMap(() => Future.create('world')).promise;
  t.is(successfulFlatMap, 'world');

  const failingFlatMap: PromiseLike<void> = success.flatMap((): Future<void> => { throw error; }).promise;
  await t.throws(failingFlatMap);

  await t.throws(failure.flatMap(() => success).promise);
});

test('Future#foreach', async(t: ExecutionContext) => {
  t.plan(2);

  let executions: number = 0;

  success.foreach(() => {
    executions += 1;
  });

  await success.promise;

  t.is(executions, 1);

  executions = 0;

  failure.foreach(() => {
    executions += 1;
  });

  try {
    await failure.promise;
  }
  catch (e) {
    // No-op: ignore exception
  }

  t.is(executions, 0);
});

test('Future#isCompleted', async(t: ExecutionContext) => {
  t.plan(2);

  const delayedFuture: Future<void> = Future.create(
    new Promise((resolve: (value: void) => void): void => {
      setTimeout(resolve, 0);
    })
  );

  t.is(delayedFuture.isCompleted, false);

  await delayedFuture.promise;

  t.is(delayedFuture.isCompleted, true);
});

test('Future#map', async(t: ExecutionContext) => {
  t.plan(2);

  const successfulMap: string = await success.map((v: string) => `${v} world`).promise;
  t.is(successfulMap, 'hello world');

  await t.throws(failure.map(() => 'world').promise);
});

test('Future#onComplete', async(t: ExecutionContext) => {
  t.plan(2);

  success.onComplete((v: Try<string>) => {
    t.true(v.isSuccess);
  });

  await success.promise;

  failure.onComplete((v: Try<string>) => {
    t.false(v.isSuccess);
  });

  try {
    await failure.promise;
  }
  catch (error) {
    // Do nothing, the failure throwing an error is expected.
  }
});

test('Future#recover', async(t: ExecutionContext) => {
  t.plan(4);

  const passthroughRecover: string = await success.recover((e: Error) => {
    if (e === error) {
      return 'world';
    }
    else {
      throw error;
    }
  }).promise;
  t.is(passthroughRecover, 'hello');

  const successfulRecover: string = await failure.recover((e: Error) => {
    if (e === error) {
      return 'world';
    }
    else {
      throw error;
    }
  }).promise;
  t.is(successfulRecover, 'world');

  await t.throws(
    failure.recover((e: Error) => {
      if (e !== error) {
        return 'world';
      }
      else {
        throw error;
      }
    }).promise
  );

  await t.throws(failure.recover((e: Error): string => { throw error; }).promise);
});

test('Future#recoverWith', async(t: ExecutionContext) => {
  t.plan(4);

  const passthroughRecoverWith: string = await success.recoverWith((e: Error) => {
    if (e === error) {
      return Future.create('world');
    }
    else {
      throw error;
    }
  }).promise;
  t.is(passthroughRecoverWith, 'hello');

  const successfulRecoverWith: string = await failure.recoverWith((e: Error) => {
    if (e === error) {
      return Future.create('world');
    }
    else {
      throw error;
    }
  }).promise;
  t.is(successfulRecoverWith, 'world');

  await t.throws(
    failure.recoverWith((e: Error) => {
      if (e !== error) {
        return Future.create('world');
      }
      else {
        throw error;
      }
    }).promise as PromiseLike<string>
  );

  await t.throws(failure.recoverWith((e: Error): Future<string> => { throw error; }).promise);
});
