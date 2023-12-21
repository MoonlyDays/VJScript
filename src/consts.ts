/**
 * All identifier or member accessors that should be
 * renamed to their Squirrel counterparts.
 */
export const SymbolRenameMap: {
    [key: string]: {
        [key: string]: string | string[]
    } | string | string[]
} = {
    // Debugging and printing utilities
    console: {
        "log": "printf"
    },
    // Math related functions, replace
    // them with Squirrel counterpart.
    Math: {
        // Commented out one don't exist in Squirrel
        // TODO: When added support for preprocessing, inject these definition in the code if needed.

        // E: "MATH_E",
        // LN10: "MATH_LN10",
        // LN2: "MATH_LN2",
        // LOG10E: "MATH_LOG10E",
        // LOG2E: "MATH_LOG2E",
        PI: "PI",
        // SQRT1_2: "MATH_SQRT1_2",
        // SQRT2: "MATH_SQRT2",

        abs: "fabs",
        acos: "acos",
        // acosh: "acosh",
        asin: "asin",
        // asinh: "asinh",
        atan: "atan",
        atan2: "atan2",
        // atanh: "atanh",
        // cbrt: "cbrt",
        ceil: "ceil",
        // clz32: "clz32",
        cos: "cos",
        // cosh: "cosh",
        exp: "exp",
        // expm1: "expm1",
        floor: "floor",
        // fround: "fround",
        // hypot: "hypot",
        // imul: "imul",
        log: "log",
        log10: "log10",
        // log1p: "log1p",
        // log2: "log2",
        // max: "max",
        // "min": "min"
        pow: "pow",
        // random: "random",
        // "round": "round",
        // sign: "sign",
        sin: "sin",
        // sinh: "sinh",
        sqrt: "sqrt",
        tan: "tan",
        // tanh: "tanh",
        // trunc: "trunc"

    },
    // Asterisk is a wildcard that can take form
    // of any object.
    "*": {
        toString: [null, "tostring"]
    }
};