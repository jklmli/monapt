/// <reference path="../src/cracker.ts" />
/// <reference path="../d.ts/mocha.d.ts" />
/// <reference path="../d.ts/chai.d.ts" />

module katana.Spec {
    chai.should();

    interface ITestFunc {
        (): void;
    }

    interface ITestFunc2 {
        (v: number): void;
    }

    describe('Cracker', () => {
        it('can fire callbacks', () => {
            var cracker = new katana.Cracker<ITestFunc>();
            var counter = 0;
            cracker.add(() => counter++);
            cracker.add(() => counter++);
            counter.should.equal(0);
            
            cracker.fire(fn => fn());
            counter.should.equal(2);

            cracker.add(() => counter++);
            counter.should.equal(3);
        });

        it('should apply function with binding context', () => {
            var cracker = new katana.Cracker<ITestFunc2>();
            var counter = 0;

            cracker.add(num => counter += num);
            cracker.add(num => counter += num);

            cracker.fire(fn => fn(2));

            counter.should.equal(4);

            cracker.add(num => counter += num * 2);
            counter.should.equal(8);

        });
    });
}
