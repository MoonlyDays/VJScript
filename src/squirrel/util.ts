//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {CallExpression, Identifier, MemberExpression, Program, Syntax} from 'esprima-next';

import {SearchPattern} from './config';
import {ESTreeNode, ESTreeNodeMap} from './nodes';

export type Mutable<T> = {
    -readonly [K in keyof T]: T[K]
}

export class NodeContext<T extends ESTreeNode = ESTreeNode> {
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

    if (node.type == Syntax.MemberExpression) {
        // Member expression must not be computed,
        // for us to be able to generate identifier path.
        if (node.computed) {
            return false;
        }

        // Object must be an identifier for this to work.
        const object = node.object;
        const objectName = object.type == Syntax.Identifier ? object.name : null;

        const property = node.property;
        const propPath = collapseIdentifier(property as IdentifierNode);
        // Can't generate the path of the property, then we
        // can't build the entire path.
        if (propPath === false) {
            return false;
        }

        return [objectName, ...propPath];
    }

    if (node.type == Syntax.Identifier) {
        return [node.name];
    }

    return false;
}

export function expandIdentifier(collapsedIdent: CollapsedIdentifier, fallback?: IdentifierNode): IdentifierNode {
    let prev: IdentifierNode;
    for (let i = 0; i < collapsedIdent.length; i++) {
        const identName = collapsedIdent[i];

        let ident: IdentifierNode = {
            type: Syntax.Identifier,
            name: identName
        };

        if (!ident.name && fallback) {
            let fallbackNode: IdentifierNode = fallback;
            let success = true;
            for (let j = 0; j <= i; j++) {
                if (fallbackNode.type != Syntax.MemberExpression) {
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
            type: Syntax.MemberExpression,
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

export function findListEntryByNode<T extends SearchPattern>(list: Array<T>, ctx: NodeContext<IdentifierNode>): T {

    const node = ctx.node;
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
            const parent = ctx.parent.node;
            if (parent.type != Syntax.CallExpression)
                return;

            if (parent.callee != node)
                return;
        }

        return renameRule;
    }
}