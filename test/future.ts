/// <reference path="../src/future.ts" />
/// <reference path="../d.ts/mocha.d.ts" />
/// <reference path="../d.ts/chai.d.ts" />

module monapt.Spec {

    chai.should();

    describe('Future', () => {
        it('should callback onComplete with Success if success', (ok) => {
            new monapt.Future<number>(promise => {
                promise.success(1);
            }).onComplete(r => {
                r.should.instanceof(monapt.Success);
                ok();
            });
        });

        it('should callback onComplete with Success if success on other context', (ok) => {
            new monapt.Future<number>(promise => {
                setTimeout(() => promise.success(1), 100);
            }).onComplete(r => {
                r.should.instanceof(monapt.Success);
                ok();
            });
        });

        it('should callback onComplete with Failure if failure', (ok) => {
            new monapt.Future<number>(promise => {
                promise.failure(new Error());
            }).onComplete(r => {
                r.should.instanceof(monapt.Failure);
                ok();
            });
        });

        it('should callback onComplete with Failure if failure on other context', (ok) => {
            new monapt.Future<number>(promise => {
                setTimeout(() => promise.failure(new Error()), 100);
            }).onComplete(r => {
                r.should.instanceof(monapt.Failure);
                ok();
            });
        });

        describe('::succeed', () => {
            it('create succeed Futrue', (ok) => {
                var succeed = Future.succeed('value');
                succeed.onSuccess(value => {
                    value.should.equal('value');
                    ok();
                });
            });
        });

       describe('::failed', () => {
            it('create failed Futrue', (ok) => {
                var failed = Future.failed<string>(new Error('error'));
                failed.onFailure(e => {
                    e.message.should.equal('error');
                    ok();
                });
            });
        });

        describe('When succeed', () => {
            var future: monapt.Future<string>;
            before(() => {
                future = monapt.future<string>(promise => {
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
                it('returns mixed Future that create by func', (ok) => {
                    var a = future.flatMap(v => new monapt.Future<number>(promise => promise.success(100)))
                    .onSuccess(v => {
                        v.should.equal(100);
                        ok();
                    });
                });

                it('returns failed Future if new future fails', (ok) => {
                    var a = future.flatMap(v => new monapt.Future<number>(promise => {
                        promise.failure(new Error('Some error.'));
                    })).onFailure(e => {
                        e.message.should.equal('Some error.');
                        ok();
                    });              
                });

                it('can mix completed two futures', (ok) => {
                    var left = monapt.future<number>(promise => {
                        promise.success(100);    
                    });
                    setTimeout(() => {
                        var mixed = future.flatMap<string>(v => {
                            return left.map<string>((lv, promise) => {
                                promise.success(v + ' ' + lv);
                            });
                        });
                        mixed.onSuccess(v => {
                            v.should.equal('value 100');
                            ok();    
                        });
                    }, 50);
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
                        e.should.be.instanceof(monapt.NoSuchElementError);
                        ok();
                    });
                });
            });

            describe('#reject', () => {
                it('promises failure if predicater returns true', (ok) => {
                    future.reject(v => true).onFailure(e => {
                        e.message.should.equal('No such element.');
                        e.should.be.instanceof(monapt.NoSuchElementError);
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

            describe('#recover', () => {
                it('returns copied self', (ok) => {
                    future.recover((error, promise) => promise.success('recovered')).onSuccess(v => {
                        v.should.equal('value');
                        ok();
                    });;
                });
            });

            describe('#recoverWith', () => {
                it('returns copied self', (ok) => {
                    future.recoverWith(error => new Future(p => p.success('recovered'))).onSuccess(v => {
                        v.should.equal('value');
                        ok();
                    });;
                });
            });
        });

        describe('When failed', () => {
            var future: monapt.Future<string>;
            before(() => {
                future = new monapt.Future<string>(promise => {
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
                    future.flatMap(v => new monapt.Future<number>(promise => promise.success(100))).onFailure(e => {
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

            describe('#recover', () => {
                it('returns Success thats result of applying func', (ok) => {
                    future.recover((error, promise) => promise.success('recovered')).onSuccess(v => {
                        v.should.equal('recovered');
                        ok();
                    });
                });
            });

            describe('#recoverWith', () => {
                it('returns the result of applying func', (ok) => {
                    future.recoverWith(error => new Future(p => p.success('recovered'))).onSuccess(v => {
                        v.should.equal('recovered');
                        ok();
                    });
                });
            });
        });


        describe('New syntax', () => {
            it('should callback onComplete with Success if success', (ok) => {
                new monapt.Future<number>(ret => ret(1)).onComplete(r => {
                    r.should.instanceof(monapt.Success);
                    ok();
                });
            });

            it('should callback onComplete with Success if success on other context', (ok) => {
                new monapt.Future<number>(ret => {
                    setTimeout(() => ret(1), 100);
                }).onComplete(r => {
                    r.should.instanceof(monapt.Success);
                    ok();
                });
            });

            it('should callback onComplete with Failure if failure', (ok) => {
                new monapt.Future<number>(ret => ret(new Error())).onComplete(r => {
                    r.should.instanceof(monapt.Failure);
                    ok();
                });
            });

            it('should callback onComplete with Failure if failure on other context', (ok) => {
                new monapt.Future<number>(ret => {
                    setTimeout(() => ret(new Error()), 100);
                }).onComplete(r => {
                    r.should.instanceof(monapt.Failure);
                    ok();
                });
            });
        });
    });

    describe('Promise', () => {
        it('can complete the future by success', (ok) => {
            var p = new monapt.Promise<string>();
            var f = p.future();
            f.onSuccess(v => {
                v.should.equal('value');
                ok();
            });
            p.success('value');
        });

        it('can complete the future by failure', (ok) => {
            var p = new monapt.Promise<string>();
            var f = p.future();
            f.onFailure(e => {
                e.message.should.equal('Some error.');
                ok();
            });
            p.failure(new Error('Some error.'));
        });
    });

}
