//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {ConditionalExpression} from 'estree';

import {codeGen} from '../handler';
import {NodeHandler} from './NodeHandler';

export default class extends NodeHandler<ConditionalExpression> {
    * handleCodeGen(node: ConditionalExpression): Generator<string, void, unknown> {
        yield codeGen(node.test);
        yield ' ? ';
        yield codeGen(node.consequent);
        yield ' : ';
        yield codeGen(node.alternate);
    }
}