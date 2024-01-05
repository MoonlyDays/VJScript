//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {Declaration, Identifier, Node, Program} from 'estree';
import {builders as b, is, NodePath} from 'estree-toolkit';

import {IDENTIFIER_MODIFIER_POLYFILLED} from './helpers/consts';

type PolyfillIdentifier = [string, string];

export class Polyfill {
    public name: string;
    public identifiers: PolyfillIdentifier[] = [];
    public declaration: Program;

    public get(name: string): string {
        return this.identifiers.find(x => x[0] == name)[1];
    }

    public add(desired: string, actual: string) {
        this.identifiers.push([desired, actual]);
    }

    public first() {
        return this.identifiers[0];
    }
}

export function normalizePolyfillIdentifier(node: Identifier, modulePath: NodePath, polyfillPath: NodePath, polyfill: Polyfill): Identifier {
    let actualIdent: string;
    let desiredIdent: string;
    if (node) {
        desiredIdent = node.name;
        actualIdent = desiredIdent;
    }

    actualIdent = IDENTIFIER_MODIFIER_POLYFILLED + actualIdent;
    actualIdent = modulePath.scope.generateUid(actualIdent);
    desiredIdent ??= actualIdent;

    console.log(desiredIdent, actualIdent);
    polyfill.add(desiredIdent, actualIdent);
    polyfillPath.scope.renameBinding(desiredIdent, actualIdent);

    return b.identifier(actualIdent);
}

export function normalizePolyfillStatement(node: Node, modulePath: NodePath, polyfillPath: NodePath, polyfill: Polyfill): Declaration {

    if (is.expressionStatement(node)) {
        const expr = node.expression;
        return normalizePolyfillStatement(expr, modulePath, polyfillPath, polyfill);
    }

    if (is.arrowFunctionExpression(node)) {
        const body = is.blockStatement(node.body)
            ? node.body
            : b.blockStatement([b.returnStatement(node.body)]);

        const decl = b.functionDeclaration(null, node.params, body);
        return normalizePolyfillStatement(decl, modulePath, polyfillPath, polyfill);
    }

    if (is.functionExpression(node)) {
        const decl = b.functionDeclaration(null, node.params, node.body);
        return normalizePolyfillStatement(decl, modulePath, polyfillPath, polyfill);
    }

    if (is.literal(node)) {
        const ident = modulePath.scope.generateUidIdentifier();
        const expr = b.variableDeclaration('const', [
            b.variableDeclarator(ident, node)
        ]);

        return normalizePolyfillStatement(expr, modulePath, polyfillPath, polyfill);
    }

    if (is.classDeclaration(node)) {
        node.id = normalizePolyfillIdentifier(node.id, modulePath, polyfillPath, polyfill);
        return node;
    }

    if (is.functionDeclaration(node)) {
        node.id = normalizePolyfillIdentifier(node.id, modulePath, polyfillPath, polyfill);
        return node;
    }

    if (is.variableDeclaration(node)) {
        const declarators = node.declarations;
        if (declarators.length > 1)
            throw Error('More than one variable declarator is not allowed in Polyfill.');

        const first = declarators[0];
        if (is.identifier(first.id)) {
            first.id = normalizePolyfillIdentifier(first.id, modulePath, polyfillPath, polyfill);
        }
        return node;
    }

    throw Error(`Unsupported Extra Declaration type: ${node.type}`);
}