//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {ForStatement} from 'estree';

import {generate} from '../handler';
import {NodeHandler} from './NodeHandler';

export default class extends NodeHandler<ForStatement> {

    * handleGenerate(node: ForStatement): Generator<string, void, unknown> {

        yield 'for(';
        yield generate(node.init);
        yield ';';
        yield generate(node.test);
        yield ';';
        yield generate(node.update);
        yield ')';

        yield generate(node.body);
    }

}