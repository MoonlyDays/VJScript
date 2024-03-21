//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {BinaryExpression} from 'estree';
import {builders as b, NodePath} from 'estree-toolkit';

import {IDENTIFIER_HELPER_EQUAL_LOOSE, IDENTIFIER_HELPER_EQUAL_STRICT} from '../consts';
import {generateBinaryOperatorExpressionCode} from '../helpers/generator';
import {NodeHandler} from './NodeHandler';

export default class extends NodeHandler<BinaryExpression> {

    handlePrepare(path: NodePath<BinaryExpression>) {
        const node = path.node;
        if (node.operator == '===') {
            path.replaceWith(b.callExpression(
                b.identifier(IDENTIFIER_HELPER_EQUAL_STRICT),
                [node.left, node.right]
            ));
            return;
        }

        if (node.operator == '==') {
            path.replaceWith(b.callExpression(
                b.identifier(IDENTIFIER_HELPER_EQUAL_LOOSE),
                [node.left, node.right]
            ));
            return;
        }
    }

    * handleCodeGen(node: BinaryExpression): Generator<string, void, unknown> {
        yield '(';
        yield* generateBinaryOperatorExpressionCode(node);
        yield ')';
    }
}