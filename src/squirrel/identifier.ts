//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {Identifier, MemberExpression} from 'estree';
import {is, NodePath} from 'estree-toolkit';

export type SearchPattern = {
    encodedPattern: string;
    pattern: CollapsedIdentifier;
    call_only: boolean;
};

export type CollapsedIdentifier = string[];
export type IdentifierNode = MemberExpression | Identifier;

/**
 * Tries to convert an identifier or a member expression to a flattened identifier.
 */
export function collapseIdentifier(path: NodePath): CollapsedIdentifier {

    if (is.memberExpression(path)) {
        const node = path.node as MemberExpression;
        // Member expression must not be computed, for us to be
        // able to generate an identifier path.
        if (node.computed)
            return;

        // Object must be an identifier for this to work.
        const object = node.object;
        const objectName = is.identifier(object) ? object.name : null;

        const propertyPath = path.get('property');
        const propertyIdent = collapseIdentifier(propertyPath);

        // Can't generate the path of the property, then we
        // can't build the entire path.
        if (!propertyIdent)
            return;

        return [objectName, ...propertyIdent];
    }

    if (is.identifier(path)) {

        const node = path.node as Identifier;
        return [node.name];
    }

    return;
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

    const ident = collapseIdentifier(path);
    if (!ident)
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