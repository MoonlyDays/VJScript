//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {CallExpression} from 'estree';
import {is, NodePath} from 'estree-toolkit';

import AttributesConfig from '../data/attributes';
import {IDENTIFIER_HELPER_MODULE_RESOLVE} from './consts';
import {ConfigSearchPatternSet, Identifier, parseSearchPattern, SearchPattern} from './identifier';
import {Module} from './module';

export type AttributeType =
    'RequireFunction';

const AttributeSet = new ConfigSearchPatternSet<AttributeRule>();

export interface AttributeRule extends SearchPattern {
    attributes: NodeAttributes
}

export interface NodeAttributes {
    Attributes?: { [K in keyof AttributeType]?: string[] },
    Parameters?: { [key: number]: NodeAttributes }
}

type AttributesAppliers = {
    [K in keyof Record<AttributeType, unknown>]?: (p: NodePath, m: Module, params: string[]) => void;
};

const AttributesHandlers: AttributesAppliers = {

    RequireFunction: (path, module) => {
        const callExpr = path.parentPath;
        if (!is.callExpression(callExpr))
            return;

        const node = callExpr.node;
        const argument = node.arguments[0];
        const callee = node.callee;

        if (!is.literal(argument))
            throw Error('RequireFunction: argument needs to be a literal.');

        if (!is.identifier(callee))
            throw Error('RequireFunction: callee needs to be a identifier.');

        const importedModule = Module.resolveImportedPath(argument.value.toString(), module);
        if (!importedModule)
            return;

        argument.value = importedModule.name;
        callee.name = IDENTIFIER_HELPER_MODULE_RESOLVE;
        callExpr.skipChildren();
    }
};


/**
 * Object for accessing the Attributes system. Attributes are used
 * to alter the nodes.
 */
export const Attributes = {

    /**
     * Process a given node path based on the configured attributes.
     * @param path
     * @param module
     */
    process(path: NodePath, module: Module) {
        const rule = AttributeSet.find(path);
        if (!rule)
            return;

        const nodePattern = Identifier.fromPath(path);
        if (nodePattern.hasBinding(path))
            return;

        this.handlePath(path, rule.attributes, module);
    },

    /**
     * Applies a list of attributes on the target node path.
     * @param path
     * @param attrs
     * @param module
     */
    handlePath(path: NodePath, attrs: NodeAttributes, module: Module) {

        for (const attribName in attrs.Attributes) {
            const params = attrs.Attributes[attribName];

            const handler = AttributesHandlers[attribName];
            if (!handler) continue;

            handler(path, module, params);
        }

        if ('Parameters' in attrs) {
            const parent = path.parentPath;
            if (is.callExpression(parent)) {
                this.handleParams(parent, attrs['Parameters'], module);
            }
        }
    },

    handleParams(path: NodePath<CallExpression>, params: NodeAttributes['Parameters'], module: Module) {
        for (const paramIdx in params) {
            const attrs = params[paramIdx];
            const param = path.get('arguments')[paramIdx];
            if (!param) continue;

            this.handlePath(param, attrs, module);
        }
    }
};

function parseAttributeArray(array: AttributeType[]): object {
    const obj = {};

    for (const attr of array) {
        const t = parseAttribute(attr);
        obj[t[0]] = t[1];
    }

    return obj;
}

function parseAttributeBlock(block: object) {

    if (Array.isArray(block)) {
        return {Attributes: parseAttributeArray(block)};
    }

    const attributes = block['Attributes'];
    if (Array.isArray(attributes)) {
        block['Attributes'] = parseAttributeArray(attributes);
    }

    const parameters = block['Parameters'];
    if (parameters) {
        for (const idx in parameters) {
            const paramBlock = parameters[idx];
            block['Parameters'][idx] = parseAttributeBlock(paramBlock);
        }
    }

    return block;
}

function parseAttribute(attr: string): [string, string[]] {
    const split = attr.split(':');
    return [split[0], split[1]?.split(',') || []];
}

function parse() {
    for (const pattern in AttributesConfig) {
        const data = AttributesConfig[pattern];
        const block = parseAttributeBlock(data);

        const rule = parseSearchPattern<AttributeRule>(pattern);
        rule.attributes = block;

        AttributeSet.add(rule);
    }
}

parse();