/*
 * Copyright (C) Moonly Days
 * https://github.com/MoonlyDays
 */

class Module {
    constructor(body) {
        this.body = body;
        this.resolved = false;
        this.scope = null;
    }

    resolve() {
        if (!this.resolved) {
            this.scope = {};
            this.body.call(this.scope);
            this.resolved = true;
        }
        return this.scope;
    }
}

const modules = {};

function declareModule(name, body) {
    modules[name] = new Module(body);
}

function resolveModule(name) {
    const module = modules[name];
    if (!module) throw `Undefined module "${name}"`;
    return module.resolve();
}