/// <reference path="../src/try.ts" />
/// <reference path="../d.ts/mocha.d.ts" />
/// <reference path="../d.ts/chai.d.ts" />

module Katana.Spec {

    describe('Try', () => {
        chai.should();
    
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

        describe('Success', () => {

            var success: Katana.Success<string>;
            beforeEach(() => {
                success = new Katana.Success('value');
            });

            it('is success', () => {
                success.isSuccess.should.be.true;
            });

            it('is not failure', () => {
                success.isFailure.should.be.false;
            });

            describe('#get', () => {
                it('returns the value', () => {
                    success.get().should.equal('value');
                });
            });

            describe('#getOrElse', () => {
                it('returns the value', () => {
                    success.getOrElse(() => 'default').should.equal('value');
                });
            });

            describe('#orElse', () => {
                it('returns this', () => {
                    success.orElse(() => new Katana.Success('alternative')).get().should.equal('value');
                });
            });

            describe('#map', () => {
                it('returns a Success containing the result of applying func', () => {
                    var mapped = success.map(v => v + ' HELLO');
                    mapped.should.instanceof(Katana.Success);
                    mapped.get().should.equal('value HELLO');
                });

                it('returns a Failure if func throws error', () => {
                    (() => {
                        success.map(v => {
                            throw new Error(v + ' Error.');
                            return 'HELLO'
                        }).get();                       
                    }).should.throw('value Error.');
                });
            });

            describe('#flatMap', () => {
                it('returns the result of applying func', () => {
                    success.flatMap((v) => new Katana.Success(v + ' HELLO')).get().should.equal('value HELLO');
                });

                it('returns a Failure if func throws error', () => {
                    (() => {
                        success.flatMap(v => {
                            throw new Error(v + ' Error.');
                            return new Katana.Success('');
                        }).get();
                    }).should.throw('value Error.');
                });
            });

            describe('#match', () => {
                it('call Success callback with the value', () => {
                    var called = false;
                    var theValue = null;
                    success.match({
                        Success: (v) => {
                            called = true;
                            theValue = v;
                        }
                    });
                    called.should.be.true;
                    theValue.should.equal('value');
                });
            });
        });

        describe('Failure', () => {
            var failure: Katana.Failure<string>;
            beforeEach(() => {
                failure = new Katana.Failure<string>(new Error('Error.'));    
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

            describe('#getOrElse', () => {
                it('returns default value', () => {
                    failure.getOrElse(() => 'default').should.equal('default');
                });
            });

            describe('#orElse', () => {
                it('returns alternative', () => {
                    failure.orElse(() => new Katana.Success('alternative')).get().should.equal('alternative');
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

            describe('#match', () => {
                it('call Failure callback with the error', () => {
                    var called = false;
                    var theError = null;
                    failure.match({
                        Success: (v) => {
                        },
                        Failure: (e) => {
                            called = true;
                            theError = e;
                        }
                    });
                    called.should.be.true;
                    theError.message.should.equal('Error.');
                });
            });
        });
    });

}