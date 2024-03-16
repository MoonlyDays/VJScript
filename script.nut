//--------------------------------------------------------------------------------
// This code is what gets embedded in the compiled Squirrel
// code, using VJScript. It provides implementation for
// JavaScript features and behaviour that is missing from
// VScript.
//--------------------------------------------------------------------------------
// P.S. Code here was written to be as small as possible so it may be a little
// hard to understand or maintain. However, all comments are ommited during
// compilation time, so feel free to understand the behaviour of the code
// using them.
//--------------------------------------------------------------------------------
// Copyright (C) Moonly Days 2024
//--------------------------------------------------------------------------------

__jsConsoleLog <-  function(obj, depth, stack) {
    local t = typeof obj;
    if(t != "instance" && t != "table" && t != "class" && t != "array")
    {
        print(obj);
        return;
    }

    if (stack.find(obj) != null) {
        print("*RECURSIVE*");
        return;
    }

    stack.push(obj);
    local i = 0;

    print("{\n");
    foreach(k, v in obj) {
        for(i = 0; i < depth + 1; i++) print("\t");

        print(k)
        print(" = ");
        __jsConsoleLog(v, depth + 1, stack);
        print("\n");
    }

    for(i = 0; i < depth; i++) print("\t");
    print("}");
}

console <- {
    log = function (...) {
        foreach(item in vargv) {
            __jsConsoleLog(item, 0, []);
            print(" ");
        }
        print("\n");
    }
}

class __jsInteropObject {
    __jsProps = null;
    __jsDescriptors = null;
    // __proto__ = null;
    // __ctor__ = null;

    constructor(o = null) {
        __jsProps = [], __jsDescriptors = {};
        if(o) foreach(k, v in o) this[k] = v;
    }

    function _nexti(i) {
        local a = __jsProps, d = __jsDescriptors;
        if(i == null) return a.len() > 0 ? a[0] : null;
        if ((i = a.find(i)) == null) return null;
        while(++i < a.len()) {
            local b = a[i], c = d[b];
            if(!c.enumerable) continue;
            return b;
        }
    }

    function _get(key) {
        local a = __jsDescriptors, b = ::getstackinfos, c, i = 2;
        if (key in a) return ("get" in a[key] && (c = a[key].get)) ? c.pcall(this) : a[key].value;
        if (c = __proto__) return c[key];
        while (c = b(i++)) {
            if (!("this" in (c = c.locals))) continue;
            if ((key in (c = c["this"]))) return c[key];
        }
        return null;
    }

    function _set(key, val) {
        local a = __jsDescriptors, b = __jsProps, c, d;
        if(key in a) {
            if ((c = a[key]) && "set" in c && (d = c.set)) d.pcall(this, val);
            else c.value = val;
            return;
        }

        b.push(key);
        a[key] <- {
            configurable = true,
            enumerable = true,
            writable = true,
            value = val,
            get = null,
            set = null
        }
    }
}

class __jsInteropFunction extends __jsInteropObject {
    __func__ = null;

    constructor(_fn = null) {
        base.constructor();

        __func__ = _fn || function () {};
        __proto__ = null;

        local infos = __func__.getinfos();
        name = infos.name;
        length = ("paramscheck" in infos) ? infos.paramscheck : infos.parameters.len();
        prototype = __jsInteropObject({
            __proto__ = null,
            __ctor__ = this
        });
    }

    function _call(...) {
        local thisArg = vargv[0];
        vargv.remove(0);
        return __call(__func__, thisArg, vargv);
    }
}

class __jsInteropPrimitive extends __jsInteropObject {
    __primitive__ = null;

    constructor(value) {
        base.constructor();
        __primitive__ = value;
    }
}


///////////////////////////////////////////////////////////////////////////
//////////////|             HELPER FUNCTIONS                |//////////////
///////////////////////////////////////////////////////////////////////////

//-----------------------------------------------------------------------//
// Purpose: Wraps Squirrel literals into JavaScript Interop objects.
//-----------------------------------------------------------------------//
__ <- function(val, ...) {
    local a = typeof val, i = 0;
    // Squirrel Table
    if (a == "table") {
        return __jsInteropObject(val);
    }

    // Squirrel Number
    if(a == "float" || a == "integer") {
        a = __jsInteropPrimitive(val);
        a.__proto__ = Number.prototype;
        return a;
    }

    // Squirrel Function
    if (a == "function") {
        a = __jsInteropFunction(val);
        a.__proto__ = Function;
        a.prototype.__proto__ = Object.prototype;
        if (vargv.len() > 0) a.name = vargv[0];
        if (vargv.len() > 1) a.prototype.__proto__ = vargv[1].prototype;
        return a;
    }

    return val;
}

//-----------------------------------------------------------------------//
// Purpose: Handle calling the function the JavaScript way.
//-----------------------------------------------------------------------//
__call <- function (fn, thisArg, args) {
    local a = fn.getinfos();
    local b = a.native ? a.paramscheck : a.parameters.len() - (c = a.varargs) * 2;
    args.insert(0, thisArg);
    while (args.len() < b) args.push(null);
    if (c == 0)  while (args.len() > b) args.pop();
    return fn.acall(args);
}

//-----------------------------------------------------------------------//
// Purpose: Handle the 'new' operator.
//-----------------------------------------------------------------------//
__new <- function (fn, ...) {
    local _new = __jsInteropObject({
        __proto__ = fn.prototype
    });
    fn.apply(_new, vargv);
    return _new;
}

//-----------------------------------------------------------------------//
// Purpose: Handle the 'in' operator.
//-----------------------------------------------------------------------//
__in <- function(prop, obj) {
    return prop in obj || prop in obj.__jsDescriptors;
}

//-----------------------------------------------------------------------//
// Purpose: Handle the 'typeof' operator.
//-----------------------------------------------------------------------//
__typeof <- function (obj) {
    return "object";
}


///////////////////////////////////////////////////////////////////////////
//////////////|             CORE JS CONSTRUCTORS            |//////////////
///////////////////////////////////////////////////////////////////////////


Object <- __jsInteropFunction();
Object.name = "Object";
Function <- __jsInteropFunction();
Function.name = "Function";
Object.__proto__ = Function;
Function.__proto__ = Function.prototype;
Function.prototype.__proto__ = Object.prototype;

__UNIMPLEMENTED_FUNCTION <- __(function () {
    throw "This feature is unimplemented. If you really need it for your project, feel free to help us implement it at 'https://github.com/MoonlyDays/VJScript'";
})

Number <- __(function () {}, "Number");
String <- __(function () {}, "String");

///////////////////////////////////////////////////////////////////////////
//////////////|             Object Constructor              |//////////////
///////////////////////////////////////////////////////////////////////////


Object.prototype.hasOwnProperty = null;
Object.prototype.isPrototypeOf = null;
Object.prototype.propertyIsEnumerable = null;
Object.prototype.toLocaleString = null;
Object.prototype.toString = __(function () {
    return "[object Object]";
}, "toString");
Object.prototype.valueOf = null;

// Object Static
Object.assign = __(function(target, ...) {
    foreach (source in vargv) {
        foreach(k, v in source) {
            target[k] = v;
        }
    }
});
Object.create = null;
Object.defineProperties = null;
Object.defineProperty = __(function (obj, prop, desc) {

    local descs = obj.__jsDescriptors, props = obj.__jsProps;
    local redefine = prop in descs;
    local accessor = "get" in desc || "set" in desc;
    local data = "writable" in desc || "value" in desc;
    local setDesc = prop in descs ? descs[prop] : {
        enumerable = false,
        configurable = false
    };

    // If we are redefining the descriptor, and we are set
    // to be not configurable.
    if(redefine && !setDesc.configurable) {
        foreach(declKey, declValue in desc) {
            // if the property we're trying to declare was declared already
            // check if we are not changing its value.
            if (!(declKey in prevDesc) || prevDesc[declKey] != declValue)
                throw "Cannot redefine property: " + prop;
        }
    }

    // If we have provided both accessor properties and data properties,
    // this is considered an error.
    if (accessor && data) throw "Invalid property descriptor. Cannot both specify accessors and a value or writable attribute";

    // If we have not provided either, assume we're defining a value property.
    if(!accessor && !data) desc.writable <- false, desc.value <- null;
    if("enumerable" in desc) setDesc.enumerable <- !!desc.enumerable;
    if("configurable" in desc) setDesc.configurable <- !!desc.configurable;
    if("writable" in desc) setDesc.writable <- !!desc.writable;
    if("value" in desc) setDesc.value <- desc.value;
    if("get" in desc) setDesc.get <- desc.get;
    if("set" in desc) setDesc.set <- desc.set;

    // Add property name to the iteration list.
    if (props.find(prop) == null) props.push(prop);
    descs[prop] <- setDesc;
    return obj;
}, "defineProperty");

Object.entries = null;
Object.freeze = null;
Object.fromEntries = null;
Object.getOwnPropertyDescriptor = __(function(obj, prop) {
    local c = obj.__jsDescriptors;
    return prop in c ? __(c[prop]) : null;
}, "getOwnPropertyDescriptor");
Object.getOwnPropertyDescriptors = null;
Object.getOwnPropertyNames = null;
Object.getOwnPropertySymbols = null;
Object.getPrototypeOf = null;
Object.groupBy = null;
Object.hasOwn = null;
Object.is = null;
Object.isExtensible = null;
Object.isFrozen = null;
Object.isSealed = null;
Object.keys = null;
Object.preventExtensions = null;
Object.seal = null;
Object.setPrototypeOf = null;
Object.values = null;

///////////////////////////////////////////////////////////////////////////
//////////////|             Function Constructor            |//////////////
///////////////////////////////////////////////////////////////////////////

//-----------------------------------------------------------------------//
// Purpose: Invokes the internal Squirrel closure.
//-----------------------------------------------------------------------//
Function.prototype.apply = __(function(thisArg, args) {
    __call(__func__, thisArg, args);
});
//-----------------------------------------------------------------------//
// Purpose: Invokes the internal Squirrel closure.
//-----------------------------------------------------------------------//
Function.prototype.call = function(thisArg, ...) {
    return apply(thisArg, vargv);
};
//-----------------------------------------------------------------------//
// Purpose: Invokes the internal Squirrel closure.
//-----------------------------------------------------------------------//
Function.prototype.bind = null;


///////////////////////////////////////////////////////////////////////////
//////////////|             Number Constructor              |//////////////
///////////////////////////////////////////////////////////////////////////
Number.EPSILON = __(2.220446049250313e-16);
Number.MAX_SAFE_INTEGER = __(9007199254740991);
Number.MAX_VALUE = __(1.7976931348623157e+308);

Infinity <- __(1 / 0.0);
NaN <- __(0 / 0.0);

///////////////////////////////////////////////////////////////////////////
//////////////|                 MATH OBJECT                 |//////////////
///////////////////////////////////////////////////////////////////////////

Math <- __({
    E = __(2.718281828459045),
    LN2 = __(0.6931471805599453),
    LN10 = __(2.302585092994046),
    LOG2E = __(1.4426950408889634),
    LOG10E = __(0.4342944819032518),
    PI = __(3.141592653589793),
    SQRT1_2 = __(0.7071067811865476),
    SQRT2 = __(1.4142135623730951)
    abs = __(fabs),
    acos = __(acos),
    acosh = __(function (x) {
        return log(x + sqrt(x * x - 1));
    }, "acosh"),
    asin = __(asin),
    asinh = __(function (x) {
        return log(x + sqrt(x * x + 1));
    }, "asinh"),
    atan = __(atan),
    atan2 = __(atan2),
    atanh = __(function (x) {
        return 0.5 * log((1 + x) / (1 - x));
    }, "atanh"),
    cbrt = __(function (x) {
        return pow(x, 1.0 / 3);
    }, "cbrt"),
    ceil = __(ceil),
    clz32 = __(function (x)
    {   if (x == 0) return 32;
        local a = 0x80000000, b = 0;
        while ((x & a) == 0) {
            b = b + 1;
            a = a >> 1;
        }
        return b;
    }, "clz32"),
    cos = __(cos),
    cosh = __(function (x) {
        return (exp(x) + exp(-x)) / 2.0;
    }),
    exp = __(exp),
    expm1 = __(function (x) {
        return exp(x) - 1.0;
    }, "expm1"),
    floor = __(floor),
    fround = __UNIMPLEMENTED_FUNCTION,
    hypot = __(function (...) {
        local sum = 0.0;
        foreach (arg in vargv) sum += arg * arg;
        return sqrt(sum);
    }),
    imul = __UNIMPLEMENTED_FUNCTION,
    log = __(log),
    log1p = __UNIMPLEMENTED_FUNCTION,
    log2 = __UNIMPLEMENTED_FUNCTION,
    log10 = __(log10),
    max = __(function(...) {
        local a = -inf; // TODO: -Infinity
        foreach (b in vargv) if (b > a) a = b;
        return a;
    }, "max"),
    min = __(function(...) {
        local a = inf; // TODO: Infinity
        foreach (b in vargv) if (b < a) a = b;
        return a;
    }, "min"),
    pow = __(pow),
    random = __(function() {
    	return ::rand().tofloat() / ::RAND_MAX;
    }, "random"),
    round = __(function (x) {
        local a = x - floor(x);
        return a < 0.5 ? floor(x) : ceil(x);
    }, "round"),
    sign = __(function (x) {
        if (x == 0) return 0;
        return x > 0 ? 1 : -1;
    }, "sign"),
    sin = __(sin),
    sinh = __(function (x) {
        return (exp(x) - exp(-x)) / 2.0;
    }, "sinh"),
    sqrt = __(sqrt),
    tan = __(tan),
    trunc = __(function (x) {
        return x >= 0 ? floor(x) : ceil(x);
    }, "trunc")
});

///////////////////////////////////////////////////////////////////////////
//////////////|                 MATH OBJECT                 |//////////////
///////////////////////////////////////////////////////////////////////////

console.log(Math.PI.toString());