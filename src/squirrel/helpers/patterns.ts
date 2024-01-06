//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {ArrayPattern, Expression, MemberExpression, Node, ObjectPattern, Pattern} from 'estree';
import {is, NodePath} from 'estree-toolkit';
import {builders as b} from 'estree-toolkit';

import {findPathInsideArray} from './general';

export function replaceArrayPattern<T extends Node>(
    id: ArrayPattern,
    init: Expression,
    scopePath: NodePath<T>,
    createFn: (pattern: Pattern, value: MemberExpression) => T,
    insertPath: NodePath = scopePath
) {
    const replace: T[] = [];

    const parentPath = findPathInsideArray(insertPath);
    if (!parentPath) {
        throw Error('resolveArrayPattern: Parent node inside a container was not found.');
    }

    // To collapse the array pattern, we first create a separate variable, which will
    // store the result of the init expression. We insert it right before we
    // perform assignments.
    if (!is.identifier(init)) {
        const tmp = scopePath.scope.generateUidIdentifier();
        parentPath.insertBefore([
            b.variableDeclaration('const', [
                b.variableDeclarator(tmp, init)
            ])
        ]);
        init = tmp;
    }

    // For each element in the array pattern, we create an assignment expression,
    // which each takes the ith element of the right expression.
    for (let i = 0; i < id.elements.length; i++) {
        const elementIdent = id.elements[i];
        const elementValue = b.memberExpression(
            init, b.literal(i), true
        );

        replace.push(createFn(elementIdent, elementValue));
    }

    scopePath.replaceWithMultiple(replace);
}

export function replaceObjectPattern<T extends Node>(
    id: ObjectPattern,
    init: Expression,
    scopePath: NodePath<T>,
    createFn: (pattern: Pattern, value: MemberExpression) => T,
    insertPath: NodePath = scopePath
) {
    const replace: T[] = [];

    const parentPath = findPathInsideArray(insertPath);
    if (!parentPath) {
        throw Error('resolveArrayPattern: Parent node inside a container was not found.');
    }

    // To collapse the array pattern, we first create a separate variable, which will
    // store the result of the init expression. We insert it right before we
    // perform assignments.
    if (!is.identifier(init)) {
        const tmp = scopePath.scope.generateUidIdentifier();
        parentPath.insertBefore([
            b.variableDeclaration('const', [
                b.variableDeclarator(tmp, init)
            ])
        ]);
        init = tmp;
    }

    // For each element in the array pattern, we create an assignment expression,
    // which each takes the ith element of the right expression.
    for (let i = 0; i < id.properties.length; i++) {
        const property = id.properties[i];
        if (is.restElement(property)) {
            throw Error('resolveObjectPattern: RestElement property not supported yet.');
        }

        const elementIdent = property.value;
        const elementValue = b.memberExpression(init, property.key);

        replace.push(createFn(elementIdent, elementValue));
    }

    scopePath.replaceWithMultiple(replace);
}