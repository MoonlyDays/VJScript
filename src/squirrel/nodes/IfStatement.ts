//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {IfStatement} from 'estree';

import {generateCode} from '../handler';
import {NodeHandler} from './NodeHandler';

export default class extends NodeHandler<IfStatement> {

    * handleCodeGen(node: IfStatement): Generator<string, void, unknown> {

        yield 'if (';
        yield generateCode(node.test);
        yield ') ';
        yield generateCode(node.consequent);

        if (node.alternate) {
            yield ' else ';
            yield generateCode(node.alternate);
        }
    }
}