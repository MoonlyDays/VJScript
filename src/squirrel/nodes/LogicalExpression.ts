//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {LogicalExpression} from 'estree';

import {NodeHandler} from './NodeHandler';
import {GeneratorHelpers} from "../helpers/GeneratorHelpers";

export default class extends NodeHandler<LogicalExpression> {
    handleCodeGen(node: LogicalExpression): Generator<string, void, unknown> {
        return GeneratorHelpers.binaryOperatorExpression(node);
    }
}