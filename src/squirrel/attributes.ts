//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {CallExpression, Expression, TemplateElement} from 'estree';
import {builders as b, is, NodePath} from 'estree-toolkit';

import {IdentifierAttributes as ConfigAttributes} from './config';
import {IdentifierPattern} from './identifier';

type AttributeTypes =
    'ConcatParameters' |
    'EntityThinkCallback';

export interface NodeAttributes {
    Attributes: Record<AttributeTypes, string[]>,
    Parameters?: { [key: number]: NodeAttributes }
}

export function processAttributes(path: NodePath) {
    const rule = ConfigAttributes.find(path);
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

            const fnNode = path.cloneNode() as Expression;
            const targetNode = sibling.cloneNode() as Expression;

            path.replaceWith(b.callExpression(
                b.identifier('resolveEntThink'),
                [targetNode, fnNode]
            ));

        }
    });


    if ('Parameters' in attrs) {
        const parent = path.parentPath;
        if (is.callExpression(parent))
            applyAttributesToParams(parent, attrs['Parameters']);
    }
}

function runAppliers(path: NodePath, attrs: NodeAttributes, appliers: {
    [K in keyof Record<AttributeTypes, unknown>]?: (p: NodePath, params: string[]) => void;
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

const SelfScriptScopeIdentifier = '__js_selfSC';
const SelfScriptScopeIdents = new Set<string>();

function figureOutNameForScriptScope(key: string) {

    if (SelfScriptScopeIdents.has(key)) {
        const numMatch = key.match(/[0-9]+$/);
        let idx = 1;
        if (numMatch) {
            const num = numMatch[0];
            key = key.slice(0, -num.length);
            idx = Number(num) + 1;
        }

        key += idx;
        return figureOutNameForScriptScope(key);
    }

    return key;
}

function copyToScriptScope(key: string, path: NodePath<Expression>, near: NodePath = path) {

    key = figureOutNameForScriptScope(key || path.scope.generateUid());
    SelfScriptScopeIdents.add(key);
    const keyIdent = b.identifier('__' + key);

    near.insertAfter([
        b.assignmentExpression('=', b.memberExpression(
            b.identifier(SelfScriptScopeIdentifier),
            keyIdent
        ), path.cloneNode())
    ]);
    return keyIdent;
}
