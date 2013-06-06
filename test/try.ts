/// <reference path="../src/try.ts" />
/// <reference path="../d.ts/mocha.d.ts" />
/// <reference path="../d.ts/chai.d.ts" />

module Katana.Spec {

    describe('Try', () => {
        chai.should();
    
        describe('TryOn', () => {

            it('returns Success instacne if not throws error on f', () => {
                var trier = Katana.TryOn(() => {
                    return 1;
                });
                trier.should.instanceof(Katana.Success);
            });

            it('returns Failure instacne if throws error on f', () => {
                var trier = Katana.TryOn(() => {
                    (() => {
                        throw new Error('Some Error.');
                    })();
                    return 1;
                });
                trier.should.instanceof(Katana.Failure);
            });
        });

        describe('Success', () => {

            var success: Katana.Success<number>;
            beforeEach(() => {
                success = new Katana.Success(100);
            });

            it('is success', () => {
                success.isSuccess.should.be.true;
            });

            it('is not failure', () => {
                success.isFailure.should.be.false;
            });

            describe('#get', () => {
                it('returns the value', () => {
                    success.get().should.equal(100);
                });
            });

        });

        describe('Failure', () => {
            var failure: Katana.Failure<number>;
            beforeEach(() => {
                failure = new Katana.Failure(new Error('Error.'));    
            });

            it('is not success', () => {
                failure.isSuccess.should.be.false;
            });

            it('is failure', () => {
                failure.isFailure.should.be.true;
            });

            describe('#get', () => {
                it('throws error.', () => {
                    (() => failure.get()).should.throw('Error.');
                });
            });
        });
    });

}