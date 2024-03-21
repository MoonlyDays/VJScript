//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {FunctionDeclaration} from 'estree';

import {generateFunctionCode} from '../helpers/generator';
import {NodeHandler} from './NodeHandler';

export default class extends NodeHandler<FunctionDeclaration> {

    handleCodeGen(node: FunctionDeclaration): Generator<string, void, unknown> {
        return generateFunctionCode(node);
    }
}