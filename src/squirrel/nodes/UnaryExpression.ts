//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {UnaryExpression} from 'estree';

import {generate} from '../handler';
import {NodeHandler, TraverseState} from './NodeHandler';
import {builders, is, NodePath} from 'estree-toolkit';
import path from 'path';

export default class extends NodeHandler<UnaryExpression> {

    handlePrepare(path: NodePath<UnaryExpression>, state: TraverseState) {

        const node = path.node;
        if (node.operator == 'void' && is.literal(node.argument) && node.argument.value == 0) {
            path.replaceWith(builders.literal(null));
        }

    }

    * handleGenerate(node: UnaryExpression): Generator<string, void, unknown> {
        yield '(';
        yield node.operator;
        yield ' ';
        yield generate(node.argument);
        yield ')';
    }
}