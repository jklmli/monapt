module monapt {

    export interface Tuple1<A> {
        _1: A;
    }

    export var Tuple1 = <A>(a: A): Tuple1<A> => {
        return {
            _1: a
        }
    }

    export interface Tuple2<A, B> {
        _1: A;
        _2: B;
    } 

    export var Tuple2 = <A, B>(a: A, b: B): Tuple2<A, B> => {
        return {
            _1: a,
            _2: b
        }
    }
}