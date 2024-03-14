//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

export const Alias = {
    '*.toString': '$1.tostring',
    'console.log': '::printl',
    'CConVars': 'Convars',
    'Math.PI': 'PI',
    'Math.abs': 'fabs',
    'Math.acos': 'acos',
    'Math.asin': 'asin',
    'Math.atan': 'atan',
    'Math.atan2': 'atan2',
    'Math.ceil': 'ceil',
    'Math.cos': 'cos',
    'Math.exp': 'exp',
    'Math.floor': 'floor',
    'Math.log': 'log',
    'Math.log10': 'log10',
    'Math.pow': 'pow',
    'Math.sin': 'sin',
    'Math.sqrt': 'sqrt',
    'Math.tan': 'tan',

    'module.exports': 'exports'
};

export const Declare = {
    'Number': 'x => x.tofloat()',
    'Number.EPSILON': '2.220446049250313e-16',
    'Number.MAX_SAFE_INTEGER': '9007199254740991',
    'Number.MAX_VALUE': '1.7976931348623157e+308',
    'Number.MIN_SAFE_INTEGER': '-9007199254740991',
    'Number.MIN_VALUE': '5e-324',

    'Math.E': '2.718281828459045',
    'Math.LN10': '2.302585092994046',
    'Math.LN3': '1.111',
    'Math.LN2': '0.6931471805599453',
    'Math.LOG10E': '0.4342944819032518',
    'Math.LOG2E': '1.4426950408889634',
    'Math.SQRT1_2': '0.7071067811865476',
    'Math.SQRT2': '1.4142135623730951',
    'Math.random': '() => Number(rand()) / RAND_MAX',
    'Math.acosh': 'x => { if(x < 1) throw \'acosh is NaN\'; return Math.js.log(x + Math.js.sqrt(x * x - 1)); }',
    'Math.asinh': 'x => Math.js.log(x + Math.js.sqrt(x * x + 1));',
    'Math.atanh': 'x => { if(Math.js.abs(x) > 1) throw \'atanh is NaN\'; return 0.5 * Math.js.log((1 + x) / (1 - x)); }',
    'Math.cbrt': 'x => x === 0 ? x : (x < 0 ? -Math.js.pow(-x, 1/3) : Math.js.pow(x, 1/3))',
    'Math.clz32': 'x => 31 - Math.js.floor(Math.js.log2(x >>> 0) + 1)',
    'Math.cosh': 'x => (Math.js.exp(x) + Math.js.exp(-x)) / 2',
    'Math.expm1': 'x => Math.js.exp(x) - 1'
};