//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {Declaration, Identifier, Node, Program} from 'estree';
import {is, NodePath} from 'estree-toolkit';
import {builders as b} from 'estree-toolkit/dist/builders';
import * as fs from 'fs';
import {parseScript} from 'meriyah';
import * as path from 'path';

import {MeriyahParseOptions} from './helpers';

interface PolyfillDeclaration {
    DesiredIdentifier: string;
    Identifier: string;
    Declaration: Declaration;
}

const PolyfillMap = new Map<string, PolyfillDeclaration>();

export function resetPolyfill() {
    PolyfillMap.clear();
}

export function polyfillFromFile(nodePath: NodePath, ident: string, file: string) {

    const polyfill = getPolyfillFor(ident);
    if (polyfill) return polyfill;

    const absFile = path.resolve(__dirname, '../../', file);
    const code = fs.readFileSync(absFile, {encoding: 'utf-8'});

    return polyfillFromString(nodePath, ident, code);
}

export function polyfillFromString(path: NodePath, ident: string, code: string) {

    let polyfill = getPolyfillFor(ident);
    if (polyfill) return polyfill;

    const program = parseScript(code, MeriyahParseOptions) as Program;
    const body = program.body;
    if (body.length > 1) {
        throw Error('More than one statement is not allowed in Polyfill.');
    }

    const normalizedIdent = normalizeIdentifier(ident);
    const generatedIdent = path.scope.generateUidIdentifier(normalizedIdent);
    const declaration = normalizePolyfillStatement(body[0], generatedIdent);

    const programPath = path.scope.getProgramScope().path;
    if (!is.program(programPath))
        return;

    // Add declaration to the program body.
    programPath.unshiftContainer('body', [declaration]);

    polyfill = {
        DesiredIdentifier: ident,
        Identifier: generatedIdent.name,
        Declaration: declaration
    };

    PolyfillMap.set(ident, polyfill);
    return polyfill;
}

function getPolyfillFor(ident: string) {
    return PolyfillMap.get(ident);
}

function normalizeIdentifier(desired: string) {
    desired = desired.replace(/[0-9]/g, '');

    if (desired.startsWith('::'))
        desired = '__global_' + desired;

    desired = '__js_' + desired;
    return desired;
}

function normalizePolyfillStatement(node: Node, ident: Identifier): Declaration {

    if (is.expressionStatement(node)) {
        const expr = node.expression;
        return normalizePolyfillStatement(expr, ident);
    }

    if (is.arrowFunctionExpression(node)) {
        const body = is.blockStatement(node.body)
            ? node.body
            : b.blockStatement([b.returnStatement(node.body)]);

        const decl = b.functionDeclaration(ident, node.params, body);
        return normalizePolyfillStatement(decl, ident);
    }

    if (is.literal(node)) {
        const expr = b.variableDeclaration('const', [
            b.variableDeclarator(ident, node)
        ]);

        return normalizePolyfillStatement(expr, ident);
    }

    if (is.classDeclaration(node)) {
        node.id = ident;
        return node;
    }

    if (is.functionDeclaration(node)) {
        node.id = ident;
        return node;
    }

    if (is.variableDeclaration(node)) {

        const declarators = node.declarations;
        if (declarators.length > 1)
            throw Error('More than one variable declarator is not allowed in Polyfill.');

        const first = declarators[0];
        first.id = ident;
        return node;
    }

    throw Error(`Unsupported Extra Declaration type: ${node.type}`);
}