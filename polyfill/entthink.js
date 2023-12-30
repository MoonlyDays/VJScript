/*
 * Copyright (C) Moonly Days
 * https://github.com/MoonlyDays
 */

/**
 * Used in AddThinkToEnt to resolve a string name to pass to the native function
 * from a runtime passed closure.
 * @param {CBaseEntity} ent
 * @param {function} fn
 * @returns {string}
 */
function _(ent, fn) {

    ent.ValidateScriptScope();
    const name = "__js_EntThink_" + ent.GetScriptScope().__vname;

    fn = fn.bindenv(this);
    getroottable()[name] = (fn.getinfos().parameters.len()) > 1
        ? (() => fn(self))
        : (() => fn());

    return name;
}