//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {AssignmentPattern, Function as FunctionNode} from 'estree';
import {builders as b, is, NodePath} from 'estree-toolkit';

import {generateBinaryOperatorExpressionCode} from '../helpers/generator';
import {NodeHandler} from './NodeHandler';

export default class extends NodeHandler<AssignmentPattern> {

    handlePrepare(path: NodePath<AssignmentPattern>) {
        const node = path.node;

        // If we're using an assignment pattern inside a class method, or a function.
        const functionPath = path.findParent(is.function) as NodePath<FunctionNode>;
        if (functionPath) {

            const bodyPath = functionPath.get('body');
            if (!is.blockStatement(bodyPath)) {
                throw Error('AssignmentPattern: containing function\'s body is not a Block Statement.');
            }

            bodyPath.unshiftContainer('body', [
                b.expressionStatement(b.assignmentExpression(
                    '??=', node.left, node.right
                ))
            ]);

            node.right = b.literal(null);
        }
    }

    handleCodeGen(node: AssignmentPattern): Generator<string, void, unknown> {
        return generateBinaryOperatorExpressionCode({
            operator: '=',
            left: node.left,
            right: node.right
        });
    }

}