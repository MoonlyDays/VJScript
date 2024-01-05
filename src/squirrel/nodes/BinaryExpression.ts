//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {BinaryExpression} from 'estree';
import {NodePath} from 'estree-toolkit';

import {generateBinaryOperatorExpression} from '../helpers/generator';
import {NodeHandler} from './NodeHandler';

export default class extends NodeHandler<BinaryExpression> {

    handlePrepare(path: NodePath<BinaryExpression>) {
        const node = path.node;
        if (node.operator == '===')
            node.operator = '==';
    }

    * handleGenerate(node: BinaryExpression): Generator<string, void, unknown> {
        yield '(';
        yield* generateBinaryOperatorExpression(node);
        yield ')';
    }
}