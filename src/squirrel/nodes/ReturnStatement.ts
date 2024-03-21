//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {ReturnStatement} from 'estree';

import {codeGen} from '../handler';
import {NodeHandler} from './NodeHandler';

export default class extends NodeHandler<ReturnStatement> {
    * handleCodeGen(node: ReturnStatement): Generator<string, void, unknown> {
        yield 'return';

        if (node.argument) {
            yield ' ';
            yield codeGen(node.argument);
        }
    }
}