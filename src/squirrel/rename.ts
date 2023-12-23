//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import * as crypto from 'crypto';
import {parseScript} from 'esprima';
import {BlockStatement, Declaration} from 'estree';

import {IdentifierRenameList} from './config';
import {ESTreeNode} from './nodes';
import {ExtraDeclarations} from './preprocessing';
import {
    CollapsedIdentifier,
    collapseIdentifier,
    decodeIdentifier, encodeIdentifier, expandIdentifier,
    IdentifierNode,
    isNodeOfType,
    NodeContext
} from './util';

const HASH_SALT = 'Club Sandwich!';

export function renameNode(ctx: NodeContext<IdentifierNode>) {
    const node = ctx.node;
    const nodeIdent = collapseIdentifier(node);
    if (nodeIdent === false)
        return;

    const rule = findRule(node, nodeIdent);
    if (!rule) {
        return;
    }

    if (rule.call_only) {
        const parent = ctx.parent.node;
        if (!isNodeOfType(parent, 'CallExpression'))
            return;

        if (parent.callee != node)
            return;
    }

    if ('declaration' in rule) {
        const decl = rule.declaration;

        let declaration = ExtraDeclarations.get(decl);
        if (!declaration) {
            const programCode = parseScript(decl);
            const body = programCode.body;

            if (body.length > 1) {
                throw Error('More than one declaration is not allowed in Declare config.');
            }

            declaration = normalizeDeclaration(body[0], rule.pattern);
            ExtraDeclarations.set(decl, declaration);
        }

        const identName = extractIdentifierName(declaration);
        const declaredIdent = decodeIdentifier(identName);

        ctx.node = expandIdentifier(declaredIdent);
        return;
    }

    const newIdent = [];
    for (let i = 0; i < rule.rename.length; i++) {
        const renameItem = rule.rename[i];
        const identItem = nodeIdent[i];
        newIdent.push(renameItem || identItem);
    }

    ctx.node = expandIdentifier(newIdent, node);
}

function findRule(node: IdentifierNode, ident: CollapsedIdentifier) {

    for (const renameRule of IdentifierRenameList) {

        const identPattern = renameRule.pattern;
        if (identPattern.length != ident.length)
            continue;

        let matched = true;
        for (let i = 0; i < identPattern.length; i++) {
            const patternItem = identPattern[i];
            const identItem = ident[i];
            if (!patternItem)
                continue;

            if (patternItem == identItem)
                continue;

            matched = false;
        }

        if (matched)
            return renameRule;
    }
}

function generateIdentifier(searchPattern: CollapsedIdentifier) {

    const encodedIdent = encodeIdentifier(searchPattern);
    const hash = crypto.createHash('SHA1');
    hash.update(encodedIdent + HASH_SALT);
    const digest = hash.digest('hex').slice(0, 4);

    const inlineName = searchPattern
        .filter(x => !!x)
        .map(x => x.toLowerCase())
        .join('_');

    return `__js_${inlineName}_${digest}`;
}

function extractIdentifierName(node: ESTreeNode): string {

    if (isNodeOfType(node, 'FunctionDeclaration')) {
        return node.id.name;
    }

    if (isNodeOfType(node, 'VariableDeclaration')) {
        const declaration = node.declarations[0];
        const id = declaration.id;

        if (isNodeOfType(id, 'Identifier'))
            return id.name;

        throw Error('Only Identifier is allowed as variable declarator in Declare config.');
    }

    throw Error(`Cannot extract identifier name from ${node.type}.`);
}

function normalizeDeclaration(node: ESTreeNode, searchPattern: CollapsedIdentifier): Declaration {

    if (isNodeOfType(node, 'ExpressionStatement')) {

        const expr = node.expression;
        if (isNodeOfType(expr, 'ArrowFunctionExpression')) {
            return normalizeDeclaration({
                type: 'FunctionDeclaration',
                params: expr.params,
                body: expr.body as BlockStatement,
                id: null,
            }, searchPattern);
        }

        return normalizeDeclaration({
            type: 'VariableDeclaration',
            declarations: [{
                type: 'VariableDeclarator',
                init: expr,
                id: {
                    type: 'Identifier',
                    name: generateIdentifier(searchPattern)
                }
            }],
            kind: 'const'
        }, searchPattern);
    }

    if (isNodeOfType(node, 'FunctionDeclaration')) {
        if (!node.id) {
            const randomName = generateIdentifier(searchPattern);
            node.id = {type: 'Identifier', name: randomName};
        }

        return node;
    }

    if (isNodeOfType(node, 'VariableDeclaration')) {

        node.kind = 'const';
        const declarators = node.declarations;
        if (declarators.length > 1)
            throw Error('Only one variable declarator is allowed in Declare config.');

        const declarator = declarators[0];
        if (!isNodeOfType(declarator.id, 'Identifier'))
            throw Error('Only Identifier type is allowed in VariableDeclarator.');

        return node;
    }

    throw Error(`Unsupported Declaration ${node.type} in Declare config.`);
}