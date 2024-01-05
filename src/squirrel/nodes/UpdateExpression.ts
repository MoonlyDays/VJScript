//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {UpdateExpression} from 'estree';

import {generate} from '../handler';
import {NodeHandler} from './NodeHandler';

export default class extends NodeHandler<UpdateExpression> {

    * handleGenerate(node: UpdateExpression): Generator<string, void, unknown> {
        if (node.prefix) yield node.operator;
        yield generate(node.argument);
        if (!node.prefix) yield node.operator;
    }
}