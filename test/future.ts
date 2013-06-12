/// <reference path="../src/future.ts" />
/// <reference path="../d.ts/mocha.d.ts" />
/// <reference path="../d.ts/chai.d.ts" />

module Katana.Spec {

    chai.should();

    describe('Future', () => {
        it('should callback onComplete with Success if success', (ok) => {
            new Katana.Future<number>((success, failure) => {
                success(1);
            }).onComplete(r => {
                r.should.instanceof(Katana.Success);
                ok();
            });
        });

        it('should callback onComplete with Success if success on other context', (ok) => {
            new Katana.Future<number>((success, failure) => {
                setTimeout(() => success(1), 100);
            }).onComplete(r => {
                r.should.instanceof(Katana.Success);
                ok();
            });
        });

        it('should callback onComplete with Failure if failure', (ok) => {
            new Katana.Future<number>((success, failure) => {
                failure(new Error());
            }).onComplete(r => {
                r.should.instanceof(Katana.Failure);
                ok();
            });
        });

        it('should callback onComplete with Failure if failure on other context', (ok) => {
            new Katana.Future<number>((success, failure) => {
                setTimeout(() => failure(new Error()), 100);
            }).onComplete(r => {
                r.should.instanceof(Katana.Failure);
                ok();
            });
        });

        describe('When succeed', () => {
            var future: Katana.Future<string>;
            before(() => {
                future = new Katana.Future<string>((success, failure) => {
                    success('value');
                });
            });

            describe('#onSuccess', () => {
                it('should callback with value', (ok) => {
                    var value: string;
                    future.onSuccess(v => {
                        v.should.equal('value');
                        ok();
                    });
                });
            });

            describe('#onFailure', () => {
                it('should not callback', () => {
                    var called = false;
                    future.onFailure(e => called = true);
                    called.should.be.false;
                });
            });

            describe('#map', () => {
                it('returns mixed Future that create by func', (ok) => {
                    future.map<number>((v, success, failure) => {
                        success(100);
                    }).onSuccess((v: number) => {
                        v.should.equal(100);
                        ok();    
                    });
                });

                it('returns failed Future if func apply failure', (ok) => {
                    future.map<number>((v, success, failure) => {
                        failure(new Error('Some error.'));
                    }).onFailure(e => {
                        e.message.should.equal('Some error.');
                        ok();
                    });                    
                });
            });

            describe('#flatMap', () => {
                it('eturns mixed Future that create by func', (ok) => {
                    var a = future.flatMap(v => new Katana.Future<number>((success, failure) => success(100)))
                    .onSuccess(v => {
                        v.should.equal(100);
                        ok();
                    });
                });

                it('returns failed Future if new future fails', (ok) => {
                    var a = future.flatMap(v => new Katana.Future<number>((success, failure) => {
                        failure(new Error('Some error.'));
                    })).onFailure(e => {
                        e.message.should.equal('Some error.');
                        ok();
                    });              
                });

            });


            describe('#filter', () => {
                it('promises success and pass to next if matcher function returns true', (ok) => {
                    future.filter(v => true).onSuccess(v => {
                        v.should.equal('value');
                        ok();    
                    });
                });

                it('promises failure if matcher function retuns false', (ok) => {
                    future.filter(v => false).onFailure(e => {
                        e.message.should.equal('No such element.');
                        ok();
                    });
                });
            });

            describe('#reject', () => {
                it('promises failure if matcher function returns true', (ok) => {
                    future.reject(v => true).onFailure(e => {
                        e.message.should.equal('No such element.');
                        ok();
                    });
                });

                it('promises success and pass to next if matcher function retuns false', (ok) => {
                    future.reject(v => false).onSuccess(v => {
                        v.should.equal('value');
                        ok();    
                    });
                });
            });
        });

        describe('When failed', () => {
            var future: Katana.Future<string>;
            before(() => {
                future = new Katana.Future<string>((success, failure) => {
                    failure(new Error('Some error.'));
                });
            });

            describe('#onSuccess', () => {
                it('should not callback', () => {
                    var called = false;
                    future.onSuccess(v => called = true);
                    called.should.be.false;
                });
            });

            describe('#onFailure', () => {
                it('should callback with Error', (ok) => {
                    var error: Error;
                    future.onFailure(e => { 
                        e.message.should.equal('Some error.');
                        ok();
                    });
                });
            });

            describe('#map', () => {
                it('never do anything', (ok) => {
                    future.map<number>((v, success, failure) => {
                        success(100);
                    }).onFailure(e => {
                        e.message.should.equal('Some error.');
                        ok();    
                    });
                });
            });

            describe('#flatMap', () => {
                it('never do anything', (ok) => {
                    future.flatMap(v => new Katana.Future<number>((success, failure) => success(100))).onFailure(e => {
                        e.message.should.equal('Some error.');   
                        ok();
                    });
                });
            });

            describe('#filter', () => {
                it('never do anything', (ok) => {
                    future.filter(v => true).onFailure(e => {
                        e.message.should.equal('Some error.');
                        ok()
                    });
                });
            });

            describe('#reject', () => {
                it('never do anything', (ok) => {
                    future.reject(v => false).onFailure(e => {
                        e.message.should.equal('Some error.');
                        ok()
                    });
                });
            });
        });
    });

    describe('Promise', () => {
        it('can complete the future by success', (ok) => {
            var p = new Katana.Promise<string>();
            var f = p.future();
            f.onSuccess(v => {
                v.should.equal('value');
                ok();
            });
            p.success('value');
        });

        it('can complete the future by failure', (ok) => {
            var p = new Katana.Promise<string>();
            var f = p.future();
            f.onFailure(e => {
                e.message.should.equal('Some error.');
                ok();
            });
            p.failure(new Error('Some error.'));
        });
    });
}