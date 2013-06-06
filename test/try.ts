/// <reference path="../src/try.ts" />
/// <reference path="../d.ts/mocha.d.ts" />
/// <reference path="../d.ts/chai.d.ts" />

module Katana.Spec {

    describe('Try', () => {
        chai.should();
    
        describe('TryOn', () => {

            it('returns Success instacne if not throws error on f', () => {
                var trier = Katana.Try(() => {
                    return 1;
                });
                trier.should.instanceof(Katana.Success);
            });

            it('returns Failure instacne if throws error on f', () => {
                var trier = Katana.Try(() => {
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

            describe('#map', () => {
                it('returns a Success containing the result of applying func', () => {
                    var mapped = success.map(v => v.toString() + ' HELLO');
                    mapped.should.instanceof(Katana.Success);
                    mapped.get().should.equal('100 HELLO');
                });

                it('returns a Failure if func throws error', () => {
                    (() => {
                        success.map(v => {
                            throw new Error(v.toString() + ' Error.');
                            return 'HELLO'
                        }).get();                       
                    }).should.throw('100 Error.');
                });
            });

            describe('#flatMap', () => {
                it('returns the result of applying func', () => {
                    success.flatMap((v) => new Katana.Success(v.toString() + ' HELLO')).get().should.equal('100 HELLO');
                });

                it('returns a Failure if func throws error', () => {
                    (() => {
                        success.flatMap(v => {
                            throw new Error(v.toString() + ' Error.');
                            return new Katana.Success('');
                        }).get();
                    }).should.throw('100 Error.');
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

            describe('#map', () => {
                it('never do anything', () => {
                    failure.map<string>((v) => {
                        return 'HELLO';    
                    }).should.instanceof(Katana.Failure);
                });
            });

            describe('#flatMap', () => {
                it('never do anything', () => {
                    failure.flatMap<string>((v) => {
                        return new Katana.Success('HELLO');
                    }).should.instanceof(Katana.Failure);
                });
            });
        });
    });

}