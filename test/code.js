import * as AAA from "./sum";

const obj = {a: 1, b: 2, c: 2};
const {a, b, c} = obj;

console.log(AAA.sum(a, b));