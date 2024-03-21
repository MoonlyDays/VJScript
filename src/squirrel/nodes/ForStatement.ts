//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {ForStatement} from 'estree';

import {codeGen} from '../handler';
import {NodeHandler} from './NodeHandler';

export default class extends NodeHandler<ForStatement> {

    * handleCodeGen(node: ForStatement): Generator<string, void, unknown> {

        yield 'for(';
        yield codeGen(node.init);
        yield ';';
        yield codeGen(node.test);
        yield ';';
        yield codeGen(node.update);
        yield ')';

        yield codeGen(node.body);
    }

}