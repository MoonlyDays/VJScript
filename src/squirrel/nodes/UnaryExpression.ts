//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {UnaryExpression} from 'estree';
import {builders, is, NodePath} from 'estree-toolkit';

import {generateCode} from '../handler';
import {NodeHandler, TraverseState} from './NodeHandler';

export default class extends NodeHandler<UnaryExpression> {

    handlePrepare(path: NodePath<UnaryExpression>, state: TraverseState) {

        const node = path.node;
        if (node.operator == 'void' && is.literal(node.argument) && node.argument.value == 0) {
            path.replaceWith(builders.literal(null));
        }

    }

    * handleCodeGen(node: UnaryExpression): Generator<string, void, unknown> {
        yield '(';
        yield node.operator;
        yield ' ';
        yield generateCode(node.argument);
        yield ')';
    }
}