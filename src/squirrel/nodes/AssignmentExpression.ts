//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {AssignmentExpression, AssignmentOperator} from 'estree';
import {builders as b, is, NodePath} from 'estree-toolkit';

import {shouldUseSlotOperator} from '../helpers/general';
import {generateBinaryOperatorExpression} from '../helpers/generator';
import {resolveArrayPattern, resolveObjectPattern} from '../helpers/patterns';
import {NodeHandler} from './NodeHandler';

export default class extends NodeHandler<AssignmentExpression> {

    handlePrepare(path: NodePath<AssignmentExpression>) {

        const node = path.node;


        if (is.arrayPattern(node.left)) {
            resolveArrayPattern(path, node.left, node.right, (k, v) => b.assignmentExpression(node.operator, k, v));
            return;
        }

        if (is.objectPattern(node.left)) {
            resolveObjectPattern(path, node.left, node.right, (k, v) => b.assignmentExpression(node.operator, k, v));
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
        }
    }

    handleGenerate(node: AssignmentExpression): Generator<string, void, unknown> {
        return generateBinaryOperatorExpression(node);
    }
}
