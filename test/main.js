import {foo} from "./other";

class Test {
    a = 2;
    b = 2;

    constructor()
    {
    }

    prikol() {
        return foo(this.a, this.b);
    }
}
console.log ('11' == 11);
console.log ('11' === 11);