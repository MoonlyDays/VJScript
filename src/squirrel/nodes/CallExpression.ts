//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {CallExpression} from 'estree';

import {generate} from '../handler';
import {generateArguments} from '../helpers/generator';
import {NodeHandler} from './NodeHandler';

export default class extends NodeHandler<CallExpression> {

    * handleGenerate(node: CallExpression): Generator<string, void, unknown> {

        yield generate(node.callee);
        yield '(';
        yield* generateArguments(node.arguments);
        yield ')';
    }
}