//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {ThrowStatement} from 'estree';

import {generate} from '../handler';
import {NodeHandler} from './NodeHandler';

export default class extends NodeHandler<ThrowStatement> {
    * handleGenerate(node: ThrowStatement): Generator<string, void, unknown> {
        yield 'throw ';
        yield generate(node.argument);
    }
}