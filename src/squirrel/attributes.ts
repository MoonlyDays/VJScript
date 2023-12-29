//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {CallExpression, Program, TemplateElement} from 'estree';
import {builders as b, is, NodePath} from 'estree-toolkit';

import {IdentifierAttributes as ConfigAttributes} from './config';
import {IdentifierPattern} from './identifier';

type AttributeTypes =
    'ConcatParameters' |
    'EntityThinkCallback';

export interface NodeAttributes {
    Attributes: Record<AttributeTypes, string[]>,
    Params?: { [key: number]: NodeAttributes }
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
            if (!is.function(path))
                return;

            const clone = path.cloneNode();
            if (is.functionDeclaration(clone))
                return;

            const programPath = path.scope.getProgramScope().path as NodePath<Program>;
            if (!programPath)
                return;

            const ident = path.scope.generateUidIdentifier('__global___js_EntThink');
            const decl = b.variableDeclaration('const', [
                b.variableDeclarator(ident, b.functionExpression(null, [], b.blockStatement([
                    b.returnStatement(b.callExpression(clone, [b.identifier('self')]))
                ])))
            ]);

            programPath.unshiftContainer('body', [decl]);
            path.replaceWith(ident);
        }
    });

    if ('Params' in attrs) {
        const parent = path.parentPath;
        if (is.callExpression(parent))
            applyAttributesToParams(parent, attrs['Params']);

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

function applyAttributesToParams(path: NodePath<CallExpression>, params: NodeAttributes['Params']) {

    for (const paramIdx in params) {
        const attrs = params[paramIdx];
        const param = path.get('arguments')[paramIdx];
        if (!param) continue;

        applyAttributes(param, attrs);
    }

}
