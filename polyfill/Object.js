class JSPropertyDescriptor {
    configurable = false;
    enumerable = false;
    writable = false;
    value;
    get;
    set;
}

/**
 * Implementation of Object (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
 */
class JSObject {

    constructor(object) {
        this.properties = [];
        this.object = object;
    }

    _get(k) {
        return this.object[k];
    }

    _set(k, v) {
        this.object[k] = v;
    }

    _newslot(k, v) {
        this.object[k] = v;
    }

    //-----------------------------------------------------------------------------
    // Static "Object" stuff goes below.
    //-----------------------------------------------------------------------------

    static assign(target, ...sources) {
        for (const source of sources) {
            for (const [k, v] of source) {
                target[k] = v;
            }
        }
        return target;
    }

    static create(proto, properties = null) {
        const target = {};
        this.assign(target, proto);

        if (properties) {
            this.assign(target, properties);
        }

        return target;
    }

    static defineProperty(obj, prop, descriptor) {

    }
}
