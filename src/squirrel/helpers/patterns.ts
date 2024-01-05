//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {ArrayPattern, Expression, MemberExpression, Node, ObjectPattern, Pattern} from 'estree';
import {is, NodePath} from 'estree-toolkit';
import {builders as b} from 'estree-toolkit';

import {findPathInsideArray} from './general';

export function resolveArrayPattern<T extends Node>(
    path: NodePath<T>,
    id: ArrayPattern,
    init: Expression,
    createFn: (pattern: Pattern, value: MemberExpression) => T,
    pivotPath: NodePath = path
) {
    const replace: T[] = [];

    const parentPath = findPathInsideArray(pivotPath);
    if (!parentPath) {
        throw Error('resolveArrayPattern: Parent node inside a container was not found.');
    }

    // To collapse the array pattern, we first create a separate variable, which will
    // store the result of the init expression. We insert it right before we
    // perform assignments.
    const tmp = path.scope.generateUidIdentifier();
    parentPath.insertBefore([
        b.variableDeclaration('const', [
            b.variableDeclarator(tmp, init)
        ])
    ]);

    // For each element in the array pattern, we create an assignment expression,
    // which each takes the ith element of the right expression.
    for (let i = 0; i < id.elements.length; i++) {
        const elementIdent = id.elements[i];
        const elementValue = b.memberExpression(
            tmp, b.literal(i), true
        );

        replace.push(createFn(elementIdent, elementValue));
    }

    path.replaceWithMultiple(replace);
}


export function resolveObjectPattern<T extends Node>(
    path: NodePath<T>,
    id: ObjectPattern,
    init: Expression,
    createFn: (pattern: Pattern, value: MemberExpression) => T,
    pivotPath: NodePath = path
) {
    const replace: T[] = [];

    const parentPath = findPathInsideArray(pivotPath);
    if (!parentPath) {
        throw Error('resolveArrayPattern: Parent node inside a container was not found.');
    }

    // To collapse the array pattern, we first create a separate variable, which will
    // store the result of the init expression. We insert it right before we
    // perform assignments.
    const tmp = path.scope.generateUidIdentifier();
    parentPath.insertBefore([
        b.variableDeclaration('const', [
            b.variableDeclarator(tmp, init)
        ])
    ]);

    // For each element in the array pattern, we create an assignment expression,
    // which each takes the ith element of the right expression.
    for (let i = 0; i < id.properties.length; i++) {
        const property = id.properties[i];
        if (is.restElement(property)) {
            throw Error('resolveObjectPattern: RestElement property not supported yet.');
        }

        const elementIdent = property.value;
        const elementValue = b.memberExpression(tmp, property.key);

        replace.push(createFn(elementIdent, elementValue));
    }

    path.replaceWithMultiple(replace);
}