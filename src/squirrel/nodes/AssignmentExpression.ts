//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {AssignmentExpression, AssignmentOperator} from 'estree';
import {builders as b,is, NodePath} from 'estree-toolkit';

import {findPathInsideArray, shouldUseSlotOperator} from '../helpers/general';
import {generateBinaryOperatorExpression} from '../helpers/generator';
import {NodeHandler} from './NodeHandler';

export default class extends NodeHandler<AssignmentExpression> {

    handlePrepare(path: NodePath<AssignmentExpression>) {

        const node = path.node;

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

        const left = node.left;
        if (is.arrayPattern(left)) {

            // TODO: Provide helper functions to deal with Array/ObjectPattern nodes.
            const replace: AssignmentExpression[] = [];

            // Try to find a path that is contained inside an array.
            const parentPath = findPathInsideArray(path);
            if (!parentPath) {
                throw Error('AssignmentExpression: Parent node inside a container was not found.');
            }

            // To collapse the array pattern, we first create a separate variable, which will
            // store the result of the right side expression. We insert it right before we
            // perform assignments.
            const value = node.right;
            const tmp = parentPath.scope.generateUidIdentifier();

            parentPath.insertBefore([
                b.variableDeclaration('const', [
                    b.variableDeclarator(tmp, value)
                ])
            ]);

            // For each element in the array pattern, we create an assignment expression,
            // which each takes the ith element of the right expression.
            for (let i = 0; i < left.elements.length; i++) {
                const elementIdent = left.elements[i];
                const elementValue = b.memberExpression(
                    tmp, b.literal(i), true
                );

                replace.push(
                    b.assignmentExpression('=', elementIdent, elementValue)
                );
            }

            path.replaceWithMultiple(replace);
            return;
        }

        if (shouldUseSlotOperator(path)) {
            // Hack to change the operator to Squirrel slot creation operator "<-" so that typescript
            // doesn't scream at us about an invalid operator.
            (node.operator as AssignmentOperator | '<-') = '<-';
        }
    }

    handleGenerate(node: AssignmentExpression): Generator<string, void, unknown> {
        return generateBinaryOperatorExpression(node);
    }
}
