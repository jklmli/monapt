import { ExecutionContext, test } from 'ava';

import { Failure } from '../../src/try/failure';
import { Success } from '../../src/try/success';
import { Try } from '../../src/try/try';

test('Try::apply', (t: ExecutionContext) => {
  t.deepEqual(
    Try(() => 'hello'),
    new Success('hello')
  );

  t.deepEqual(
    Try((): void => { throw new Error('hello'); }),
    new Failure<never>(new Error('hello'))
  );
});

test('Try::flatten', (t: ExecutionContext) => {
  t.deepEqual(
    Try.flatten([
      new Failure<never>(new Error()),
      new Success(1),
      new Success(2),
      new Failure<never>(new Error()),
      new Success(3)
    ]),
    [1, 2, 3]
  );
});
