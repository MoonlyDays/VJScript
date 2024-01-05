//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {ReturnStatement} from 'estree';

import {generate} from '../handler';
import {NodeHandler} from './NodeHandler';

export default class extends NodeHandler<ReturnStatement> {
    * handleGenerate(node: ReturnStatement): Generator<string, void, unknown> {
        yield 'return';

        if (node.argument) {
            yield ' ';
            yield generate(node.argument);
        }
    }
}