//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {ArrayExpression} from 'estree';

import {generateArgumentsCode} from '../helpers/generator';
import {NodeHandler} from './NodeHandler';

export default class extends NodeHandler<ArrayExpression> {

    * handleCodeGen(node: ArrayExpression): Generator<string, void, unknown> {

        yield '[';
        yield* generateArgumentsCode(node.elements);
        yield ']';
    }
}