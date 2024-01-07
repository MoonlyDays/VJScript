//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {AssignmentExpression, AssignmentOperator, ClassBody} from 'estree';
import {builders as b, is, NodePath} from 'estree-toolkit';

import {ensurePropertyDefinitionInClass} from '../helpers/class';
import {deepestMemberExpression} from '../helpers/general';
import {generateBinaryOperatorExpression} from '../helpers/generator';
import {replaceArrayPattern, replaceObjectPattern} from '../helpers/patterns';
import {NodeHandler} from './NodeHandler';
import {IDENTIFIER_DEFAULT_EXPORT} from '../helpers/consts';

export default class extends NodeHandler<AssignmentExpression> {

    handlePrepare(path: NodePath<AssignmentExpression>) {

        const node = path.node;
        if (is.arrayPattern(node.left)) {
            replaceArrayPattern(node.left, node.right, path, (k, v) => b.assignmentExpression(node.operator, k, v));
            return;
        }

        if (is.objectPattern(node.left)) {
            replaceObjectPattern(node.left, node.right, path, (k, v) => b.assignmentExpression(node.operator, k, v));
            return;
        }

        // Handle nullish coalescing assignment operator.
        if (node.operator == '??=') {
            if (is.expression(node.left)) {
                // Replace it with another assignment expression inside a null checking if block.
                path.replaceWith(b.ifStatement(
                    b.binaryExpression('==', node.left, b.literal(null)),
                    b.expressionStatement(b.assignmentExpression('=', node.left, node.right))
                ));
                return;
            }

            throw Error('AssignmentExpression: left side of the nullish coalescing assignment operator is not an expression?');
        }

        if (shouldUseSlotOperator(path)) {
            // Hack to change the operator to Squirrel slot creation operator "<-" so that typescript
            // doesn't scream at us about an invalid operator.
            (node.operator as AssignmentOperator | '<-') = '<-';

            handleDefaultAssignment(path);
        }

        handleClassPropertyAssignment(path);
    }

    handleGenerate(node: AssignmentExpression): Generator<string, void, unknown> {
        return generateBinaryOperatorExpression(node);
    }
}

/**
 *
 */
function handleDefaultAssignment(path: NodePath<AssignmentExpression>) {

    const leftPath = path.get('left');
    if (is.identifier(leftPath) && leftPath.node.name == IDENTIFIER_DEFAULT_EXPORT) {

        leftPath.replaceWith(b.memberExpression(
            b.thisExpression(),
            b.identifier(IDENTIFIER_DEFAULT_EXPORT)
        ));
    }
}

function handleClassPropertyAssignment(path: NodePath<AssignmentExpression>) {

    // Special case for assigning value to a class field.
    const classBodyPath = path.findParent<ClassBody>(is.classBody);
    if (!classBodyPath)
        return;

    const leftPath = path.get('left');
    const deepestMemberExpr = deepestMemberExpression(leftPath);
    if (!is.memberExpression(deepestMemberExpr))
        return;

    const objectPath = deepestMemberExpr.get('object');
    const propPath = deepestMemberExpr.get('property');

    if (is.thisExpression(objectPath) && is.identifier(propPath)) {
        ensurePropertyDefinitionInClass(classBodyPath, propPath.node.name);
    }
}

function shouldUseSlotOperator(path: NodePath<AssignmentExpression>) {

    // If we assign to a previously declared identifier, we don't need to use the slot operator.
    const leftPath = path.get('left');
    if (is.identifier(leftPath)) {
        if (leftPath.scope.hasBinding(leftPath.node.name)) {
            // console.log(leftPath.scope.getBinding(leftPath.node.name).path.node);
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

