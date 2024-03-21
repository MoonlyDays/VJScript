//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {ConditionalExpression} from 'estree';

import {generateCode} from '../handler';
import {NodeHandler} from './NodeHandler';

export default class extends NodeHandler<ConditionalExpression> {
    * handleCodeGen(node: ConditionalExpression): Generator<string, void, unknown> {
        yield generateCode(node.test);
        yield ' ? ';
        yield generateCode(node.consequent);
        yield ' : ';
        yield generateCode(node.alternate);
    }
}