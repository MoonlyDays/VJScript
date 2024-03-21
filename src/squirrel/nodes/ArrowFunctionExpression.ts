//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {ArrowFunctionExpression} from 'estree';

import {generateCode} from '../handler';
import {generateArgumentsCode} from '../helpers/generator';
import {NodeHandler} from './NodeHandler';

export default class extends NodeHandler<ArrowFunctionExpression> {

    * handleCodeGen(node: ArrowFunctionExpression): Generator<string, void, unknown> {
        yield '@(';
        yield* generateArgumentsCode(node.params);
        yield ') ';
        yield generateCode(node.body);
    }
}