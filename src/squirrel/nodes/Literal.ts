//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {Literal} from 'estree';

import {NodeHandler} from './NodeHandler';

export default class extends NodeHandler<Literal> {

    * handleGenerate(node: Literal): Generator<string, void, unknown> {
        yield JSON.stringify(node.value);
    }
}