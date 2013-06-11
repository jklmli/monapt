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
    });

    describe('Promise', () => {
    
    });

}