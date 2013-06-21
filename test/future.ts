/// <reference path="../src/future.ts" />
/// <reference path="../d.ts/mocha.d.ts" />
/// <reference path="../d.ts/chai.d.ts" />

module katana.Spec {

    chai.should();

    describe('Future', () => {
        it('should callback onComplete with Success if success', (ok) => {
            new katana.Future<number>(promise => {
                promise.success(1);
            }).onComplete(r => {
                r.should.instanceof(katana.Success);
                ok();
            });
        });

        it('should callback onComplete with Success if success on other context', (ok) => {
            new katana.Future<number>(promise => {
                setTimeout(() => promise.success(1), 100);
            }).onComplete(r => {
                r.should.instanceof(katana.Success);
                ok();
            });
        });

        it('should callback onComplete with Failure if failure', (ok) => {
            new katana.Future<number>(promise => {
                promise.failure(new Error());
            }).onComplete(r => {
                r.should.instanceof(katana.Failure);
                ok();
            });
        });

        it('should callback onComplete with Failure if failure on other context', (ok) => {
            new katana.Future<number>(promise => {
                setTimeout(() => promise.failure(new Error()), 100);
            }).onComplete(r => {
                r.should.instanceof(katana.Failure);
                ok();
            });
        });

        describe('When succeed', () => {
            var future: katana.Future<string>;
            before(() => {
                future = new katana.Future<string>(promise => {
                    promise.success('value');
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
                    future.map<number>((v, promise) => {
                        promise.success(100);
                    }).onSuccess((v: number) => {
                        v.should.equal(100);
                        ok();    
                    });
                });

                it('returns failed Future if func apply failure', (ok) => {
                    future.map<number>((v, promise) => {
                        promise.failure(new Error('Some error.'));
                    }).onFailure(e => {
                        e.message.should.equal('Some error.');
                        ok();
                    });                    
                });
            });

            describe('#flatMap', () => {
                it('eturns mixed Future that create by func', (ok) => {
                    var a = future.flatMap(v => new katana.Future<number>(promise => promise.success(100)))
                    .onSuccess(v => {
                        v.should.equal(100);
                        ok();
                    });
                });

                it('returns failed Future if new future fails', (ok) => {
                    var a = future.flatMap(v => new katana.Future<number>(promise => {
                        promise.failure(new Error('Some error.'));
                    })).onFailure(e => {
                        e.message.should.equal('Some error.');
                        ok();
                    });              
                });

            });


            describe('#filter', () => {
                it('promises success and pass to next if predicator returns true', (ok) => {
                    future.filter(v => true).onSuccess(v => {
                        v.should.equal('value');
                        ok();    
                    });
                });

                it('promises failure if predicator returns false', (ok) => {
                    future.filter(v => false).onFailure(e => {
                        e.message.should.equal('No such element.');
                        ok();
                    });
                });
            });

            describe('#reject', () => {
                it('promises failure if predicater returns true', (ok) => {
                    future.reject(v => true).onFailure(e => {
                        e.message.should.equal('No such element.');
                        ok();
                    });
                });

                it('promises success and pass to next if predicater retuns false', (ok) => {
                    future.reject(v => false).onSuccess(v => {
                        v.should.equal('value');
                        ok();    
                    });
                });
            });
        });

        describe('When failed', () => {
            var future: katana.Future<string>;
            before(() => {
                future = new katana.Future<string>(promise => {
                    promise.failure(new Error('Some error.'));
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
                    future.map<number>((v, promise) => {
                        promise.success(100);
                    }).onFailure(e => {
                        e.message.should.equal('Some error.');
                        ok();    
                    });
                });
            });

            describe('#flatMap', () => {
                it('never do anything', (ok) => {
                    future.flatMap(v => new katana.Future<number>(promise => promise.success(100))).onFailure(e => {
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
            var p = new katana.Promise<string>();
            var f = p.future();
            f.onSuccess(v => {
                v.should.equal('value');
                ok();
            });
            p.success('value');
        });

        it('can complete the future by failure', (ok) => {
            var p = new katana.Promise<string>();
            var f = p.future();
            f.onFailure(e => {
                e.message.should.equal('Some error.');
                ok();
            });
            p.failure(new Error('Some error.'));
        });
    });
}