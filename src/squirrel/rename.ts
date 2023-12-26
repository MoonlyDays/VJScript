//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import * as crypto from 'crypto';
import {Node} from 'estree';
import {NodePath} from 'estree-toolkit';

import {IdentifierRenameList} from './config';
import {
    CollapsedIdentifier,
    collapseIdentifier, encodeIdentifier,
    expandIdentifier,
    findListEntryForIdentifier,
    IdentifierNode
} from './identifier';

const HASH_SALT = 'Club Sandwich!';

export function renameNode(path: NodePath<IdentifierNode>) {
    const rule = findListEntryForIdentifier(IdentifierRenameList, path);
    if (!rule) {
        return;
    }

    const node = path.node;
    const nodeIdent = collapseIdentifier(node);
    if (nodeIdent === false)
        return;

    if ('declaration' in rule) {
        /*
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

        ctx.node = expandIdentifier(declaredIdent);*/
        return;
    }

    const newIdent = [];
    for (let i = 0; i < rule.rename.length; i++) {
        const renameItem = rule.rename[i];
        const identItem = nodeIdent[i];
        newIdent.push(renameItem || identItem);
    }

    path.replaceWith(expandIdentifier(newIdent, node));
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

function extractIdentifierName(node: Node): string {

    if (node.type == 'FunctionDeclaration') {
        return node.id.name;
    }

    if (node.type == 'Identifier')
        return node.name;

    if (node.type == 'VariableDeclaration') {
        const declaration = node.declarations[0];
        return extractIdentifierName(declaration.id);
    }

    throw Error(`Cannot extract identifier name from ${node.type}.`);
}
