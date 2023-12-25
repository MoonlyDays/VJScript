//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {
    AssignmentExpression,
    ForInStatement, ForOfStatement,
    Node,
    VariableDeclarator
} from 'estree';
import {builders as b, NodePath, traverse} from 'estree-toolkit';
import {ESTree} from 'meriyah';
import * as path from 'path';

export function preprocess(program: ESTree.Program) {
    traverse(program, TraverseVisitors);
}


type TraverseVisitors = Parameters<typeof traverse>[1];
const TraverseVisitors: TraverseVisitors = {
    $: {scope: true},
    VariableDeclaration: path => {

        const node = path.node;
        if (node.kind == 'const') {
            // Multiple declarators in a single const declaration is not allowed.
            const declarators = node.declarations;
            if (declarators.length > 1) {
                for (let i = 1; i < declarators.length; i++) {
                    const declarator = declarators[i];
                    path.insertAfter([b.variableDeclaration('const', [declarator])]);
                }

                node.declarations = node.declarations.slice(0, 1);
            }

            // Const can only accept a single literal value,
            // Otherwise it's a local.
            const declarator = declarators[0];
            if (declarator) {

                // We assume it's always not null, because parser won't allow uninitialized
                // const variables.
                const init = declarator.init;
                if (!init || init.type != 'Literal') {
                    node.kind = 'let';
                }
            }
        }
    },
    ForOfStatement: path => {
        const node = path.node;
        normalizeLoopStatement(path);

        if (node.left.type == 'ArrayPattern') {
            if (node.left.elements.length > 2)
                throw Error('For Loop: Array Pattern must not contain more than 2 elements.');
        }

    },
    ForInStatement: path => {
        const node = path.node;
        normalizeLoopStatement(path);

        if (node.left.type == 'VariableDeclaration') {
            throw Error('ForInStatement: left must not be VariableDeclaration! Something went wrong!');
        }

        let left = node.left;
        const leftPath = path.get('left');
        if (left.type != 'ArrayPattern') {
            left = b.arrayPattern([left]);
            leftPath.replaceWith(left);
        }

        if (left.elements.length < 2) {
            const extraIdent = leftPath.scope.generateUidIdentifier();
            left.elements.push(extraIdent);
        }

        path.replaceWith(b.forOfStatement(left, node.right, node.body, false));
    },
    VariableDeclarator: path => {
        const node = path.node;
        if (node.id.type == 'ArrayPattern') {
            const replace: VariableDeclarator[] = [];
            const pattern = node.id;
            const init = node.init;

            for (let i = 0; i < pattern.elements.length; i++) {
                const el = pattern.elements[i];
                const elInit = init && b.memberExpression(init, b.literal(i), true);
                replace.push(b.variableDeclarator(el, elInit));
            }

            path.replaceWithMultiple(replace);
            return;
        }
    },
    AssignmentExpression: path => {
        const node = path.node;
        if (node.left.type == 'ArrayPattern') {
            const left = node.left;
            const replace: AssignmentExpression[] = [];

            // Try to find a parent that is contained inside an array.
            const parentPath = path.find(x => Array.isArray(x.container));
            const tmp = parentPath.scope.generateUidIdentifier();
            parentPath.insertBefore([b.variableDeclaration(
                'let', [b.variableDeclarator(tmp, node.right)])
            ]);

            for (let i = 0; i < left.elements.length; i++) {
                const key = left.elements[i];
                const value = b.memberExpression(tmp, b.literal(i), true);
                replace.push(b.assignmentExpression('=', key, value));
            }

            parentPath.insertBefore(replace);
            path.remove();
        }
    },

    FunctionExpression: path => {
        // Function expression must not contain a name.
        const node = path.node;
        node.id = null;
    },

    ArrowFunctionExpression: path => {
        const node = path.node;

        if (node.body.type != 'BlockStatement') {
            node.body = b.blockStatement([b.returnStatement(node.body)]);
        }

        path.replaceWith(b.functionExpression(null, node.params, node.body, node.generator, node.async));
    }
};

const normalizeLoopStatement = (forPath: NodePath<ForInStatement | ForOfStatement>) => {

    const path = forPath.get('left');
    const node = path.node;
    // For loop statement should be normalized to having
    // left property of either Identifier or ArrayPattern types
    if (node.type == 'VariableDeclaration') {
        // Declarations in for loop always are supposed to have one declarator.
        const declarator = node.declarations[0];

        // If we are declaring an Array Pattern, just use that pattern
        // as our left parameter.
        if (declarator.id.type == 'ArrayPattern') {
            path.replaceWith(declarator.id);
            return;
        }

        // If we are declaring an identifier, return
        // that identifier in an array pattern.
        if (declarator.id.type == 'Identifier') {
            path.replaceWith(b.arrayPattern([declarator.id]));
            return;
        }

        throw Error(`Unhandled left-side node of an for loop expression: ${node.type}`);
    }
};

/*
const helpers = {
    processArrayPattern: <T extends Node>(path: NodePath<T, Node>, patternKey: keyof T, valueKey: keyof T) => {

        const pattern = path.node[patternKey] as ArrayPattern;
        const value = path.node[valueKey] as Node;

        const replace: AssignmentExpression[] = [];

        // Try to find a parent that is contained inside an array.
        const parentPath = path.find(x => Array.isArray(x.container));
        const tmp = parentPath.scope.generateUidIdentifier();
        parentPath.insertBefore([b.variableDeclaration(
            'let', [b.variableDeclarator(tmp, node.right)])
        ]);

        for (let i = 0; i < left.elements.length; i++) {
            const key = left.elements[i];
            const value = b.memberExpression(tmp, b.literal(i), true);
            replace.push(b.assignmentExpression('=', key, value));
        }

        parentPath.insertBefore(replace);
        path.remove();
    }
};*/