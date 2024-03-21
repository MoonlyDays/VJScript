//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {CallExpression} from 'estree';

import {codeGen} from '../handler';
import {GeneratorHelpers} from '../helpers/GeneratorHelpers';
import {NodeHandler} from './NodeHandler';

export default class extends NodeHandler<CallExpression> {

    * handleCodeGen(node: CallExpression): Generator<string, void, unknown> {

        yield codeGen(node.callee);
        yield '(';
        yield* GeneratorHelpers.arguments(node.arguments);
        yield ')';
    }
}