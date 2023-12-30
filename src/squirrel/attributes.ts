//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {CallExpression, Expression, TemplateElement} from 'estree';
import {builders as b, is, NodePath} from 'estree-toolkit';

import Attributes from '../data/attributes';
import {ConfigSearchPatternSet, IdentifierPattern, parseSearchPattern, SearchPattern} from './identifier';
import {polyfillFromFile} from './polyfill';

export type AttributeType =
    'ConcatParameters' |
    'EntityThinkCallback';

const AttributeSet = new ConfigSearchPatternSet<AttributeRule>();

export interface AttributeRule extends SearchPattern {
    attributes: NodeAttributes
}

export interface NodeAttributes {
    Attributes?: { [K in keyof AttributeType]?: string[] },
    Parameters?: { [key: number]: NodeAttributes }
}

export function processAttributes(path: NodePath) {
    const rule = AttributeSet.find(path);
    if (!rule)
        return;

    const nodePattern = IdentifierPattern.fromPath(path);
    if (nodePattern.hasBinding(path))
        return;

    applyAttributes(path, rule.attributes);
}

function applyAttributes(path: NodePath, attrs: NodeAttributes) {

    runAppliers(path, attrs, {
        ConcatParameters: p => {

            const callExpr = p.parentPath;
            if (!is.callExpression(callExpr))
                return;

            if (path.parentKey != 'callee')
                return;

            const node = callExpr.node;
            if (node.arguments.length <= 1)
                return;

            const quasis: TemplateElement[] = [];
            const expr = [];

            for (let i = 0; i < node.arguments.length; i++) {
                if (i == 0) quasis.push(b.templateElement({cooked: '', raw: ''}, false));
                else quasis.push(b.templateElement({cooked: ', ', raw: ', '}, false));

                expr.push(node.arguments[i]);
            }

            quasis.push(b.templateElement({cooked: '', raw: ''}, true));

            node.arguments = [];
            callExpr.pushContainer('arguments', [b.templateLiteral(
                quasis,
                expr
            )]);
        },

        EntityThinkCallback: path => {

            const sibling = path.getPrevSibling();
            if (!sibling) return;

            const entThinkPolyfill = polyfillFromFile(path, 'resolveEntThink', './polyfill/entthink.js');

            const fnNode = path.cloneNode() as Expression;
            const targetNode = sibling.cloneNode() as Expression;

            path.replaceWith(b.callExpression(
                b.identifier(entThinkPolyfill.Identifier),
                [targetNode, fnNode]
            ));
        }
    });

    if ('Parameters' in attrs) {
        const parent = path.parentPath;
        if (is.callExpression(parent)) {
            applyAttributesToParams(parent, attrs['Parameters']);
        }
    }
}

function runAppliers(path: NodePath, attrs: NodeAttributes, appliers: {
    [K in keyof Record<AttributeType, unknown>]?: (p: NodePath, params: string[]) => void;
}) {
    for (const attribName in attrs.Attributes) {
        const params = attrs.Attributes[attribName];

        const applier = appliers[attribName];
        if (!applier) continue;

        applier(path, params);
    }
}

function applyAttributesToParams(path: NodePath<CallExpression>, params: NodeAttributes['Parameters']) {

    for (const paramIdx in params) {
        const attrs = params[paramIdx];
        const param = path.get('arguments')[paramIdx];
        if (!param) continue;

        applyAttributes(param, attrs);
    }
}

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
    for (const pattern in Attributes) {
        const data = Attributes[pattern];
        const block = parseAttributeBlock(data);

        const rule = parseSearchPattern<AttributeRule>(pattern);
        rule.attributes = block;

        AttributeSet.add(rule);
    }
}

parse();