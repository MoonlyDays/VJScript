//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {ExpressionStatement} from 'estree';

import {generateCode} from '../handler';
import {NodeHandler} from './NodeHandler';

export default class extends NodeHandler<ExpressionStatement> {

    * handleCodeGen(node: ExpressionStatement): Generator<string, void, unknown> {
        yield generateCode(node.expression);
    }
}