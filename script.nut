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
    __proto__ = null;
    __ctor__ = null;

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

        local obj = this;
        while(obj) {
            local descs = obj.__jsDescriptors;
            if(key in descs) {
                local desc = descs[key];
                if("get" in desc && desc.get) {
                    return desc.get.pcall(this);
                }

                return desc.value;
            }

            obj = obj.__proto__;
        }

        local infos = null, i = 2;
        while (infos = ::getstackinfos(i++)) {
            local locals = infos.locals;
            if(!("this" in locals))
                continue;

            locals = locals["this"]
            if(key in locals)
                return locals[key];
        }

        return null;
    }

    function _set(key, val) {

        local obj = this;
        while(obj) {
            local descs = obj.__jsDescriptors;
            if(key in descs) {
                local desc = descs[key];
                if("set" in desc && desc.set) {
                    return desc.set.pcall(this, val);
                }
            }

            obj = obj.__proto__;
        }

        __jsProps.push(key);
        __jsDescriptors[key] <- {
            configurable = true,
            enumerable = true,
            writable = true,
            value = val,
            get = null,
            set = null
        }
    }

    function tostring() {
        return toString();
    }
}

class __jsInteropFunction extends __jsInteropObject {
    __func__ = null;
    __bindArgs__ = null;

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
        return __call(this, thisArg, vargv);
    }
}

class __jsInteropPrimitive extends __jsInteropObject {
    // __prim__ = null;

    constructor(value) {
        base.constructor();
        __prim__ = value;
    }

    function _add(other) {
        return __(__prim__ + other.__prim__);
    }

    function _sub(other) {
        return __(__prim__ - other.__prim__);
    }

    function _mul(other) {
        return __(__prim__ * other.__prim__);
    }

    function _div(other) {
        return __(__prim__ / other.__prim__);
    }

    function _module(other) {
        return __(__prim__ % other.__prim__);
    }

    function _unm() {
        return __(-__prim__);
    }

    function _cmp(other) {
        if(__prim__ == other.__prim__) return 0;
        return __prim__ < other.__prim__ ? -1 : 1;
    }
}


///////////////////////////////////////////////////////////////////////////
//////////////|             HELPER FUNCTIONS                |//////////////
///////////////////////////////////////////////////////////////////////////

//-----------------------------------------------------------------------//
// Purpose: Wraps Squirrel literals into JavaScript Interop objects.
//-----------------------------------------------------------------------//
__ <- function(val, ...) {
    local a = typeof val;

    switch (a) {
        case "table":
            return __jsInteropObject(val);

        case "float":
        case "integer":
            a = __jsInteropPrimitive(val);
            a.__proto__ = Number.prototype;
            return a;

        case "bool":
            a = __jsInteropPrimitive(val);
            a.__proto__ = Boolean.prototype;
            return a;

        case "string":
            a = __jsInteropPrimitive(val);
            a.__proto__ = String.prototype;
            return a;

        case "function":
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
__call <- function (func, thisArg, args) {
    local fn = func.__func__, a = fn.getinfos();
    local b = a.native ? a.paramscheck : a.parameters.len() - (c = a.varargs) * 2;
    args.insert(0, thisArg);
    while (args.len() < b) args.push(null);

    if (c == 0)
    	while (args.len() > b) args.pop();

    if (func.__bindArgs__ != null)
    {
    	for (c = 1; c <= func.__bindArgs__.len(); c++)
    	    if (c < args.len() && args[c] == null) args[c] = func.__bindArgs__[c - 1];
    }

    // for(c = 1; c < args.len(); c++) args[c] = __(args[c]);
    return __(fn.acall(args));
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

//-----------------------------------------------------------------------//
// Purpose: Handle loose equality check ("==" operator)
//-----------------------------------------------------------------------//
__eq <- function(l, r) {
    return (l.tostring() <=> r.tostring()) == 0;
}

__seq <- function (l, r) {
    if(typeof l.__prim__ != typeof r.__prim__)
        return false;
    return l.__prim__ == r.__prim__;
}

__JS_MODULES <- {};
__declareModule <- function(name, _body) {
    __JS_MODULES[name] <- {body = _body};
}

__resolveModule <- function (name) {
    local s, m = __JS_MODULES[name];
    if(!("exports" in m)) {
        m.exports <- {}, s = {exports = m.exports};
        m.body.call(s);
    }
    return m.scope.exports;
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


///////////////////////////////////////////////////////////////////////////
//////////////|             Object Constructor              |//////////////
///////////////////////////////////////////////////////////////////////////
Object.prototype.hasOwnProperty = null;
Object.prototype.isPrototypeOf  = null;
Object.prototype.propertyIsEnumerable = null;
Object.prototype.toLocaleString = null;
Object.prototype.toString = __(function () {
    return __("[object Object]");
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
Function.prototype.apply = __(function(thisArg, args) {
    __call(this, thisArg, args);
}, "apply");
Function.prototype.call = __(function(thisArg, ...) {
    return apply(thisArg, vargv);
}, "call");
Function.prototype.bind = __(function(thisArg, ...) {
    local a = __func__.bindenv(thisArg), a = __(a, "bound " + name);
    a.__bindArgs__ = vargv;
    return a;
}, "bind");


///////////////////////////////////////////////////////////////////////////
//////////////|             String Constructor              |//////////////
///////////////////////////////////////////////////////////////////////////
String <- __(function() {}, "String");

String.prototype.__prim__   = "";
String.prototype.toString   = __(@()this, "toString");
String.prototype.valueOf    = __(@()this, "valueOf");
Object.defineProperty(String.prototype, "length", {
    get = @() __(__prim__.len())
});
String.prototype.at         = __(@(idx) __(__prim__[idx].tochar()), "at");
String.prototype.charCodeAt = __(@(idx) __(__prim__[idx]), "charCodeAt");
String.prototype.concat     = __(function (...) {
    local str = this;
    foreach (s in vargv) str += __(s);
    return str;
}, "concat")


///////////////////////////////////////////////////////////////////////////
//////////////|             Number Constructor              |//////////////
///////////////////////////////////////////////////////////////////////////
Number <- __(function () {}, "Number");
Number.EPSILON              = __(2.220446049250313e-16);
Number.MAX_SAFE_INTEGER     = __(9007199254740991);
Number.MAX_VALUE            = __(1.7976931348623157e+308);
Number.MAX_SAFE_INTEGER     = __(-9007199254740991);
Number.MIN_VALUE            = __(5e-324);
Number.NaN                  = __(0.0 / 0);
Number.POSITIVE_INFINITY    = __(1.0 / 0);
Number.NEGATIVE_INFINITY    = __(-1.0 / 0);

Number.isFinite         = __(function (x) {}, "isFinite")
Number.isInteger        = __(function (x) {}, "isInteger")
Number.isNaN            = __(function (x) {}, "isNaN")
Number.isSafeInteger    = __(function (x) {}, "isSafeInteger")
Number.parseFloat       = __(function (x) {}, "parseFloat")
Number.parseInt         = __(function (x) {}, "parseInt")

Number.prototype.__prim__       = 0;
Number.prototype.toExponential  = __(function (x) {}, "toExponential");
Number.prototype.toFixed        = __(function (x) {}, "toFixed");
Number.prototype.toLocaleString = __(function (x) {}, "toLocaleString");
Number.prototype.toPrecision    = __(function (x) {}, "toPrecision");
Number.prototype.toString       = __(@(x) __(__prim__.tostring()), "toString");
Number.prototype.valueOf        = __(@() this, "valueOf");


///////////////////////////////////////////////////////////////////////////
//////////////|             Number Constructor              |//////////////
///////////////////////////////////////////////////////////////////////////
Boolean <- __(function () {}, "Boolean");

Boolean.prototype.__prim__  = false;
Boolean.prototype.toString  = __(@() __(__prim__.tostring()), "toString");
Boolean.prototype.valueOf   = __(@() this, "valueOf");


///////////////////////////////////////////////////////////////////////////
//////////////|                 Math Object                 |//////////////
///////////////////////////////////////////////////////////////////////////
Math <- __({
    E       = __(2.718281828459045),
    LN2     = __(0.6931471805599453),
    LN10    = __(2.302585092994046),
    LOG2E   = __(1.4426950408889634),
    LOG10E  = __(0.4342944819032518),
    PI      = __(3.141592653589793),
    SQRT1_2 = __(0.7071067811865476),
    SQRT2   = __(1.4142135623730951)
    abs     = __(fabs),
    acos    = __(acos),
    acosh   = __(@(x) log(x + sqrt(x * x - 1)), "acosh"),
    asin    = __(asin),
    asinh   = __(@(x) log(x + sqrt(x * x + 1)), "asinh"),
    atan    = __(atan),
    atan2   = __(atan2),
    atanh   = __(@(x) 0.5 * log((1 + x) / (1 - x)), "atanh"),
    cbrt    = __(@(x) pow(x, 1.0 / 3), "cbrt"),
    ceil    = __(ceil),
    clz32   = __(function (x)
    {   if (x == 0) return 32;
        local a = 0x80000000, b = 0;
        while ((x & a) == 0) {
            b = b + 1;
            a = a >> 1;
        }
        return b;
    }, "clz32"),
    cos     = __(cos),
    cosh    = __(@(x) (exp(x) + exp(-x)) / 2.0, "cosh"),
    exp     = __(exp),
    expm1   = __(@(x) exp(x) - 1.0, "expm1"),
    floor   = __(floor),
    fround  = __UNIMPLEMENTED_FUNCTION,
    hypot   = __(function (...) {
        local sum = 0.0;
        foreach (arg in vargv) sum += arg * arg;
        return sqrt(sum);
    }),
    imul    = __UNIMPLEMENTED_FUNCTION,
    log     = __(log),
    log1p   = __UNIMPLEMENTED_FUNCTION,
    log2    = __UNIMPLEMENTED_FUNCTION,
    log10   = __(log10),
    max     = __(function(...) {
        local a = -inf; // TODO: -Infinity
        foreach (b in vargv) if (b > a) a = b;
        return a;
    }, "max"),
    min     = __(function(...) {
        local a = inf; // TODO: Infinity
        foreach (b in vargv) if (b < a) a = b;
        return a;
    }, "min"),
    pow     = __(pow),
    random  = __(@() ::rand().tofloat() / ::RAND_MAX, "random"),
    round   = __(function (x) {
        local a = x - floor(x);
        return a < 0.5 ? floor(x) : ceil(x);
    }, "round"),
    sign = __(function (x) {
        if (!x) return 0;
        return x > 0 ? 1 : -1;
    }, "sign"),
    sin     = __(sin),
    sinh    = __(@(x) (exp(x) - exp(-x)) / 2.0, "sinh"),
    sqrt    = __(sqrt),
    tan     = __(tan),
    trunc   = __(@(x)  x >= 0 ? floor(x) : ceil(x), "trunc")
});

__declareModule("test/main_js_0", function () {
    local _other = __resolveModule("test/other_js_1");
    class Test {
        a = null
        b = null
        constructor() {
            this.b = 2;
            this.a = 2;
        }
        function prikol() {
            return _other.foo(this.a, this.b);
        }
    };
    console.log(__eq("11", 11));
    console.log(__seq("11", 11));
});
__declareModule("test/other_js_1", function () {
    exports.foo <- foo;
    function foo (a, b) {
        return (a - b);
    };
});
__resolveModule("test/main_js_0");
