/// <reference path="../src/option.ts" />
/// <reference path="../d.ts/mocha.d.ts" />
/// <reference path="../d.ts/chai.d.ts" />

describe('Option', () => {
    chai.should();

    describe('Some', () => {    
        
        var some: monapt.Some<string>;
        beforeEach(() => { some = new monapt.Some('value') });

        it('is defined', () => some.isDefined.should.be.true);
        it('is not empty', () => some.isEmpty.should.be.false);

        describe('#get', () => {
            it('returns the value that binding on constructor', () => {
                some.get().should.equal('value');
            });
        });

        describe('#getOrElse', () => {
            it('returns the value that binding on constructor', () => {
                some.getOrElse(() => 'default').should.equal('value');
            });
        });

        describe('#orElse', () => {
            it('returns that', () => {
                some.orElse(() => new monapt.Some('alternative')).get().should.equal('value');
            });
        });

        describe('#match', () => {
            it('call some callback with the value', () => {
                var called = false;
                var theValue = null;
                some.match({
                    Some: (value) => {
                        called = true;
                        theValue = value;
                    }
                });
                called.should.be.true;
                theValue.should.equal('value');
            });
        });

        describe('#map', () => {
            it('returns a Some containing the result of applying func', () => {
                some.map((v) => 1).get().should.equal(1);
            });
        });

        describe('#flatMap', () => {
            it('returns the result of applying func if it is a Some', () => {
                var mapped = some.flatMap(v => new monapt.Some(1));
                mapped.should.be.instanceof(monapt.Some);
                mapped.get().should.equal(1);
            });

            it('returns a None if result of applying func that is None', () => {
                some.flatMap(v => monapt.None).should.equal(monapt.None);
            });
        });

        describe('#filter', () => {
            it('returns that if predicater returns ture', () => {
                some.filter(v => true).get().should.equal('value');
            });

            it('returns None if predicater returns false', () => {
                var none = some.filter(v => false);
                none.should.equal(monapt.None);
            });
        });

        describe('#reject', () => {
            it('returns that if predicater returns false', () => {
                some.reject(v => false).get().should.equal('value');
            });

            it('returns None if predicater returns true', () => {
                var none = some.reject(v => true);
                none.should.equal(monapt.None);
            });
        });

        describe('#foreach', () => {
            it('apply f with value', () => {
                var value = null;
                some.foreach(v => { value = v });
                value.should.equal('value');
            });
        });
    });

    describe('None', () => {
        
        var none: any;
        beforeEach(() => { none = monapt.None });

        it('is not defined', () => none.isDefined.should.be.false);
        it('is empty', () => none.isEmpty.should.be.true);

        describe('#get', () => {
            it('throws No such element Exception', () => {
                (() => none.get()).should.throw('No such element.');
            });
        });

        describe('#getOrElse', () => {
            it('returns default value', () => {
                none.getOrElse(() => 'default').should.equal('default');
            });
        });

        describe('#orElse', () => {
            it('returns alternative', () => {
                none.orElse(() => new monapt.Some('alternative')).get().should.equal('alternative');
            });
        });


        describe('#match', () => {
            it('call none callback', () => {
                var called = false;
                none.match({
                    Some: (value) => { },
                    None: () => {
                        called = true;
                    }
                });
                called.should.be.true;
            });
        });

        describe('#map', () => {
            it('never do anything', () => {
                none.map(v => 1).should.equal(monapt.None);
            });
        });

        describe('#flatMap', () => {
            it('never do anything', () => {
                none.flatMap(v => new monapt.Some(1)).should.equal(monapt.None);
            });
        });

        describe('#filter', () => {
            it('never do anything', () => {
                none.filter(v => true).should.eql(none);
            });
        });

        describe('#reject', () => {
            it('never do anything', () => {
                none.reject(v => true).should.eql(none);
            });
        });

        describe('#foreach', () => {
            it('never do anything', () => {
                var counter = 0;
                none.foreach(v => { counter++ });
                counter.should.equal(0);
            });
        });
    });
});
