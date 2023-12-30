/*
 * Copyright (C) Moonly Days
 * https://github.com/MoonlyDays
 */

class JSArrayPolyfill {
    constructor(arr) {
        this.arr = arr;
    }

    _get(k) {
        return k === "length"
            ? this.arr.len() :
            this.arr[k];
    }

    _set(k, v) {
        this.arr[k] = v;
    }

    _newslot(k, v) {
        this.arr[k] = v;
    }

    _nexti(k) {
        k ??= -1;
        k++;
        return k < this.length ? k : null;
    }

    concat(other) {
    }
}