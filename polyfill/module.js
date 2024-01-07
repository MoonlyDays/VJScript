/*
 * Copyright (C) Moonly Days
 * https://github.com/MoonlyDays
 */

const modules = {};

function declareModule(name, body) {
    modules[name] = {body: body};
}

function resolveModule(name) {

    let s, m = modules[name];
    if (!m) throw Error(`resolveModule: Unable to resolve "${name}"`);
    m.scope ??= s = {};
    return s && m.body.call(s) || m.scope;
}