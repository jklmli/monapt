module Katana {

    export interface Try<L extends Error, R> extends Either<L, R> {
        
    }
}