//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {FunctionDeclaration} from 'estree';

import {NodeHandler} from './NodeHandler';
import {GeneratorHelpers} from "../helpers/GeneratorHelpers";

export default class extends NodeHandler<FunctionDeclaration> {

    handleCodeGen(node: FunctionDeclaration): Generator<string, void, unknown> {
        return GeneratorHelpers.function(node);
    }
}