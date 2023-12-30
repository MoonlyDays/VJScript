/*
 * Copyright (C) Moonly Days
 * https://github.com/MoonlyDays
 */

const __js_Array = {};

const array = [4, 3, 2, 1];
array[1] = 99;

// Testing iteration and item extraction
for (const [k, v] of array)
    console.log(k, v);

// Testing length
console.log(array.length);
// Testing NRE
console.log(array[4]);