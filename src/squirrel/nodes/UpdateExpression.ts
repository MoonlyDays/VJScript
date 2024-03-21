//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {UpdateExpression} from 'estree';

import {codeGen} from '../handler';
import {NodeHandler} from './NodeHandler';

export default class extends NodeHandler<UpdateExpression> {

    * handleCodeGen(node: UpdateExpression): Generator<string, void, unknown> {
        if (node.prefix) yield node.operator;
        yield codeGen(node.argument);
        if (!node.prefix) yield node.operator;
    }
}