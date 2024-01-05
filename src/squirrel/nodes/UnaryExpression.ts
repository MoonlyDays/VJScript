//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {UnaryExpression} from 'estree';

import {generate} from '../generate';
import {NodeHandler} from './NodeHandler';

export default class extends NodeHandler<UnaryExpression> {
    * handleGenerate(node: UnaryExpression): Generator<string, void, unknown> {
        yield '(';
        yield node.operator;
        yield ' ';
        yield generate(node.argument);
        yield ')';
    }
}