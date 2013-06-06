/// <reference path="../src/try.ts" />
/// <reference path="../d.ts/mocha.d.ts" />
/// <reference path="../d.ts/chai.d.ts" />

module Katana.Spec {

    describe('Try', () => {
        chai.should();
    
        describe('TryOn', () => {

            it('returns Success instacne if not throws error on f', () => {
                var trier = Katana.TryOn(() => {
                    return 1;
                });
                trier.should.instanceof(Katana.Success);
            });

            it('returns Failure instacne if not throws error on f', () => {
                var trier = Katana.TryOn(() => {
                    (() => {
                        throw new Error('Some Execption.');
                    })();
                    return 1;
                });
                trier.should.instanceof(Katana.Failure);
            });
        });
    });

}