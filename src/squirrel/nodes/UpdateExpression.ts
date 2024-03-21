//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {UpdateExpression} from 'estree';

import {generateCode} from '../handler';
import {NodeHandler} from './NodeHandler';

export default class extends NodeHandler<UpdateExpression> {

    * handleCodeGen(node: UpdateExpression): Generator<string, void, unknown> {
        if (node.prefix) yield node.operator;
        yield generateCode(node.argument);
        if (!node.prefix) yield node.operator;
    }
}