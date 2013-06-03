/// <reference path="../src/map.ts" />
/// <reference path="../d.ts/mocha.d.ts" />
/// <reference path="../d.ts/chai.d.ts" />

module Katana.Spec {

    describe('Map', () => {
        chai.should();

        describe('#constructor', () => {

            it('can initialize with key/value pairs', () => {
                var map = new Katana.Map('key1', 'value1',
                                         'key2', 'value2');

                map.get('key1').get().should.be.equal('value1');
                map.get('key2').get().should.be.equal('value2');
            });

            it('cannot initialize with invalid key/value paires', () => {
                var f = () => {
                    new Katana.Map('key1', 'value1',
                                   'key2');
                }
                f.should.throw('key2 has not value.');
            });

            it('can initialize with Object', () => {
                var map = new Katana.Map<string, string>({
                    'key1': 'value1',
                    'key2': 'value2'
                });

                map.get('key1').get().should.be.equal('value1');
                map.get('key2').get().should.be.equal('value2');
            });

            it('can initialize with any arugment', () => {
                var map = new Katana.Map<string, string>();
                map.get('hoge').get.should.throw('No such element.');   
            });
        });

        describe('when initialized three key/value pairs', () => {
 
            var map: Map<string, string>;
            beforeEach(() => {
                map = new Katana.Map('key1', 'value1',
                                     'key2', 'value2',
                                     'key3', 'value3');
            });

            describe('#get', () => {
                it('returns Some<V> if contains key', () => {
                    map.get('key1').should.be.instanceof(Katana.Some);
                    map.get('key1').get().should.equal('value1');
                });

                it('retruns None if not contains key', () => {
                    map.get('any').should.be.instanceof(Katana.None);
                });
            });


            describe('#getOrElse', () => {
                it('returns value if contains key', () => {
                    map.getOrElse('key1', () => 'a').should.equal('value1');
                });

                it('retruns defaultValue if not contains key', () => {
                    map.getOrElse('any', () => 'none').should.equal('none');
                });
            });

            describe('#foreach', () => {
                it('can iterate key/value pairs', () => {
                    var counter = 0;
                    map.foreach((k, v) => {
                        map.get(k).get().should.equal(v);
                        counter++;
                    });
                    counter.should.equal(3);
                });
            });

        });
    });
}
