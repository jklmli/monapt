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
        });
    });

    describe('Promise', () => {
    
    });

}