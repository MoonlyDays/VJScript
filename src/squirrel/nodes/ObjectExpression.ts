//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {ObjectExpression} from 'estree';

import {GeneratorHelpers} from '../helpers/GeneratorHelpers';
import {NodeHandler} from './NodeHandler';

export default class extends NodeHandler<ObjectExpression> {
    * handleCodeGen(node: ObjectExpression): Generator<string, void, unknown> {
        yield* GeneratorHelpers.withScope(() => GeneratorHelpers.body({
            body: node.properties
        }));
    }
}