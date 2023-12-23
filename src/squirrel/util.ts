//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {Program} from 'esprima';
import {BaseNode, Identifier, MemberExpression} from 'estree';

import {ESTreeNodeMap} from './nodes';

export const isNodeOfType = <T extends keyof ESTreeNodeMap>(node: BaseNode, type: T): node is ESTreeNodeMap[T] => {
    return node.type == type;
};

export interface NodeContext<T extends BaseNode = BaseNode> {
    node: T;
    parent?: NodeContext;
    program: Program;
}


export type CollapsedIdentifier = string[];
export type IdentifierNode = MemberExpression | Identifier;

/**
 * Tries to convert an identifier or a member expression to a flattened identifier.
 * @param node
 */
export function collapseIdentifier(node: IdentifierNode): false | CollapsedIdentifier {

    if (isNodeOfType(node, 'MemberExpression')) {
        // Member expression must not be computed,
        // for us to be able to generate identifier path.
        if (node.computed) {
            return false;
        }

        // Object must be an identifier for this to work.
        const object = node.object;
        if (object.type != 'Identifier') {
            return false;
        }

        const property = node.property;
        const propPath = collapseIdentifier(property as IdentifierNode);
        // Can't generate the path of the property, then we
        // can't build the entire path.
        if (propPath === false) {
            return false;
        }

        return [object.name, ...propPath];
    }

    if (isNodeOfType(node, 'Identifier')) {
        return [node.name];
    }

    return false;
}

/**
 * Expand a collapsed identifier
 * @param collapsedIdent
 */
export function expandIdentifier(collapsedIdent: CollapsedIdentifier): IdentifierNode {
    let prev: IdentifierNode;
    for (let i = 0; i < collapsedIdent.length; i++) {
        const identName = collapsedIdent[i];
        const ident: Identifier = {
            type: 'Identifier',
            name: identName
        };
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