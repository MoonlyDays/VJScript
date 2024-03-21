//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {ThisExpression} from 'estree';

import {NodeHandler} from './NodeHandler';

export default class extends NodeHandler<ThisExpression> {
    * handleCodeGen(): Generator<string, void, unknown> {
        yield 'this';
    }
}