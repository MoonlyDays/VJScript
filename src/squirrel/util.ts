//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {BaseNode, CallExpression, Program, Identifier, MemberExpression} from 'estree';

import {ESTreeNodeMap} from './nodes';

export const isNodeOfType = <T extends keyof ESTreeNodeMap>(node: BaseNode, type: T): node is ESTreeNodeMap[T] => {
    return node.type == type;
};

export class NodeContext<T extends BaseNode = BaseNode> {
    node: T;
    parent?: NodeContext;
    program: Program;

    constructor(node: T, parent?: NodeContext) {
        this.node = node;
        this.parent = parent;
        this.program = parent?.program;
    }

    /**
     * Goes up the parent stack and finds a parent of type.
     */
    findParent(type: keyof ESTreeNodeMap, maxDepth = 999) {

        if (maxDepth == 0)
            return null;

        // We reached the top of the stack.
        if (!this.parent)
            return null;

        if (this.parent.node.type == type)
            return this.parent;

        return this.parent.findParent(type, maxDepth - 1);
    }

    /**
     * Are we a child of a node of a specific type.
     */
    isChildOf(type: keyof ESTreeNodeMap) {
        return !!this.findParent(type);
    }
}


export type CollapsedIdentifier = string[];
export type IdentifierNode = MemberExpression | Identifier | CallExpression;

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
        const objectName = isNodeOfType(object, 'Identifier') ? object.name : null;

        const property = node.property;
        const propPath = collapseIdentifier(property as IdentifierNode);
        // Can't generate the path of the property, then we
        // can't build the entire path.
        if (propPath === false) {
            return false;
        }

        return [objectName, ...propPath];
    }

    if (isNodeOfType(node, 'Identifier')) {
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
                if (!isNodeOfType(fallbackNode, 'MemberExpression')) {
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