/// <reference path="../src/try.ts" />
/// <reference path="../d.ts/mocha.d.ts" />
/// <reference path="../d.ts/chai.d.ts" />

module monapt.Spec {

    describe('Try', () => {
        chai.should();
    
        it('returns Success instacne if not throws error on f', () => {
            var trier = monapt.Try(() => {
                return 1;
            });
            trier.should.instanceof(monapt.Success);
        });

        it('returns Failure instacne if throws error on f', () => {
            var trier = monapt.Try(() => {
                (() => {
                    throw new Error('Some Error.');
                })();
                return 1;
            });
            trier.should.instanceof(monapt.Failure);
        });

        describe('Success', () => {

            var success: monapt.Success<string>;
            beforeEach(() => {
                success = new monapt.Success('value');
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
                    success.orElse(() => new monapt.Success('alternative')).get().should.equal('value');
                });
            });

            describe('#match', () => {
                it('call Success callback with the value', () => {
                    success.match({
                        Success: (value) => value.split('').reverse().join(''),
                        Failure: () => 'failure'
                    })
                      .should.equal('eulav');
                });
            });

            describe('#map', () => {
                it('returns a Success containing the result of applying func', () => {
                    var mapped = success.map(v => v + ' HELLO');
                    mapped.should.instanceof(monapt.Success);
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
                    success.flatMap((v) => new monapt.Success(v + ' HELLO')).get().should.equal('value HELLO');
                });

                it('returns a Failure if func throws error', () => {
                    (() => {
                        success.flatMap(v => {
                            throw new Error(v + ' Error.');
                            return new monapt.Success('');
                        }).get();
                    }).should.throw('value Error.');
                });
            });

            describe('#filter', () => {
                it('returns that if predicater returns true', () => {
                    success.filter(v => true).get().should.equal('value');
                });

                it('returns Failure if predicater returns false', () => {
                    var failure = success.filter(v => false);
                    failure.should.instanceof(monapt.Failure);
                });
            });

            describe('#reject', () => {
                it('returns that if predicater returns false', () => {
                    success.reject(v => false).get().should.equal('value');
                });

                it('returns Failure if predicater returns true', () => {
                    var failure = success.reject(v => true);
                    failure.should.instanceof(monapt.Failure);
                });
            });

            describe('#foreach', () => {
                it('apply func with value', () => {
                    var value: string;
                    success.foreach(v => value = v);
                    value.should.equal('value');
                });
            });

            describe('#recoverWith', () => {
                it('returns self', () => {
                    success.recover(error => 'recovered').should.eql(success);
                });
            });

            describe('#recoverWith', () => {
                it('returns self', () => {
                    success.recoverWith(error => new Success('recovered')).should.eql(success);
                });
            });

            describe('#toOption', () => {
                it('lifts to Some', () => {
                    var option = success.toOption();

                    option.should.instanceof(monapt.Some);
                    option.get().should.equal(success.get());
                });
            });
        });

        describe('Failure', () => {
            var failure: monapt.Failure<string>;
            beforeEach(() => {
                failure = new monapt.Failure<string>(new Error('Error.'));
            });

            it('is not success', () => {
                failure.isSuccess.should.be.false;
            });

            it('is failure', () => {
                failure.isFailure.should.be.true;
            });

            describe('#exception', () => {
                it('contains error.', () => {
                    failure.exception.message.should.equal('Error.');
                });
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
                    failure.orElse(() => new monapt.Success('alternative')).get().should.equal('alternative');
                });
            });

            describe('#match', () => {
                it('call Failure callback with the error', () => {
                    failure.match({
                        Success: (value) => value.split('').reverse().join(''),
                        Failure: () => 'failure'
                    })
                      .should.equal('failure');
                });
            });
            
            describe('#map', () => {
                it('never do anything', () => {
                    failure.map<string>((v) => {
                        return 'HELLO';    
                    }).should.instanceof(monapt.Failure);
                });
            });

            describe('#flatMap', () => {
                it('never do anything', () => {
                    failure.flatMap<string>((v) => {
                        return new monapt.Success('HELLO');
                    }).should.instanceof(monapt.Failure);
                });
            });

            describe('#filter', () => {
                it('never do anything', () => {
                    failure.filter(v => true).should.eql(failure);
                });
            });

            describe('#reject', () => {
                it('never do anything', () => {
                    failure.reject(v => true).should.eql(failure);
                });
            });

            describe('#foreach', () => {
                it('never do anythig', () => {
                    var counter = 0;
                    failure.foreach(v => counter++);
                    counter.should.equal(0);
                });
            });

            describe('#recover', () => {
                it('returns Success thats result of applying func', () => {
                    failure.recover(error => 'recovered').get().should.equal('recovered');
                });
            });

            describe('#recoverWith', () => {
                it('returns the result of applying func', () => {
                    failure.recoverWith(error => new monapt.Success('recovered')).get().should.equal('recovered');
                });
            });

            describe('#toOption', () => {
                it('lifts to None', () => {
                    failure.toOption().should.equal(monapt.None);
                });
            });
        });
    });

}
