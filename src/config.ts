//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------
// This list is Configure parity between JavaScript and Squirrel. These rules are
// resolved during compile time and should not be changed.
//--------------------------------------------------------------------------------------------------

export default {
    Attributes: {
        'printl': {
            Attributes: {
                ConcatParameters: []
            }
        },
        'AddThinkToEnt': {
            Parameters: {
                1: {
                    Attributes: {
                        EntityThinkCallback: []
                    }
                }
            }
        }
    },
    Alias: {
        '*.toString': '$1.tostring',
        'console.log': 'printl',
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
        'Math.tan': 'tan'
    },
    Declare: {
        'getEntThinkSlot': 'ent => (ent.ValidateScriptScope(), "__js_EntThink_" + ent.GetScriptScope().__vname)',
        'resolveEntThink': `(ent, fn) => { 
            const name = getEntThinkSlot(ent); 
            fn = fn.bindenv(this); 
            getroottable()[name] = fn.getinfos().parameters.len() > 1
                ? (() => fn(self))
                : (() => fn());
            return name; 
        }`,
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
        'Math.acosh': 'x => { if(x < 1) throw \'acosh is NaN\'; return Math.log(x + Math.sqrt(x * x - 1)); }',
        'Math.asinh': 'x => Math.log(x + Math.sqrt(x * x + 1));',
        'Math.atanh': 'x => { if(Math.abs(x) > 1) throw \'atanh is NaN\'; return 0.5 * Math.log((1 + x) / (1 - x)); }',
        'Math.cbrt': 'x => x === 0 ? x : (x < 0 ? -Math.pow(-x, 1/3) : Math.pow(x, 1/3))',
        'Math.clz32': 'x => 31 - Math.floor(Math.log2(x >>> 0) + 1)',
        'Math.cosh': 'x => (Math.exp(x) + Math.exp(-x)) / 2',
        'Math.expm1': 'x => Math.exp(x) - 1'
    },
    Blacklist: [
        'Math.fround'
    ]
};
