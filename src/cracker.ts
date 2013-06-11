module Katana {

    export interface ICrackerProducer<F> {
        (f: F): void;
    }
    export class Cracker<F extends Function> {
        private fired = false;
        private callbacks: Array<F> = new Array<F>();
        private producer: ICrackerProducer<F>;

        fire(producer: ICrackerProducer<F>) {
            this.producer = producer;
            if (this.fired) { throw new Error('Does fired.') } else { this.fireAll() }
        }

        private fireAll() {
            this.fired = true;
            this.callbacks.forEach(fn => this.producer(fn));
        }

        add(fn :F) {
            if (this.fired) { this.producer(fn) } else { this.callbacks.push(fn) }
        }
    }
}
