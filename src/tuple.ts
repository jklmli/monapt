module Katana {

    export var Tuple1 = <A>(a: A): {_1: A} => {
        return {
            _1: a
        }
    }

    export var Tuple2 = <A, B>(a: A, b: B): {_1: A; _2: B} => {
        return {
            _1: a,
            _2: b
        }
    }
}