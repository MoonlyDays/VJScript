//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {CallExpression, Identifier, MemberExpression, Node} from 'estree';
import {NodePath} from 'estree-toolkit';

export type SearchPattern = {
    pattern: CollapsedIdentifier;
    call_only: boolean;
};

export type CollapsedIdentifier = string[];
export type IdentifierNode = MemberExpression | Identifier | CallExpression;

/**
 * Tries to convert an identifier or a member expression to a flattened identifier.
 * @param node
 */
export function collapseIdentifier(node: IdentifierNode): false | CollapsedIdentifier {

    if (node.type == 'MemberExpression') {
        // Member expression must not be computed,
        // for us to be able to generate identifier path.
        if (node.computed) {
            return false;
        }

        // Object must be an identifier for this to work.
        const object = node.object;
        const objectName = object.type == 'Identifier' ? object.name : null;

        const property = node.property;
        const propPath = collapseIdentifier(property as IdentifierNode);
        // Can't generate the path of the property, then we
        // can't build the entire path.
        if (propPath === false) {
            return false;
        }

        return [objectName, ...propPath];
    }

    if (node.type == 'Identifier') {
        return [node.name];
    }

    return false;
}

export function expandIdentifier(collapsedIdent: CollapsedIdentifier, fallback?: IdentifierNode): IdentifierNode {
    let prev: IdentifierNode;
    for (let i = 0; i < collapsedIdent.length; i++) {
        const identName = collapsedIdent[i];

        let ident: IdentifierNode = {
            type: 'Identifier',
            name: identName
        };

        if (!ident.name && fallback) {
            let fallbackNode: IdentifierNode = fallback;
            let success = true;
            for (let j = 0; j <= i; j++) {
                if (fallbackNode.type != 'MemberExpression') {
                    success = false;
                    break;
                }

                fallbackNode = fallbackNode.object as IdentifierNode;
            }

            if (success) {
                ident = fallbackNode;
            }
        }

        if (!prev) {
            prev = ident;
            continue;
        }

        prev = {
            type: 'MemberExpression',
            computed: false,
            optional: false,
            object: prev,
            property: ident
        };
    }
    return prev;
}

export function decodeIdentifier(encoded: string): CollapsedIdentifier {
    const ret: CollapsedIdentifier = [];
    const split = encoded.split('.');
    for (const item of split) {
        if (item == '*') {
            ret.push(null);
        } else {
            ret.push(item);
        }
    }

    return ret;
}

export function encodeIdentifier(decoded: CollapsedIdentifier): string {
    return decoded.map(x => x || '*').join('.');
}

export function findListEntryForIdentifier<T extends SearchPattern>(list: Array<T>, path: NodePath<IdentifierNode>): T {

    const node = path.node;
    const ident = collapseIdentifier(node);
    if (ident === false)
        return;

    for (const renameRule of list) {

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

        if (!matched)
            continue;

        if (renameRule.call_only) {
            throw Error('TODO: Implement call_only match!');
        }

        return renameRule;
    }
}