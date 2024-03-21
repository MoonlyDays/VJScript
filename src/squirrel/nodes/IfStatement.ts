//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {IfStatement} from 'estree';

import {codeGen} from '../handler';
import {NodeHandler} from './NodeHandler';

export default class extends NodeHandler<IfStatement> {

    * handleCodeGen(node: IfStatement): Generator<string, void, unknown> {

        yield 'if (';
        yield codeGen(node.test);
        yield ') ';
        yield codeGen(node.consequent);

        if (node.alternate) {
            yield ' else ';
            yield codeGen(node.alternate);
        }
    }
}