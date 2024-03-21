//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {BinaryExpression} from 'estree';
import {NodePath, builders as b} from 'estree-toolkit';

import {NodeHandler} from './NodeHandler';
import {GeneratorHelpers} from "../helpers/GeneratorHelpers";
import {IDENTIFIER_HELPER_EQUAL_LOOSE, IDENTIFIER_HELPER_EQUAL_STRICT} from "../consts";

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

        if (node.operator == "==") {
            path.replaceWith(b.callExpression(
                b.identifier(IDENTIFIER_HELPER_EQUAL_LOOSE),
                [node.left, node.right]
            ));
            return;
        }
    }

    * handleCodeGen(node: BinaryExpression): Generator<string, void, unknown> {
        yield '(';
        yield* GeneratorHelpers.binaryOperatorExpression(node);
        yield ')';
    }
}