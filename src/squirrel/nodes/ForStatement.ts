//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {ForStatement} from 'estree';

import {generateCode} from '../handler';
import {NodeHandler} from './NodeHandler';

export default class extends NodeHandler<ForStatement> {

    * handleCodeGen(node: ForStatement): Generator<string, void, unknown> {

        yield 'for(';
        yield generateCode(node.init);
        yield ';';
        yield generateCode(node.test);
        yield ';';
        yield generateCode(node.update);
        yield ')';

        yield generateCode(node.body);
    }

}