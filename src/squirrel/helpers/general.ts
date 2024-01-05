//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {AssignmentExpression, ClassBody, VariableDeclaration} from 'estree';
import {is, NodePath} from 'estree-toolkit';

import {IDENTIFIER_MODIFIER_GLOBAL} from './consts';

export function findPathInsideArray(path: NodePath) {
    return path.find(x => Array.isArray(x.container));
}

/**
 * Returns the deepest member expression in the tree. Returns the given path if it's not a member expression.
 * @param path
 */
export function deepestMemberExpression(path: NodePath) {
    let memberObject: NodePath;
    while (is.memberExpression(path) && is.memberExpression((memberObject = path.get('object')))) {
        path = memberObject;
    }

    return path;
}

export function shouldUseSlotOperator(path: NodePath<AssignmentExpression>) {

    // If we assign to a previously declared identifier, we don't need to use the slot operator.
    const leftPath = path.get('left');
    if (is.identifier(leftPath)) {
        if (leftPath.scope.hasBinding(leftPath.node.name)) {
            return false;
        }
    }

    const classBody = path.findParent<ClassBody>(is.classBody);
    if (classBody) {

        // We can't use slot operator for changing class fields through "this" keyword.
        // Find the deepest member expression.
        const deepestMemberExprPath = deepestMemberExpression(leftPath);

        if (is.memberExpression(deepestMemberExprPath)) {

            const object = deepestMemberExprPath.get('object');
            const prop = deepestMemberExprPath.get('property');

            // If an object is "this" keyword, and property is some sort of identifier,
            // and we're inside a class body, we can't use slot operator.
            if (is.thisExpression(object) && is.identifier(prop)) {
                return false;
            }
        }
    }

    return true;
}


/**
 * We're given a Variable Declaration node, returns true if declarators in it need to split
 * in their own declarations.
 * @param path
 */
export function variableDeclarationNeedsToSplit(path: NodePath<VariableDeclaration>) {

    const node = path.node;
    if (node.declarations.length <= 1)
        return false;

    if (node.kind == 'const') {
        // Multiple declarators in a single const declaration is not allowed.
        return true;
    }

    for (let i = 0; i < node.declarations.length; i++) {
        const decl = node.declarations[i];
        const id = decl.id;
        const init = decl.init;

        // Global variables must always be declared
        if (is.identifier(id) && id.name.includes(IDENTIFIER_MODIFIER_GLOBAL))
            return true;

        if (is.callExpression(init) && is.identifier(init.callee) && init.callee.name == 'require')
            return true;
    }

    return false;
}