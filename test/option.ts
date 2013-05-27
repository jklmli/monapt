/// <reference path="../src/option.ts" />
/// <reference path="../d.ts/mocha.d.ts" />
/// <reference path="../d.ts/chai.d.ts" />

describe('Option', () => {
    chai.should();

    describe('Some', () => {    
        
        var some: Katana.Some<string>;
        beforeEach(() => { some = new Katana.Some('value') });

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

        describe('#match', () => {
            it('call some callback with the value', () => {
                var called = false;
                var theValue = null;
                some.match(
                    (value) => {
                        called = true;
                        theValue = value;   
                    },
                    () => {}
                );
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
                var mapped = some.flatMap(v => new Katana.Some(1));
                mapped.should.be.instanceof(Katana.Some);
                mapped.get().should.equal(1);
            });

            it('returns a None if result of applying func that is None', () => {
                some.flatMap(v => new Katana.None<number>()).should.be.instanceof(Katana.None);
            });
        });

        describe('#flatten', () => {
            it('returns a Some if its value is Same', () => {
                var flat = some.map(v => new Katana.Some('a')).flatten();
                flat.should.be.instanceof(Katana.Some);
                flat.get().should.equal('a');
            });

            it('returns None if its value is None', () => {
                some.map(v => new Katana.None<string>()).flatten().should.be.instanceof(Katana.None);    
            })

            it('cannot prove if its value isnt Option', () => {
                some.flatten.should.throw('Cannot prove that.');
            });
        })
    });

    describe('None', () => {
        
        var none: Katana.None<string>;
        beforeEach(() => { none = new Katana.None<string>() });

        describe('#get', () => {
            it('throws No such element Exception', () => {
                none.get.should.throw('No such element.');
            });
        });

        describe('#getOrElse', () => {
            it('returns default value', () => {
                none.getOrElse(() => 'default').should.equal('default');
            });
        });

        describe('#match', () => {
            it('call none callback', () => {
                var called = false;
                none.match(
                    (value) => { 
                    },
                    () => {
                        called = true;
                    }
                );
                called.should.be.true;
            });
        });

        describe('#map', () => {
            it('never do anything', () => {
                none.map(v => 1).should.be.instanceof(Katana.None);
            });
        });

        describe('#flatMap', () => {
            it('never do anything', () => {
                none.flatMap(v => new Katana.Some(1)).should.be.instanceof(Katana.None);
            });
        });

        describe('#flatten', () => {
            it('never do anything', () => {
                none.flatten().should.be.instanceof(Katana.None);
            });
        });
    });
});