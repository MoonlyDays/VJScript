//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {LogicalExpression} from 'estree';

import {GeneratorHelpers} from '../helpers/GeneratorHelpers';
import {NodeHandler} from './NodeHandler';

export default class extends NodeHandler<LogicalExpression> {
    handleCodeGen(node: LogicalExpression): Generator<string, void, unknown> {
        return GeneratorHelpers.binaryOperatorExpression(node);
    }
}