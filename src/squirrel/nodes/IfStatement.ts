//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {IfStatement} from 'estree';

import {generate} from '../handler';
import {NodeHandler} from './NodeHandler';

export default class extends NodeHandler<IfStatement> {

    * handleGenerate(node: IfStatement): Generator<string, void, unknown> {

        yield 'if (';
        yield generate(node.test);
        yield ') ';
        yield generate(node.consequent);

        if (node.alternate) {
            yield ' else ';
            yield generate(node.alternate);
        }
    }
}