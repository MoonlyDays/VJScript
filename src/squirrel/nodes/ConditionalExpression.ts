//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {ConditionalExpression} from 'estree';

import {generate} from '../handler';
import {NodeHandler} from './NodeHandler';

export default class extends NodeHandler<ConditionalExpression> {
    * handleGenerate(node: ConditionalExpression): Generator<string, void, unknown> {
        yield generate(node.test);
        yield ' ? ';
        yield generate(node.consequent);
        yield ' : ';
        yield generate(node.alternate);
    }
}