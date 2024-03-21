//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {ArrowFunctionExpression} from 'estree';

import {codeGen} from '../handler';
import {GeneratorHelpers} from '../helpers/GeneratorHelpers';
import {NodeHandler} from './NodeHandler';

export default class extends NodeHandler<ArrowFunctionExpression> {

    * handleCodeGen(node: ArrowFunctionExpression): Generator<string, void, unknown> {
        yield '@(';
        yield* GeneratorHelpers.arguments(node.params);
        yield ') ';
        yield codeGen(node.body);
    }
}