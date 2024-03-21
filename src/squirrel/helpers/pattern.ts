import {ArrayPattern, Expression, MemberExpression, Node, ObjectPattern, Pattern} from 'estree';
import {is, NodePath} from 'estree-toolkit';
import {builders as b} from 'estree-toolkit';

import {findParentInsideContainer} from './search';

export function destructureArrayPattern<T extends Node>(
    id: ArrayPattern,
    init: Expression,
    scopePath: NodePath<T>,
    createNodeFn: (elementIdent: Pattern, elementValue: MemberExpression) => T,
    insertPath: NodePath = scopePath
) {
    destructure(
        id, init, scopePath,
        function* (id: ArrayPattern) {
            // For each element in the array pattern, we create an assignment expression,
            // which each takes the ith element of the right expression.
            for (let i = 0; i < id.elements.length; i++) {
                const elementIdent = id.elements[i];
                const elementValue = b.memberExpression(
                    init, b.literal(i), true
                );
                yield createNodeFn(elementIdent, elementValue);
            }
        }, insertPath);
}

export function destructureObjectPattern<T extends Node>(
    id: ObjectPattern,
    init: Expression,
    scopePath: NodePath<T>,
    createNodeFn: (elementIdent: Pattern, elementValue: MemberExpression) => T,
    insertPath: NodePath = scopePath
) {
    destructure(
        id, init, scopePath,
        function* (id: ObjectPattern) {
            for (let i = 0; i < id.properties.length; i++) {
                const property = id.properties[i];
                if (is.restElement(property)) {
                    throw Error('destructureObject: RestElement property not supported yet.');
                }

                const elementIdent = property.value;
                const elementValue = b.memberExpression(init, property.key);

                yield createNodeFn(elementIdent, elementValue);
            }
        }, insertPath);
}

function destructure<T extends Node, P extends Pattern>(
    id: P,
    init: Expression,
    scopePath: NodePath<T>,
    generateFn: (id: P) => Generator<T, void>,
    insertPath: NodePath,
) {
    const parentPath = findParentInsideContainer(insertPath);
    if (!parentPath) {
        throw Error('destructure: Parent node inside a container was not found.');
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

    const replace = [...generateFn(id)];
    scopePath.replaceWithMultiple(replace);
}
