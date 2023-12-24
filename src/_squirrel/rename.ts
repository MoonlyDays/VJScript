//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import * as crypto from 'crypto';
import {BlockStatement, Declaration, parseScript, Syntax} from 'esprima-next';

import {IdentifierRenameList} from '../squirrel/config';
import {ESTreeNode} from './nodes';
import {ExtraDeclarations} from './preprocessing';
import {
    CollapsedIdentifier,
    collapseIdentifier,
    decodeIdentifier,
    encodeIdentifier,
    expandIdentifier,
    findListEntryByNode,
    IdentifierNode,
    Mutable,
    NodeContext
} from './util';

const HASH_SALT = 'Club Sandwich!';

export function renameNode(ctx: NodeContext<IdentifierNode>) {
    const rule = findListEntryByNode(IdentifierRenameList, ctx);
    if (!rule) {
        return;
    }

    const node = ctx.node;
    const nodeIdent = collapseIdentifier(node);
    if (nodeIdent === false)
        return;

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

    if (node.type == Syntax.FunctionDeclaration) {
        return node.id.name;
    }

    if (node.type == Syntax.Identifier)
        return node.name;

    if (node.type == Syntax.VariableDeclaration) {
        const declaration = node.declarations[0];
        return extractIdentifierName(declaration.id);
    }

    throw Error(`Cannot extract identifier name from ${node.type}.`);
}

function normalizeDeclaration(node: Mutable<ESTreeNode>, searchPattern: CollapsedIdentifier): Declaration {

    if (node.type == Syntax.ExpressionStatement) {

        const expr = node.expression;
        if (expr.type == Syntax.ArrowFunctionExpression) {
            return normalizeDeclaration({
                type: Syntax.FunctionDeclaration,
                params: expr.params,
                body: expr.body as BlockStatement,
                generator: expr.generator,
                expression: expr.expression,
                async: expr.async,
                id: null,
            }, searchPattern);
        }

        return normalizeDeclaration({
            type: Syntax.VariableDeclaration,
            kind: 'const',
            declarations: [{
                type: Syntax.VariableDeclarator,
                init: expr,
                id: {
                    type: Syntax.Identifier,
                    name: generateIdentifier(searchPattern)
                }
            }]
        }, searchPattern);
    }

    if (node.type == Syntax.FunctionDeclaration) {

        if (!node.id) {
            const randomName = generateIdentifier(searchPattern);
            node.id = {type: Syntax.Identifier, name: randomName};
        }

        return node;
    }

    if (node.type == Syntax.VariableDeclaration) {
        node.kind = 'const';
        const declarators = node.declarations;
        if (declarators.length > 1)
            throw Error('Only one variable declarator is allowed in Declare config.');

        const declarator = declarators[0];
        if (declarator.id.type != Syntax.Identifier)
            throw Error('Only Identifier type is allowed in VariableDeclarator.');

        return node;
    }

    throw Error(`Unsupported Declaration ${node.type} in Declare config.`);
}