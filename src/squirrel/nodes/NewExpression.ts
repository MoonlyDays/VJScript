//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {NewExpression} from 'estree';

import {generate} from '../generate';
import {generateArguments} from '../helpers/generator';
import {NodeHandler} from './NodeHandler';

export default class extends NodeHandler<NewExpression> {
    * handleGenerate(node: NewExpression): Generator<string, void, unknown> {
        yield generate(node.callee);
        yield '(';
        yield* generateArguments(node.arguments);
        yield ')';
    }
}