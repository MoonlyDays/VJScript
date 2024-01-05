//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {ArrayExpression} from 'estree';

import {generateArguments} from '../helpers/generator';
import {NodeHandler} from './NodeHandler';

export default class extends NodeHandler<ArrayExpression> {

    * handleGenerate(node: ArrayExpression): Generator<string, void, unknown> {

        yield '[';
        yield* generateArguments(node.elements);
        yield ']';
    }
}