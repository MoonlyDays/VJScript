/*
 * Copyright (C) Moonly Days
 * https://github.com/MoonlyDays
 */

/**
 * Wrapper class for Squirrel array that adds JavaScript
 * logic to Squirrel.
 */
class Array extends Object {

    constructor(arr) {
        super(arr);
        this.arr = arr;
        this.length = 0;
    }

    _get(k) {
        return this.arr[k];
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

    _tostring() {
        return this.join();
    }

    push(...items) {
        for (const item of items) {
            this.arr.push(item);
            this.length++;
        }
    }

    at(k) {
        return this.arr[k];
    }

    concat(other) {
        const ret = [];
        for (const i of this.arr) ret.push(i);
        for (const i of other.arr) ret.push(i);
        return ret;
    }

    join(separator = ',') {
        let str = "";
        for (let i = 0; i < this.length; i++) {
            if (i > 0) str += separator;
            str += this.at(i);
        }
        return str;
    }
}