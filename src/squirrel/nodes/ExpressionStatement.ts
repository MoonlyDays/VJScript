//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {ExpressionStatement} from 'estree';

import {generate} from '../generate';
import {NodeHandler} from './NodeHandler';

export default class extends NodeHandler<ExpressionStatement> {

    * handleGenerate(node: ExpressionStatement): Generator<string, void, unknown> {
        yield generate(node.expression);
    }
}