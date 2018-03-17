import { ExecutionContext, test } from 'ava';

import { None } from '../../src/option/none';
import { Option } from '../../src/option/option';
import { Some } from '../../src/option/some';

test('Option::apply', (t: ExecutionContext) => {
  t.deepEqual(
    Option('hello'),
    new Some('hello')
  );

  /* tslint:disable:no-null-keyword */
  t.deepEqual(
    Option(null),
    None
  );
  /* tslint:enable */

  t.deepEqual(
    Option(undefined),
    None
  );
});

test('Option::flatten', (t: ExecutionContext) => {
  t.deepEqual(
    Option.flatten([
      None,
      new Some(1),
      new Some(2),
      None,
      new Some(3)
    ]),
    [1, 2, 3]
  );
});
