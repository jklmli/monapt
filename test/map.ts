/// <reference path="../src/map.ts" />
/// <reference path="../d.ts/mocha.d.ts" />
/// <reference path="../d.ts/chai.d.ts" />

module monapt.Spec {

    describe('Map', () => {
        chai.should();

        describe('#constructor', () => {

            it('can initialize with key/value pairs', () => {
                var map = new monapt.Map('key1', 'value1',
                                         'key2', 'value2');

                map.get('key1').get().should.be.equal('value1');
                map.get('key2').get().should.be.equal('value2');
            });

            it('cannot initialize with invalid key/value paires', () => {
                var f = () => {
                    new monapt.Map('key1', 'value1',
                                   'key2');
                }
                f.should.throw('key2 has not value.');
            });

            it('can initialize with Object', () => {
                var map = new monapt.Map<string, string>({
                    'key1': 'value1',
                    'key2': 'value2'
                });

                map.get('key1').get().should.be.equal('value1');
                map.get('key2').get().should.be.equal('value2');
            });

            it('can initialize with any argument', () => {
                var map = new monapt.Map<string, string>();
                (() => map.get('hoge').get()).should.throw('No such element.');   
            });
        });

        describe('when initialized three key/value pairs', () => {
 
            var map: Map<string, string>;
            beforeEach(() => {
                map = new monapt.Map('key1', 'value1',
                                     'key2', 'value2',
                                     'key3', 'value3');
            });

            describe('#get', () => {
                it('returns Some<V> if contains key', () => {
                    map.get('key1').should.be.instanceof(monapt.Some);
                    map.get('key1').get().should.equal('value1');
                });

                it('returns None if not contains key', () => {
                    map.get('any').should.equal(monapt.None);
                });
            });


            describe('#getOrElse', () => {
                it('returns value if contains key', () => {
                    map.getOrElse('key1', 'a').should.equal('value1');
                });

                it('retruns defaultValue if not contains key', () => {
                    map.getOrElse('any', 'none').should.equal('none');
                });
            });

            describe('#find', () => {
                it('returns Some<Tuple<K, V>> if matching', () => {
                    map.find((k, v) => k == 'key1').get()._2.should.equal('value1');
                });

                it('returns None if not matching', () => {
                  (() => map.find((k, v) => k == 'any').get()).should.throw('No such element.');
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

            describe('#map', () => {
                it('returns new Map containing result of applying func', () => {
                    var mapped = map.map((k: string, v: string) => monapt.Tuple2(v, k));
                    mapped.get('value1').get().should.equal('key1');
                    mapped.get('value2').get().should.equal('key2');
                    mapped.get('value3').get().should.equal('key3');
                });
            });

            describe('#flatMap', () => {
                it('returns new Map flat containing result of applying func', () => {
                    var flatMapped = map.flatMap((k: string, v: string) => new monapt.Map(v, k));
                    flatMapped.get('value1').get().should.equal('key1');
                    flatMapped.get('value2').get().should.equal('key2');
                    flatMapped.get('value3').get().should.equal('key3');                    
                });

                it('can flatten nested Map', () => {
                    var nested = new monapt.Map('1', new monapt.Map('k1', 'v1'),
                                                '2', new monapt.Map('k2', 'v2'));
                    var flatMapped = nested.flatMap((k: string, v: monapt.Map<string, string>) => {
                        return v.map((k, v) => monapt.Tuple2(v, k));    
                    });
                    flatMapped.get('v1').get().should.equal('k1');
                    flatMapped.get('v2').get().should.equal('k2');
                });
            });

            describe('#mapValues', () => {
                it('returns fetched values that result of applying function', () => {
                    var valueMapped = map.mapValues(v => v.length);
                    valueMapped.get('key1').get().should.equal(6);
                    valueMapped.get('key2').get().should.equal(6);
                    valueMapped.get('key3').get().should.equal(6);
                });
            });

            describe('#filter', () => {
                it('returns Map containing results of applying predicater', () => {
                    var filtered = map.filter((k, v) => k == 'key1');
                    filtered.get('key1').get().should.equal('value1');
                    (() => filtered.get('key2').get()).should.throw('No such element.');
                    (() => filtered.get('key3').get()).should.throw('No such element.');
                });
            });

            describe('#reject', () => {
                it('returns Map containing results of applying predicater', () => {
                    var filtered = map.reject((k, v) => k == 'key1');
                    (() => filtered.get('key1').get()).should.throw('No such element.');
                    filtered.get('key2').get().should.equal('value2');
                    filtered.get('key3').get().should.equal('value3');
                });
            });
        });
    });
}
