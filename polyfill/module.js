/*
 * Copyright (C) Moonly Days
 * https://github.com/MoonlyDays
 */

const modules = {};

function declareModule(name, body) {
    modules[name] = {body: body};
}

function resolveModule(name) {
    const module = modules[name];
    if (!module.scope) {
        module.scope = {};
        module.body.call(module.call);
    }
    return module.scope;
}