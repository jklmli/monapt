import { test, TestContext } from 'ava';
import { Success } from '../../src/try/success';
import { Try } from '../../src/try/try';
import { Failure } from '../../src/try/failure';

test('Try::apply', (t: TestContext) => {
  t.deepEqual(
    Try(() => 'hello'),
    new Success('hello')
  );

  t.deepEqual(
    Try((): void => { throw new Error('hello'); }),
    new Failure<never>(new Error('hello'))
  );
});

test('Try::flatten', (t: TestContext) => {
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
