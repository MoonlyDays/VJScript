//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {ObjectExpression} from 'estree';

import {NodeHandler} from './NodeHandler';
import {GeneratorHelpers} from "../helpers/GeneratorHelpers";

export default class extends NodeHandler<ObjectExpression> {
    * handleCodeGen(node: ObjectExpression): Generator<string, void, unknown> {
        yield* GeneratorHelpers.withScope(() => GeneratorHelpers.body({
            body: node.properties
        }));
    }
}