class PropertyDescriptor extends Object {
    /**
     * true if and only if the type of this property descriptor may be changed
     * and if the property may be deleted from the corresponding object.
     * Defaults to false.
     * @type {boolean}
     */
    configurable = false;
    /**
     * true if and only if this property shows up during enumeration of the
     * properties on the corresponding object. Defaults to false.
     * @type {boolean}
     */
    enumerable = false;
    /**
     * true if and only if the value associated with the property may be
     * changed with an assignment operator. Defaults to false.
     * @type {boolean}
     */
    writable = false;
    /**
     * The value associated with the property. Can be any valid JavaScript
     * value (number, object, function, etc.). Defaults to undefined.
     */
    value;
    /**
     * A function which serves as a getter for the property, or undefined
     * if there is no getter. The function's return value will be used
     * as the value of the property. Def    aults to undefined.
     */
    get;
    /**
     * A function which serves as a setter for the property, or undefined
     * if there is no setter. The function will receive as its only
     * argument the new value being assigned to the property. Defaults to undefined.
     */
    set;

}

/**
 * Implementation of the JavaScript Object class.
 */
class Object {
    props = {};

    constructor(object) {
        this.object = object;
    }

    _get(k) {
        return this[k];
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

    /**
     * Copies the values of all enumerable own properties from one or more source objects to a target object.
     */
    static assign(target, ...sources) {
        for (const source of sources) {
            for (const [k, v] of source) {
                target[k] = v;
            }
        }
        return target;
    }

    /**
     * Creates a new object with the specified prototype object and properties.
     */
    static create(proto, properties = null) {
        const target = {};
        this.assign(target, proto);

        if (properties) {
            this.assign(target, properties);
        }

        return target;
    }

    /**
     * Adds the named property described by a given descriptor to an object.
     * @param {Object} obj
     * @param {string} prop
     * @param {PropertyDescriptor} descriptor
     */
    static defineProperty(obj, prop, descriptor) {
        let desc = this.getOwnPropertyDescriptor(obj, prop);

        // Descriptor exists, meaning we have already defined this property.
        if (desc) {
            const
        }
    }

    /**
     *
     * @param {Object} obj
     * @param prop
     * @returns {*|{}}
     */
    static getOwnPropertyDescriptor(obj, prop) {
        return obj.properties[prop];
    }
}
