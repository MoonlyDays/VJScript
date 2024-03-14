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
    if(t != "instance" && t != "table" && t != "class")
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

    printl("{");
    foreach(k, v in obj) {

        if (k == "__ctor__")
        continue;

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
        printl("");
    }
}

printl <- function(str) {
    print(str);
    print("\n");
}

class __jsInteropObject {
    __jsProps = null;
    __jsDescriptors = null;

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
        if(key in a) return (c = a[key].get) ? c.pcall(this) : a[key].value;
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
            if (d = (c = a[key]).set) d.pcall(this, val);
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
    constructor(_fn = null) {
        base.constructor();

        name = null;
        __func__ = _fn || function () {};
        __proto__ = null;

        local infos = _fn.getinfos();
        length = infos.parameters.len();
        prototype = __jsInteropObject({
            __proto__ = null,
        	__ctor__ = this
        });
    }

    function _call(...) {
        return __func__.acall(vargv);
    }
}

function __jsExtend(ctor, baseCtor) {
    ctor.prototype.__proto__ = baseCtor.prototype;
}

function __jsNew(fn, ...) {
    local _new = __jsInteropObject({
        __proto__ = fn.prototype
    });
    fn.apply(_new, vargv);
    return _new;
}

//---------------------------------------------------
// Object
//---------------------------------------------------
Object <- __jsInteropFunction(function() {});
Object.name = "Object";

// Object Prototype
Object.prototype.hasOwnProperty = null;
Object.prototype.isPrototypeOf = null;
Object.prototype.propertyIsEnumerable = null;
Object.prototype.toLocaleString = null;
Object.prototype.toString = function () {
    return "[object Object]";
};
Object.prototype.valueOf = null;

// Object Static
Object.assign = null;
Object.create = null;
Object.defineProperties = null;
Object.defineProperty = null;
Object.entries = null;
Object.freeze = null;
Object.fromEntries = null;
Object.getOwnPropertyDescriptor = null;
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

//---------------------------------------------------
// Function
//---------------------------------------------------
Function <- __jsInteropFunction(function() {
    throw "Creating instances of Function with 'new' keyword is not allowed.";
});
Function.name = "Function";
Function.__proto__ = Function.prototype;
Function.prototype.__proto__ = Object.prototype;
Function.prototype.apply = function(thisArg, args) {
    args.insert(0, thisArg);
    __func__.acall(args);
}
Function.prototype.call = function(thisArg, ...) {
    apply(thisArg, vargv);
};
Function.prototype.bind = null;

__ <- function(val, ...) {
    local a = typeof val;
    if (a == "function") {
        a = __jsInteropFunction(val);
        a.__proto__ = Function;
        a.prototype.__proto__ = Object.prototype;
        if (vargv.len() > 0) a.name = vargv[0];
        if (vargv.len() > 1) a.prototype.__proto__ = vargv[1].prototype;
        return a;
    }
}

CBaseEntity <- __(function () {
    Position = 0;
    Rotation = 0;
    Velocity = 0;
}, "CBaseEntity")

CTFPlayer <- __(function () {
    __proto__.__proto__.__ctor__.call(this);
    Name = "Poggers";
}, "CTFPlayer", CBaseEntity);

local player = __jsNew(CTFPlayer);
console.log(player.toString());