/// <reference path="../src/option.ts" />
/// <reference path="../d.ts/mocha.d.ts" />
/// <reference path="../d.ts/chai.d.ts" />

describe('Option', () => {
    chai.should();

    describe('Option', () => {
        describe('::flatten', () => {
            it('extracts values', () => {
                var flattened: Array<number> = monapt.flatten([monapt.Option(1), monapt.Option(2), monapt.None]);
                flattened[0].should.equal(1);
                flattened[1].should.equal(2);
                flattened.length.should.equal(2);
            });
        });
    });

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
                some.match({
                    Some: (value) => value.split('').reverse().join(''),
                    None: () => 'none'
                })
                    .should.equal('eulav');
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

        describe('#equals', () => {
            it('should return true with two Somes with the same value', () => {
                var other: monapt.Option<string> = new monapt.Some('value');
                some.equals(other).should.be.true;
            });

            it('should return false with two Somes with different values', () => {
                var other: monapt.Option<string> = new monapt.Some('not value');
                some.equals(other).should.be.false;
            });

            it('should return false when give a None', () => {
                some.equals(monapt.None).should.be.false;
            });

            it('should return true when two Somes are equal under a custom equality function', () => {
                var objectSome: monapt.Option<{name: string, age: number}> = new monapt.Some({name: 'bob', age: 15});
                var other: monapt.Option<{name: string, age: number}> = new monapt.Some({name: 'bob', age: 20});
                var equality: (first: {name: string, age: number}, second: {name: string, age: number}) => boolean =
                    (first: {name: string, age: number}, second: {name: string, age: number}) => {
                    return first.name === second.name;
                };
                objectSome.equals(other, equality).should.be.true;
            });
        })
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

            it('throws monapt.NoSuchElementError', () => {
                (() => none.get()).should.throw(monapt.NoSuchElementError);
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
                none.match({
                    Some: (value) => value.split('').reverse().join(''),
                    None: () => 'none'
                })
                  .should.equal('none');
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

        describe('#equals', () => {
            it('should return true when given None', () => {
                none.equals(monapt.None).should.be.true;
            });

            it('should return false when given Some', () => {
                none.equals(new monapt.Some('value')).should.be.false;
            });
        })
    });
});
