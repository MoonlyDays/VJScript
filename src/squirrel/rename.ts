//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {randomBytes} from 'crypto';
import {parseScript} from 'esprima';
import {BlockStatement, Declaration} from 'estree';

import {IdentifierRenameList} from './config';
import {ESTreeNode} from './nodes';
import {ExtraDeclarations} from './preprocessing';
import {
    CollapsedIdentifier,
    collapseIdentifier,
    decodeIdentifier, expandIdentifier,
    IdentifierNode,
    isNodeOfType,
    NodeContext
} from './util';

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

            declaration = normalizeDeclaration(body[0]);
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

function generateIdentifier() {
    return `__js_gen_${randomBytes(4).toString('hex')}`;
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

function normalizeDeclaration(node: ESTreeNode): Declaration {

    if (isNodeOfType(node, 'ExpressionStatement')) {

        const expr = node.expression;
        if (isNodeOfType(expr, 'ArrowFunctionExpression')) {
            return normalizeDeclaration({
                type: 'FunctionDeclaration',
                params: expr.params,
                body: expr.body as BlockStatement,
                id: null,
            });
        }

        return normalizeDeclaration({
            type: 'VariableDeclaration',
            declarations: [{
                type: 'VariableDeclarator',
                init: expr,
                id: {
                    type: 'Identifier',
                    name: generateIdentifier()
                }
            }],
            kind: 'const'
        });
    }

    if (isNodeOfType(node, 'FunctionDeclaration')) {
        if (!node.id) {
            const randomName = generateIdentifier();
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