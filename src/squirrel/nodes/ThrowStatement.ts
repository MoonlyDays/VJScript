//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {ThrowStatement} from 'estree';

import {generateCode} from '../handler';
import {NodeHandler} from './NodeHandler';

export default class extends NodeHandler<ThrowStatement> {
    * handleCodeGen(node: ThrowStatement): Generator<string, void, unknown> {
        yield 'throw ';
        yield generateCode(node.argument);
    }
}